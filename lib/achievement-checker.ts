import { ACHIEVEMENTS } from "./achievements";

export interface AchievementContext {
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  totalXp: number;
  perfectLessons: number;
  goldLessons: number;
  highAccuracyCount: number;
  bestWpm: number;
}

type CheckFn = (ctx: AchievementContext) => boolean;

const CHECKS: Record<string, CheckFn> = {
  // Streak
  "streak-7": (ctx) => ctx.longestStreak >= 7,
  "streak-30": (ctx) => ctx.longestStreak >= 30,
  "streak-100": (ctx) => ctx.longestStreak >= 100,
  "streak-365": (ctx) => ctx.longestStreak >= 365,

  // Lessons
  "lessons-1": (ctx) => ctx.lessonsCompleted >= 1,
  "lessons-10": (ctx) => ctx.lessonsCompleted >= 10,
  "lessons-50": (ctx) => ctx.lessonsCompleted >= 50,
  "lessons-100": (ctx) => ctx.lessonsCompleted >= 100,

  // Performance
  "perfect-first": (ctx) => ctx.perfectLessons >= 1,
  "wpm-40": (ctx) => ctx.bestWpm >= 40,
  "wpm-50": (ctx) => ctx.bestWpm >= 50,
  "accuracy-95-x10": (ctx) => ctx.highAccuracyCount >= 10,

  // XP
  "xp-100": (ctx) => ctx.totalXp >= 100,
  "xp-1000": (ctx) => ctx.totalXp >= 1000,
  "xp-10000": (ctx) => ctx.totalXp >= 10000,

  // Mastery
  "gold-first": (ctx) => ctx.goldLessons >= 1,
  "gold-10": (ctx) => ctx.goldLessons >= 10,
};

/**
 * Check all achievements and return IDs of newly earned ones.
 * `earned` is the set of already-unlocked achievement IDs.
 */
export function checkNewAchievements(
  ctx: AchievementContext,
  earned: Set<string>
): string[] {
  const newIds: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (earned.has(achievement.id)) continue;
    const check = CHECKS[achievement.id];
    if (check && check(ctx)) {
      newIds.push(achievement.id);
    }
  }

  return newIds;
}
