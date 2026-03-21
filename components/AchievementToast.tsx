"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/achievements";

interface AchievementToastProps {
  achievementId: string | null;
  onDismiss: () => void;
}

export function AchievementToast({ achievementId, onDismiss }: AchievementToastProps) {
  const achievement = achievementId
    ? ACHIEVEMENTS.find(a => a.id === achievementId)
    : null;

  useEffect(() => {
    if (!achievementId) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [achievementId, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -60, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -60, x: "-50%" }}
          className="fixed top-6 left-1/2 z-[100] bg-white border-2 border-duo-yellow rounded-2xl shadow-xl px-6 py-4 flex items-center gap-4 cursor-pointer"
          onClick={onDismiss}
        >
          <div className="w-12 h-12 rounded-xl bg-duo-yellow/20 flex items-center justify-center text-2xl">
            {achievement.icon}
          </div>
          <div>
            <p className="text-xs font-black text-duo-yellow uppercase tracking-wider">
              <Award size={12} className="inline mr-1" />
              Nový odznak!
            </p>
            <p className="font-black text-duo-text">{achievement.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
