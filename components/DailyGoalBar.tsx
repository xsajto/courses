"use client";

import { Zap } from "lucide-react";

interface DailyGoalBarProps {
  lessonsCompleted: number;
  lessonGoal: number;
}

export function DailyGoalBar({ lessonsCompleted, lessonGoal }: DailyGoalBarProps) {
  const progress = Math.min(100, (lessonsCompleted / lessonGoal) * 100);
  const isComplete = lessonsCompleted >= lessonGoal;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-black">
        <span className="text-duo-gray-dark uppercase tracking-wider flex items-center gap-1">
          <Zap size={12} fill="currentColor" className="text-duo-yellow" />
          Denní cíl
        </span>
        <span className={isComplete ? "text-duo-green" : "text-duo-gray-dark"}>
          {lessonsCompleted}/{lessonGoal} lekcí
        </span>
      </div>
      <div className="h-2.5 bg-duo-gray/40 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: isComplete
              ? "var(--color-duo-green)"
              : "var(--color-duo-yellow)",
          }}
        />
      </div>
    </div>
  );
}
