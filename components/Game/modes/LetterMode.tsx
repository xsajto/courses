"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Keyboard } from "@/components/Game/Keyboard";
import { GameShell } from "../GameShell";
import { useSounds } from "@/lib/useSounds";
import { theme } from "@/lib/theme";
import type { LetterContent } from "@/lib/game-types";

interface LetterModeProps {
  content: LetterContent;
  criteria: { minAccuracy: number; minWpm: number };
  xp: number;
  isReview: boolean;
  onQuit: () => void;
  onFinish: (stats: {
    accuracy: number;
    wpm: number;
    passed: boolean;
    errorCount?: number;
    errors?: string;
    totalTime?: number;
  }) => void;
}

const VISIBLE_CARDS = 7;
const CARD_WIDTH = 80;
const CARD_GAP = 12;
const CARD_STEP = CARD_WIDTH + CARD_GAP;

export const LetterMode: React.FC<LetterModeProps> = ({
  content, criteria, xp, isReview, onQuit, onFinish,
}) => {
  const { play } = useSounds();
  const letters = content.letters;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [errorCharMap, setErrorCharMap] = useState<Record<string, number>>({});
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  // Per-card animation state
  const [cardState, setCardState] = useState<"idle" | "error">("idle");

  // Scroll offset: keep current card near center
  const scrollOffset = useMemo(() => {
    const centerSlot = Math.floor(VISIBLE_CARDS / 2);
    const offset = Math.max(0, currentIndex - centerSlot);
    return offset * CARD_STEP;
  }, [currentIndex]);

  const stats = useMemo(() => {
    if (totalKeystrokes === 0) return { wpm: 0, accuracy: 100 };
    const accuracy = Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100);
    const now = endTime ?? Date.now();
    const timeElapsed = (now - (startTime || 0)) / 60000;
    const wpm = timeElapsed > 0 ? Math.round(currentIndex / timeElapsed) : 0;
    return { wpm, accuracy: Math.max(0, accuracy) };
  }, [totalKeystrokes, errorCount, currentIndex, startTime, endTime]);

  const passed = useMemo(() => {
    if (!isFinished) return false;
    return stats.accuracy >= criteria.minAccuracy && stats.wpm >= criteria.minWpm;
  }, [isFinished, stats, criteria]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isFinished) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Shift" || e.key === "Tab" || e.key === "Escape" || e.key === "Backspace") return;
    if (e.key.length !== 1) return;
    e.preventDefault();

    if (currentIndex === 0 && startTime === null) {
      setStartTime(Date.now());
    }

    setTotalKeystrokes(prev => prev + 1);
    setActiveKey(e.key.toUpperCase());
    setTimeout(() => setActiveKey(null), 100);

    const targetChar = letters[currentIndex];

    if (e.key === targetChar) {
      // Correct — advance immediately
      play("key-correct", 0.2);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= letters.length) {
        setEndTime(Date.now());
        setIsFinished(true);
      }
      setCurrentIndex(nextIndex);
      setCardState("idle");
    } else {
      // Wrong
      play("key-error", 0.3);
      setErrorCount(prev => prev + 1);
      setErrorCharMap(prev => ({
        ...prev,
        [targetChar]: (prev[targetChar] || 0) + 1,
      }));
      setCardState("error");
      setTimeout(() => setCardState("idle"), 300);
    }
  }, [isFinished, currentIndex, letters, startTime, play]);

  const handleFinish = () => {
    const totalTime = startTime && endTime ? endTime - startTime : undefined;
    onFinish({
      ...stats,
      passed,
      errorCount,
      errors: JSON.stringify(errorCharMap),
      totalTime,
    });
  };

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
    setIsFinished(false);
    setActiveKey(null);
    setErrorCount(0);
    setErrorCharMap({});
    setTotalKeystrokes(0);
    setCardState("idle");
  }, []);

  const failReasons: string[] = [];
  if (isFinished && stats.accuracy < criteria.minAccuracy) {
    failReasons.push(`Přesnost ${stats.accuracy}% < ${criteria.minAccuracy}%`);
  }
  if (isFinished && stats.wpm < criteria.minWpm) {
    failReasons.push(`Rychlost ${stats.wpm} < ${criteria.minWpm} zn/min`);
  }

  const targetChar = letters[currentIndex];

  return (
    <GameShell
      progress={letters.length > 0 ? currentIndex / letters.length : 0}
      cpm={stats.wpm}
      isFinished={isFinished}
      passed={passed}
      stats={stats}
      xp={xp}
      criteria={criteria}
      isReview={isReview}
      failReasons={failReasons}
      errorCount={errorCount}
      onQuit={onQuit}
      onFinish={handleFinish}
      onRetry={handleRetry}
      onKeyDown={handleKeyDown}
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-3xl mx-auto py-20">
        {/* Card row */}
        <div
          className="relative overflow-hidden mb-12 max-w-full"
          style={{ width: VISIBLE_CARDS * CARD_STEP - CARD_GAP + 24, height: 140, padding: '10px 12px' }}
        >
          <motion.div
            className="flex gap-3 absolute"
            animate={{ x: -scrollOffset }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {letters.map((letter, i) => {
              const isCurrent = i === currentIndex;
              const isDone = i < currentIndex;
              const isCurrentError = isCurrent && cardState === "error";

              return (
                <motion.div
                  key={i}
                  className="flex-shrink-0 rounded-2xl flex items-center justify-center font-black text-3xl select-none relative"
                  style={{ width: CARD_WIDTH, height: CARD_WIDTH }}
                  animate={{
                    scale: isCurrent ? 1.15 : 1,
                    backgroundColor: isDone
                      ? theme.gray
                      : isCurrentError
                        ? theme.red
                        : isCurrent
                          ? theme.blueLight
                          : theme.surface,
                    color: isDone
                      ? theme.grayDark
                      : isCurrentError
                        ? theme.white
                        : isCurrent
                          ? theme.blue
                          : theme.text,
                    x: isCurrentError ? [0, -6, 6, -6, 6, 0] : 0,
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 25 },
                    backgroundColor: { duration: 0 },
                    color: { duration: 0 },
                    ...(isCurrentError ? { x: { duration: 0.3 } } : {}),
                  }}
                >
                  {letter}
                  {isCurrent && (
                    <motion.div
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-duo-blue"
                      animate={{ opacity: isCurrentError ? 0 : 1 }}
                      transition={{ duration: 0.1 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <Keyboard targetKey={targetChar} activeKey={activeKey} />
      </div>
    </GameShell>
  );
};
