"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { updateDailyGoal } from "@/app/actions/progress";

const GOALS = [
  { value: 1, label: "Lehký", desc: "1 lekce denně" },
  { value: 3, label: "Běžný", desc: "3 lekce denně" },
  { value: 5, label: "Náročný", desc: "5 lekcí denně" },
  { value: 10, label: "Extrémní", desc: "10 lekcí denně" },
];

interface DailyGoalPickerProps {
  currentGoal: number;
}

export function DailyGoalPicker({ currentGoal }: DailyGoalPickerProps) {
  const [selected, setSelected] = useState(currentGoal);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (value: number) => {
    setSelected(value);
    startTransition(async () => {
      await updateDailyGoal(value);
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="font-black text-duo-gray-dark text-xs uppercase tracking-widest">Denní cíl</h3>
      <div className="grid grid-cols-2 gap-3">
        {GOALS.map((goal) => (
          <button
            key={goal.value}
            onClick={() => handleSelect(goal.value)}
            disabled={isPending}
            className={cn(
              "border-2 rounded-2xl p-4 text-left transition-all",
              selected === goal.value
                ? "border-duo-green bg-duo-green/5"
                : "border-duo-gray hover:border-duo-gray-dark"
            )}
          >
            <p className={cn(
              "font-black text-sm",
              selected === goal.value ? "text-duo-green" : "text-duo-text"
            )}>
              {goal.label}
            </p>
            <p className="text-xs font-bold text-duo-gray-dark">{goal.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
