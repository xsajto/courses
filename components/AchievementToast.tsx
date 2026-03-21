"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
import { ACHIEVEMENTS, TIER_COLORS } from "@/lib/achievements";

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

  const tierColor = achievement ? TIER_COLORS[achievement.tier] : "#ffc800";

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -60, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -60, x: "-50%" }}
          className="fixed top-6 left-1/2 z-[100] bg-white border-2 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 cursor-pointer min-w-[280px]"
          style={{ borderColor: tierColor }}
          onClick={onDismiss}
        >
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform animate-bounce"
            style={{ backgroundColor: `${tierColor}20`, color: tierColor }}
          >
            {React.isValidElement(achievement.icon) 
              ? React.cloneElement(achievement.icon as React.ReactElement<any>, { size: 28, strokeWidth: 2.5 })
              : achievement.icon
            }
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: tierColor }}>
              <Award size={12} className="inline mr-1 -mt-0.5" />
              Nový odznak!
            </p>
            <p className="font-black text-duo-text text-lg leading-tight">{achievement.name}</p>
            <p className="text-xs font-bold text-duo-gray-dark italic">{achievement.tier} tier</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
