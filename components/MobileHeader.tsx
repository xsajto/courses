"use client";

import { Menu } from "lucide-react";
import { StreakBadge } from "@/components/StreakBadge";
import type { DailyStats } from "@/app/actions/progress";

interface MobileHeaderProps {
  onToggleSidebar: () => void;
  dailyStats?: DailyStats | null;
}

export function MobileHeader({ onToggleSidebar, dailyStats }: MobileHeaderProps) {
  return (
    <div className="md:hidden sticky top-0 z-40 h-14 bg-white border-b-2 border-duo-gray flex items-center justify-between px-4">
      <h1 className="text-2xl font-black text-duo-green tracking-tighter italic">tukej</h1>
      <div className="flex items-center gap-2">
        {dailyStats && (
          <StreakBadge streak={dailyStats.currentStreak} size="sm" />
        )}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-duo-gray/20 transition-colors"
          aria-label="Otevřít menu"
        >
          <Menu className="size-6 text-duo-text" />
        </button>
      </div>
    </div>
  );
}
