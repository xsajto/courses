"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Keyboard } from "@/components/Game/Keyboard";
import { GameShell } from "../GameShell";
import { useSounds } from "@/lib/useSounds";
import { HOME_ROW_POSITIONS, getKeyXCenter, CHAR_TO_KEY } from "../keyboard-utils";
import { theme } from "@/lib/theme";
import type { RainingContent } from "@/lib/game-types";

interface RainingModeProps {
  content: RainingContent;
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

const FALL_DURATION = 1.5; // seconds

function getXForChar(ch: string): number {
  // Try home row positions first
  if (HOME_ROW_POSITIONS[ch] !== undefined) return HOME_ROW_POSITIONS[ch];
  // Fallback: look up key and compute
  const mapping = CHAR_TO_KEY.get(ch);
  if (mapping) {
    const x = getKeyXCenter(mapping.keyId);
    if (x !== undefined) return x;
  }
  return 364; // center fallback
}

export const RainingMode: React.FC<RainingModeProps> = ({
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
  // Track dissolve animation for current letter
  const [dissolving, setDissolving] = useState(false);
  // Track explode animation for wrong key
  const [exploding, setExploding] = useState(false);
  // Miss feedback (letter reached keyboard)
  const [missFlash, setMissFlash] = useState(false);
  const [shaking, setShaking] = useState(false);
  // Key for re-mounting the falling letter
  const [letterKey, setLetterKey] = useState(0);
  // Wait for first keypress before starting
  const [started, setStarted] = useState(false);

  // Dynamic rain area height via ResizeObserver
  const rainAreaRef = useRef<HTMLDivElement>(null);
  const [areaHeight, setAreaHeight] = useState(340);

  useEffect(() => {
    const el = rainAreaRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setAreaHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= letters.length) {
      setEndTime(Date.now());
      setIsFinished(true);
    } else {
      setCurrentIndex(nextIndex);
      setDissolving(false);
      setExploding(false);
      setLetterKey(prev => prev + 1);
    }
  }, [currentIndex, letters.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isFinished || dissolving || exploding) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Shift" || e.key === "Tab" || e.key === "Escape" || e.key === "Backspace") return;
    if (e.key.length !== 1) return;
    e.preventDefault();

    // First keypress = start signal, don't count it as input
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
      return;
    }

    setTotalKeystrokes(prev => prev + 1);
    setActiveKey(e.key.toUpperCase());
    setTimeout(() => setActiveKey(null), 100);

    const targetChar = letters[currentIndex];

    if (e.key === targetChar) {
      // Correct — dissolve and advance
      play("key-correct", 0.2);
      setDissolving(true);
      setTimeout(advanceToNext, 300);
    } else {
      // Error — explode and advance
      play("key-error", 0.3);
      setErrorCount(prev => prev + 1);
      setErrorCharMap(prev => ({
        ...prev,
        [targetChar]: (prev[targetChar] || 0) + 1,
      }));
      setExploding(true);
      setTimeout(advanceToNext, 400);
    }
  }, [isFinished, dissolving, exploding, currentIndex, letters, started, advanceToNext, play]);

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
    setDissolving(false);
    setExploding(false);
    setMissFlash(false);
    setShaking(false);
    setLetterKey(prev => prev + 1);
    setStarted(false);
  }, []);

  const failReasons: string[] = [];
  if (isFinished && stats.accuracy < criteria.minAccuracy) {
    failReasons.push(`Přesnost ${stats.accuracy}% < ${criteria.minAccuracy}%`);
  }
  if (isFinished && stats.wpm < criteria.minWpm) {
    failReasons.push(`Rychlost ${stats.wpm} < ${criteria.minWpm} zn/min`);
  }

  const targetChar = letters[currentIndex];
  const targetX = targetChar ? getXForChar(targetChar) : 364;

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
      <div
        className={`flex-1 flex flex-col items-center w-full max-w-3xl mx-auto${shaking ? " game-shake" : ""}`}
        onAnimationEnd={() => setShaking(false)}
      >
        {/* Rain area — fills available space between header and keyboard */}
        <div
          ref={rainAreaRef}
          className="relative flex-1 mb-4 w-full max-w-[728px] overflow-hidden"
        >
          {/* Miss flash overlay */}
          <div
            className="absolute inset-0 bg-duo-red rounded-2xl pointer-events-none z-10"
            style={{
              opacity: missFlash ? 0.12 : 0,
              transition: "opacity 150ms ease-out",
            }}
          />

          {/* Start prompt */}
          {!started && !isFinished && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <p className="text-xl font-bold text-duo-textSecondary mb-2">
                  Stiskni libovolnou klávesu pro start
                </p>
                <p className="text-sm text-duo-textSecondary opacity-60">
                  Písmena začnou padat shora
                </p>
              </div>
            </div>
          )}

          {started && !isFinished && targetChar && (
            <motion.div
              key={letterKey}
              className="absolute w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl select-none"
              style={{ left: targetX - 28, top: 0 }}
              initial={{ y: -60, opacity: 1, scale: 1 }}
              animate={
                dissolving
                  ? { opacity: 0, scale: 1.5 }
                  : exploding
                    ? { opacity: 0, scale: 2, rotate: 20 }
                    : { y: areaHeight }
              }
              transition={
                dissolving
                  ? { duration: 0.3 }
                  : exploding
                    ? { duration: 0.4, ease: "easeOut" }
                    : { duration: FALL_DURATION, ease: "easeIn" }
              }
              onAnimationComplete={() => {
                if (!dissolving && !exploding) {
                  // Letter reached keyboard — miss
                  setErrorCount(prev => prev + 1);
                  setTotalKeystrokes(prev => prev + 1);
                  const ch = letters[currentIndex];
                  if (ch) {
                    setErrorCharMap(prev => ({
                      ...prev,
                      [ch]: (prev[ch] || 0) + 1,
                    }));
                  }
                  setShaking(true);
                  setMissFlash(true);
                  setTimeout(() => setMissFlash(false), 200);
                  advanceToNext();
                }
              }}
            >
              <div
                className="w-full h-full rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: exploding ? theme.red : theme.blueLight,
                  color: exploding ? theme.white : theme.blue,
                }}
              >
                {targetChar}
              </div>
            </motion.div>
          )}
        </div>

        <Keyboard targetKey={targetChar} activeKey={activeKey} />
      </div>
    </GameShell>
  );
};
