"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, User, LayoutGrid, LogOut, Keyboard } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { StreakBadge } from "@/components/StreakBadge";
import { DailyGoalBar } from "@/components/DailyGoalBar";
import type { DailyStats } from "@/app/actions/progress";

const navItems = [
  { icon: BookOpen, label: "UČIT SE", href: "/" },
  { icon: LayoutGrid, label: "KURZY", href: "/courses" },
  { icon: User, label: "PROFIL", href: "/profile" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  dailyStats?: DailyStats | null;
}

export function Sidebar({ isOpen, onClose, dailyStats }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}
      <div className={cn(
        "sidebar w-[240px] h-screen border-r-2 border-duo-gray p-4 flex flex-col fixed left-0 top-0 bg-white z-50 select-none transition-transform duration-300 overflow-hidden",
        isOpen && "sidebar-open"
      )}>
        <div className="px-4 py-8">
          <h1 className="text-4xl font-black text-duo-green tracking-tighter italic">tukej</h1>
        </div>

        {/* Streak & Daily Goal */}
        {dailyStats && (
          <div className="px-2 mb-4 space-y-2">
            <StreakBadge streak={dailyStats.currentStreak} size="md" />
            <div className="px-2">
              <DailyGoalBar lessonsCompleted={dailyStats.dailyLessonsCompleted} lessonGoal={dailyStats.dailyLessonGoal} />
            </div>
          </div>
        )}

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isLearn = item.href === "/";
            const isActive = isLearn
              ? (pathname === "/" || pathname.startsWith("/course"))
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl font-black transition-all group",
                  isActive
                    ? "bg-duo-blue/10 text-duo-blue border-2 border-duo-blue/20"
                    : "text-duo-gray-dark hover:bg-duo-gray/10"
                )}
              >
                <item.icon className={cn("size-7 transition-transform group-active:scale-90", isActive ? "text-duo-blue" : "text-duo-gray-dark")} />
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors mt-auto group"
        >
          <LogOut className="size-6 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide text-xs uppercase">Odhlásit se</span>
        </button>
      </div>
    </>
  );
}
