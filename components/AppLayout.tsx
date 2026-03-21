"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { AchievementProvider } from "@/components/AchievementProvider";
import type { DailyStats } from "@/app/actions/progress";

interface AppLayoutProps {
  children: React.ReactNode;
  dailyStats?: DailyStats | null;
}

export function AppLayout({ children, dailyStats }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AchievementProvider>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          dailyStats={dailyStats}
        />
        <div className="main-layout">
          <MobileHeader
            onToggleSidebar={() => setSidebarOpen(o => !o)}
            dailyStats={dailyStats}
          />
          {children}
        </div>
      </div>
    </AchievementProvider>
  );
}
