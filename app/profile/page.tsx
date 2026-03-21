import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AppLayout } from "@/components/AppLayout";
import { updateProfile, getUserDailyStats } from "@/app/actions/progress";
import { Trophy, Target, Zap, Crown, Flame } from "lucide-react";
import { redirect } from "next/navigation";
import { DailyGoalPicker } from "@/components/DailyGoalPicker";
import { AchievementGrid } from "@/components/AchievementGrid";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user, dailyStats, xpAggregate, userAchievements] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { progress: true },
    }),
    getUserDailyStats(),
    prisma.lessonAttempt.aggregate({
      where: { userId: session.user.id, passed: true },
      _sum: { totalXp: true },
    }),
    prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: { achievementId: true, unlockedAt: true },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  const totalXP = xpAggregate._sum.totalXp ?? 0;
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const levelProgress = ((totalXP % 1000) / 1000) * 100;

  const totalLessons = user.progress.length;
  const avgAccuracy = totalLessons
    ? (user.progress.reduce((acc, p) => acc + (p.bestAccuracy ?? p.accuracy ?? 0), 0) / totalLessons).toFixed(1)
    : 0;

  const goldCount = user.progress.filter(p => p.masteryLevel >= 2).length;

  const earnedIds = new Set(userAchievements.map(a => a.achievementId));

  async function handleUpdateName(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    if (name) {
      await updateProfile({ name });
    }
  }

  return (
    <AppLayout dailyStats={dailyStats}>
      <main className="p-8 max-w-3xl mx-auto">
        <header className="flex flex-col lg:flex-row items-center gap-8 mb-12 pb-8 border-b-2 border-duo-gray">
          <div className="w-32 h-32 rounded-3xl bg-duo-purple flex items-center justify-center text-5xl font-black text-white shadow-[0_8px_0_var(--color-duo-purple-dark)] relative">
            {user.name?.[0] || user.email[0].toUpperCase()}
            <div className="absolute -bottom-4 -right-4 bg-duo-yellow text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-black border-4 border-white">
              {currentLevel}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-black text-duo-text mb-1">{user.name || "Uživatel"}</h1>
            <p className="text-duo-gray-dark font-bold uppercase tracking-wider text-sm">{user.email}</p>

            <div className="mt-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-duo-gray-dark font-black text-xs uppercase tracking-tighter">Úroveň {currentLevel}</span>
                <span className="text-duo-text font-black text-sm">{totalXP % 1000} / 1000 XP</span>
              </div>
              <div className="progress-bar !h-4">
                <div
                  className="!bg-duo-yellow !duration-1000"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
          <div className="border-2 border-duo-gray rounded-2xl p-6 flex flex-col items-center gap-2">
            <Zap className="text-duo-yellow" size={32} fill="currentColor" />
            <p className="text-2xl font-black text-duo-text">{totalXP}</p>
            <p className="text-duo-gray-dark font-extrabold text-xs uppercase">Celkové XP</p>
          </div>
          <div className="border-2 border-duo-gray rounded-2xl p-6 flex flex-col items-center gap-2">
            <Trophy className="text-duo-green" size={32} />
            <p className="text-2xl font-black text-duo-text">{totalLessons}</p>
            <p className="text-duo-gray-dark font-extrabold text-xs uppercase">Lekce</p>
          </div>
          <div className="border-2 border-duo-gray rounded-2xl p-6 flex flex-col items-center gap-2">
            <Target className="text-duo-red" size={32} />
            <p className="text-2xl font-black text-duo-text">{avgAccuracy}%</p>
            <p className="text-duo-gray-dark font-extrabold text-xs uppercase">Přesnost</p>
          </div>
          <div className="border-2 border-duo-gray rounded-2xl p-6 flex flex-col items-center gap-2">
            <Crown className="text-duo-yellow" size={32} fill="currentColor" />
            <p className="text-2xl font-black text-duo-text">{goldCount}</p>
            <p className="text-duo-gray-dark font-extrabold text-xs uppercase">Zlaté lekce</p>
          </div>
          <div className="border-2 border-duo-gray rounded-2xl p-6 flex flex-col items-center gap-2">
            <Flame className="text-duo-red" size={32} fill="currentColor" />
            <p className="text-2xl font-black text-duo-text">{dailyStats?.currentStreak ?? 0}</p>
            <p className="text-duo-gray-dark font-extrabold text-xs uppercase">Série</p>
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-duo-text mb-6 uppercase tracking-tight">Odznaky</h2>
          <AchievementGrid earnedIds={earnedIds} />
        </section>

        {/* Settings */}
        <section className="bg-duo-gray/10 rounded-3xl p-8 border-2 border-duo-gray/30 space-y-8">
          <h2 className="text-2xl font-black text-duo-text uppercase tracking-tight">Nastavení</h2>

          <DailyGoalPicker currentGoal={dailyStats?.dailyLessonGoal ?? 3} />

          <div>
            <h3 className="font-black text-duo-gray-dark text-xs uppercase tracking-widest mb-3">Profil</h3>
            <form action={handleUpdateName} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-black text-duo-gray-dark text-xs uppercase tracking-widest">Zobrazované Jméno</label>
                <input
                  name="name"
                  autoComplete="off"
                  defaultValue={user.name || ""}
                  className="form-input bg-white"
                  placeholder="Jak vám máme říkat?"
                />
              </div>
              <button type="submit" className="primary-btn w-fit px-12 py-4">Uložit změny</button>
            </form>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
