"use client";

import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { GameNavbar } from "./GameNavbar";
import { CompletionModal } from "./CompletionModal";
import { calculateXp, type XpBreakdown } from "@/lib/xp";
import { useSounds } from "@/lib/useSounds";

interface GameShellProps {
  progress: number;  // 0–1
  cpm: number;
  isFinished: boolean;
  passed: boolean;
  stats: { wpm: number; accuracy: number };
  xp: number;
  criteria: { minAccuracy: number; minWpm: number };
  isReview: boolean;
  failReasons: string[];
  errorCount?: number;
  onQuit: () => void;
  onFinish: () => void;
  onRetry: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  children: React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  progress, cpm, isFinished, passed, stats, xp, criteria, isReview, failReasons, errorCount,
  onQuit, onFinish, onRetry, onKeyDown, children,
}) => {
  const { play, muted, toggleMute } = useSounds();

  const xpBreakdown: XpBreakdown = useMemo(() => {
    if (!isFinished) return { baseXp: 0, accuracyBonus: 0, speedBonus: 0, perfectBonus: 0, totalXp: 0 };
    return calculateXp({
      baseXp: xp,
      accuracy: stats.accuracy,
      wpm: stats.wpm,
      minWpm: criteria.minWpm,
      passed,
    });
  }, [isFinished, xp, stats.accuracy, stats.wpm, criteria.minWpm, passed]);

  const containerRef = useRef<HTMLDivElement>(null);
  const playedCompletionSound = useRef(false);

  const focus = useCallback(() => {
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    focus();
  }, [focus]);

  // Play completion sound when lesson finishes
  useEffect(() => {
    if (isFinished && !playedCompletionSound.current) {
      playedCompletionSound.current = true;
      play(passed ? "lesson-complete" : "lesson-fail", 0.6);
    }
    if (!isFinished) {
      playedCompletionSound.current = false;
    }
  }, [isFinished, passed, play]);

  return (
    <motion.div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="game-container h-screen flex flex-col bg-white outline-none overflow-hidden"
      onClick={focus}
    >
      <GameNavbar progress={progress} cpm={cpm} onQuit={onQuit} muted={muted} onToggleMute={toggleMute} />
      {children}
      <CompletionModal
        isFinished={isFinished}
        passed={passed}
        stats={stats}
        xpBreakdown={xpBreakdown}
        failReasons={failReasons}
        errorCount={errorCount}
        onFinish={onFinish}
        onRetry={onRetry}
        onQuit={onQuit}
      />
    </motion.div>
  );
};
