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
    <div className="space-y-6">
      {categories.map(cat => {
        const achievements = ACHIEVEMENTS.filter(a => a.category === cat);
        return (
          <div key={cat}>
            <h3 className="text-xs font-black text-duo-gray-dark uppercase tracking-widest mb-3">
              {CATEGORY_LABELS[cat]}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
