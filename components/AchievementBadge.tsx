"use client";

import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AchievementDef } from "@/lib/achievements";
import { theme } from "@/lib/theme";

interface AchievementBadgeProps {
  achievement: AchievementDef;
  unlocked: boolean;
}

const TIER_BG = {
  bronze: "bg-orange-50",
  silver: "bg-slate-50",
  gold: "bg-amber-50",
};

const TIER_SHADOW = {
  bronze: "shadow-[0_4px_0_#d97706]",
  silver: "shadow-[0_4px_0_#94a3b8]",
  gold: "shadow-[0_4px_0_#f59e0b]",
};

export function AchievementBadge({ achievement, unlocked }: AchievementBadgeProps) {
  const tier = achievement.tier;

  return (
    <div
      className={cn(
        "relative rounded-[2rem] p-5 flex flex-col items-center gap-3 text-center transition-all duration-300 group",
        unlocked 
          ? cn(TIER_BG[tier], TIER_SHADOW[tier], "border-2 border-white") 
          : "bg-duo-gray/10 border-2 border-dashed border-duo-gray/30 opacity-50"
      )}
    >
      {/* Icon with float animation if unlocked */}
      <div className={cn(
        "text-4xl mb-1 transition-transform group-hover:scale-110 duration-300",
        unlocked && "filter drop-shadow-sm"
      )}>
        {unlocked ? (
          <div className="relative">
            {achievement.icon}
            {/* Shiny sparkle effect */}
            <div className="absolute inset-0 bg-white/40 blur-xl rounded-full animate-pulse pointer-events-none" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-duo-gray/20 flex items-center justify-center">
            <Lock size={20} className="text-duo-gray-dark" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className={cn(
          "text-sm font-black leading-tight tracking-tight uppercase",
          unlocked ? "text-duo-text" : "text-duo-gray-dark"
        )}>
          {achievement.name}
        </p>
        <p className="text-[10px] font-bold text-duo-gray-dark/80 leading-relaxed max-w-[120px]">
          {achievement.description}
        </p>
      </div>

      {/* Ribbon or Badge tag for Tiers */}
      {unlocked && (
        <div className={cn(
          "absolute -top-2 px-3 py-0.5 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-sm",
          tier === 'gold' ? "bg-amber-500" : tier === 'silver' ? "bg-slate-400" : "bg-orange-600"
        )}>
          {tier}
        </div>
      )}
    </div>
  );
}
