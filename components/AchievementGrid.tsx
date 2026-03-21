"use client";

import { ACHIEVEMENTS, type AchievementCategory } from "@/lib/achievements";
import { AchievementBadge } from "@/components/AchievementBadge";

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  streak: "Série",
  lessons: "Lekce",
  performance: "Výkon",
  xp: "Zkušenosti",
  mastery: "Mistrovství",
};

interface AchievementGridProps {
  earnedIds: Set<string>;
}

export function AchievementGrid({ earnedIds }: AchievementGridProps) {
  const categories = [...new Set(ACHIEVEMENTS.map(a => a.category))] as AchievementCategory[];

  return (
    <div className="space-y-12">
      {categories.map(cat => {
        const achievements = ACHIEVEMENTS.filter(a => a.category === cat);
        return (
          <div key={cat} className="relative">
            {/* Category Header with a subtle side line */}
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-sm font-black text-duo-gray-dark uppercase tracking-[0.2em]">
                {CATEGORY_LABELS[cat]}
              </h3>
              <div className="h-px bg-duo-gray/50 flex-1" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {achievements.map(a => (
                <AchievementBadge
                  key={a.id}
                  achievement={a}
                  unlocked={earnedIds.has(a.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
