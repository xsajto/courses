"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { computeMasteryLevel } from "@/lib/xp";
import { getTodayUTC, getYesterdayUTC, computeStreak } from "@/lib/streaks";
import { checkNewAchievements } from "@/lib/achievement-checker";

export interface DailyStats {
  currentStreak: number;
  longestStreak: number;
  dailyLessonGoal: number;
  dailyLessonsCompleted: number;
  dailyXpEarned: number;
}

export interface ProgressResult {
  success: boolean;
  masteryLevel?: number;
  error?: string;
  dailyStats?: DailyStats;
  newAchievements?: string[];
}

export async function saveLessonProgress(
  lessonId: string,
  stats: {
    accuracy: number;
    wpm?: number;
    xp?: number;
    baseXp?: number;
    bonusXp?: number;
    totalXp?: number;
    errorCount?: number;
    errors?: string;
    totalTime?: number;
    passed?: boolean;
  }
): Promise<ProgressResult> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId }
  });

  if (!lesson) {
    return { success: false, error: "lesson_not_found" };
  }

  const passed = stats.passed ?? true;
  const totalXp = passed ? (stats.totalXp ?? stats.xp ?? 10) : 0;
  const userId = session.user.id!;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Always create an attempt record
    await tx.lessonAttempt.create({
      data: {
        userId,
        lessonId,
        baseXp: stats.baseXp ?? totalXp,
        bonusXp: stats.bonusXp ?? 0,
        totalXp,
        accuracy: stats.accuracy,
        wpm: stats.wpm,
        errorCount: stats.errorCount,
        errors: stats.errors,
        totalTime: stats.totalTime,
        passed,
      },
    });

    let masteryLevel = -1;

    // 2. If passed, upsert the summary progress record
    if (passed) {
      const existing = await tx.userLessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });

      const newMastery = existing
        ? computeMasteryLevel(existing.masteryLevel, true)
        : 0;

      const bestAccuracy = Math.max(stats.accuracy, existing?.bestAccuracy ?? 0);
      const bestWpm = Math.max(stats.wpm ?? 0, existing?.bestWpm ?? 0);
      const attemptCount = (existing?.attemptCount ?? 0) + 1;

      await tx.userLessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: {
          completedAt: new Date(),
          accuracy: stats.accuracy,
          wpm: stats.wpm,
          xp: totalXp,
          errorCount: stats.errorCount,
          errors: stats.errors,
          totalTime: stats.totalTime,
          bestAccuracy,
          bestWpm,
          attemptCount,
          masteryLevel: newMastery,
        },
        create: {
          userId,
          lessonId,
          completedAt: new Date(),
          accuracy: stats.accuracy,
          wpm: stats.wpm,
          xp: totalXp,
          errorCount: stats.errorCount,
          errors: stats.errors,
          totalTime: stats.totalTime,
          bestAccuracy: stats.accuracy,
          bestWpm: stats.wpm,
          attemptCount: 1,
          masteryLevel: 0,
        },
      });

      masteryLevel = newMastery;
    }

    // 3. Update daily activity & streaks
    const today = getTodayUTC();

    const dailyActivity = await tx.dailyActivity.upsert({
      where: { userId_date: { userId, date: today } },
      update: {
        xpEarned: { increment: totalXp },
        lessonsCompleted: passed ? { increment: 1 } : undefined,
      },
      create: {
        userId,
        date: today,
        xpEarned: totalXp,
        lessonsCompleted: passed ? 1 : 0,
      },
    });

    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    const newStreak = computeStreak(user.lastActivityDate, user.currentStreak);
    const newLongest = Math.max(newStreak, user.longestStreak);

    await tx.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActivityDate: today,
      },
    });

    return {
      masteryLevel,
      dailyStats: {
        currentStreak: newStreak,
        longestStreak: newLongest,
        dailyLessonGoal: user.dailyLessonGoal,
        dailyLessonsCompleted: dailyActivity.lessonsCompleted,
        dailyXpEarned: dailyActivity.xpEarned,
      },
    };
  });

  // 4. Check achievements (outside transaction for performance)
  let newAchievements: string[] = [];
  if (passed) {
    try {
      newAchievements = await checkAndAwardAchievements(userId);
    } catch {
      // Non-critical — don't fail the save
    }
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath("/course/[slug]", "page");

  return {
    success: true,
    masteryLevel: result.masteryLevel,
    dailyStats: result.dailyStats,
    newAchievements,
  };
}

async function checkAndAwardAchievements(userId: string): Promise<string[]> {
  // Gather context for achievement checking
  const [user, progressCount, totalXpAgg, perfectCount, goldCount, existingAchievements] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { currentStreak: true, longestStreak: true },
    }),
    prisma.userLessonProgress.count({ where: { userId } }),
    prisma.lessonAttempt.aggregate({
      where: { userId, passed: true },
      _sum: { totalXp: true },
    }),
    prisma.lessonAttempt.count({
      where: { userId, passed: true, accuracy: 100 },
    }),
    prisma.userLessonProgress.count({
      where: { userId, masteryLevel: { gte: 2 } },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    }),
  ]);

  // Count lessons with 95%+ accuracy
  const highAccuracyCount = await prisma.lessonAttempt.count({
    where: { userId, passed: true, accuracy: { gte: 95 } },
  });

  // Best WPM
  const bestWpmAgg = await prisma.userLessonProgress.aggregate({
    where: { userId },
    _max: { bestWpm: true },
  });

  const context = {
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    lessonsCompleted: progressCount,
    totalXp: totalXpAgg._sum.totalXp ?? 0,
    perfectLessons: perfectCount,
    goldLessons: goldCount,
    highAccuracyCount,
    bestWpm: bestWpmAgg._max.bestWpm ?? 0,
  };

  const earned = new Set(existingAchievements.map(a => a.achievementId));
  const newIds = checkNewAchievements(context, earned);

  if (newIds.length > 0) {
    for (const id of newIds) {
      await prisma.userAchievement.upsert({
        where: { userId_achievementId: { userId, achievementId: id } },
        update: {},
        create: { userId, achievementId: id },
      });
    }
  }

  return newIds;
}

export async function getUserDailyStats(): Promise<DailyStats | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      currentStreak: true,
      longestStreak: true,
      dailyLessonGoal: true,
      lastActivityDate: true,
    },
  });

  if (!user) return null;

  const today = getTodayUTC();
  const yesterday = getYesterdayUTC();
  const daily = await prisma.dailyActivity.findUnique({
    where: { userId_date: { userId: session.user.id, date: today } },
  });

  // Determine displayed streak
  let displayStreak = 0;
  if (user.lastActivityDate === today || user.lastActivityDate === yesterday) {
    displayStreak = user.currentStreak;
  }

  return {
    currentStreak: displayStreak,
    longestStreak: user.longestStreak,
    dailyLessonGoal: user.dailyLessonGoal,
    dailyLessonsCompleted: daily?.lessonsCompleted ?? 0,
    dailyXpEarned: daily?.xpEarned ?? 0,
  };
}

export async function updateDailyGoal(goal: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (![1, 3, 5, 10].includes(goal)) {
    throw new Error("Invalid goal value");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { dailyLessonGoal: goal },
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function getLessonHistory(lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.lessonAttempt.findMany({
    where: { userId: session.user.id, lessonId },
    orderBy: { completedAt: "desc" },
    take: 20,
  });
}

export async function updateProfile(data: { name: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: data.name },
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function getReviewData() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const progress = await prisma.userLessonProgress.findMany({
    where: { userId: session.user.id },
    select: {
      lessonId: true,
      completedAt: true,
      bestAccuracy: true,
      masteryLevel: true,
    },
  });

  const now = Date.now();
  return progress
    .map(p => {
      const daysSince = (now - new Date(p.completedAt).getTime()) / (1000 * 60 * 60 * 24);
      const decay = Math.min(1, daysSince / 14);
      const performance = ((p.bestAccuracy ?? 0) / 100) * 0.7 + Math.min(1, p.masteryLevel / 2) * 0.3;
      const urgency = decay * (1 - performance);
      return { lessonId: p.lessonId, urgency, completedAt: p.completedAt.toISOString() };
    })
    .filter(r => r.urgency > 0.3)
    .sort((a, b) => b.urgency - a.urgency);
}

export async function getDifficultKeys(courseSlug?: string) {
  const session = await auth();
  if (!session?.user?.id) return {};

  const attempts = await prisma.lessonAttempt.findMany({
    where: {
      userId: session.user.id,
      errors: { not: null },
      ...(courseSlug ? {
        lesson: {
          unit: {
            section: {
              course: {
                slug: courseSlug
              }
            }
          }
        }
      } : {})
    },
    select: { errors: true },
  });

  const charErrors: Record<string, number> = {};
  for (const attempt of attempts) {
    if (!attempt.errors) continue;
    try {
      const errMap: Record<string, number> = JSON.parse(attempt.errors);
      for (const [char, count] of Object.entries(errMap)) {
        charErrors[char] = (charErrors[char] ?? 0) + count;
      }
    } catch {
      // skip malformed
    }
  }

  return charErrors;
}
