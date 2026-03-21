"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AchievementToast } from "@/components/AchievementToast";

interface AchievementContextType {
  showAchievements: (ids: string[]) => void;
}

const AchievementContext = createContext<AchievementContextType>({
  showAchievements: () => {},
});

export function useAchievements() {
  return useContext(AchievementContext);
}

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<string[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const showAchievements = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    setQueue(prev => [...prev, ...ids]);
    if (!currentId) {
      setCurrentId(ids[0]);
    }
  }, [currentId]);

  const handleDismiss = useCallback(() => {
    setQueue(prev => {
      const next = prev.slice(1);
      setCurrentId(next[0] ?? null);
      return next;
    });
  }, []);

  return (
    <AchievementContext.Provider value={{ showAchievements }}>
      {children}
      <AchievementToast achievementId={currentId} onDismiss={handleDismiss} />
    </AchievementContext.Provider>
  );
}
