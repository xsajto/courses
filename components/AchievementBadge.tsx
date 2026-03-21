"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AchievementDef } from "@/lib/achievements";
import { TIER_COLORS } from "@/lib/achievements";

interface AchievementBadgeProps {
  achievement: AchievementDef;
  unlocked: boolean;
}

export function AchievementBadge({ achievement, unlocked }: AchievementBadgeProps) {
  const borderColor = unlocked ? TIER_COLORS[achievement.tier] : "var(--color-duo-gray)";

  return (
    <div
      className={cn(
        "border-2 rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-all",
        unlocked ? "bg-white" : "bg-duo-gray/10 opacity-60"
      )}
      style={{ borderColor }}
    >
      <div className="text-3xl">
        {unlocked ? achievement.icon : <Lock size={28} className="text-duo-gray-dark" />}
      </div>
      <p className={cn(
        "text-xs font-black leading-tight",
        unlocked ? "text-duo-text" : "text-duo-gray-dark"
      )}>
        {achievement.name}
      </p>
      <p className="text-[10px] font-bold text-duo-gray-dark leading-tight">
        {achievement.description}
      </p>
    </div>
  );
}
