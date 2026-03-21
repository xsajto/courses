"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakBadge({ streak, size = "md" }: StreakBadgeProps) {
  const isActive = streak > 0;

  const sizes = {
    sm: { icon: 16, text: "text-sm", gap: "gap-1", px: "px-2 py-1" },
    md: { icon: 20, text: "text-base", gap: "gap-1.5", px: "px-3 py-1.5" },
    lg: { icon: 28, text: "text-xl", gap: "gap-2", px: "px-4 py-2" },
  };

  const s = sizes[size];

  return (
    <div className={cn(
      "flex items-center rounded-xl font-black",
      s.gap, s.px,
      isActive ? "text-duo-red" : "text-duo-gray-dark"
    )}>
      <Flame
        size={s.icon}
        fill={isActive ? "currentColor" : "none"}
        className={isActive ? "text-duo-red" : "text-duo-gray-dark"}
      />
      <span className={s.text}>{streak}</span>
    </div>
  );
}
