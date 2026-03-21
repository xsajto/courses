"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Keyboard } from "@/components/Game/Keyboard";
import { GameShell } from "../GameShell";
import { useSounds } from "@/lib/useSounds";
import type { CopyingContent } from "@/lib/game-types";

interface CopyingModeProps {
  content: CopyingContent;
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

const ENTER_SYMBOL = "↵";

export const CopyingMode: React.FC<CopyingModeProps> = ({
  content, criteria, xp, isReview, onQuit, onFinish,
}) => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [errorMap, setErrorMap] = useState<Record<number, boolean>>({});
  const [errorCharMap, setErrorCharMap] = useState<Record<string, number>>({});
  // For remove-repair-mistake: track if we're in "need backspace" state
  const [needsBackspace, setNeedsBackspace] = useState(false);

  const { play } = useSounds();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  const typingText = useMemo(() => {
    return content.text.replace(/\n/g, "");
  }, [content.text]);

  const config = content.config;

  const stats = useMemo(() => {
    if (userInput.length === 0) return { wpm: 0, accuracy: 100 };
    const totalTyped = userInput.length;
    const errors = Object.keys(errorMap).length;
    const accuracy = Math.round(((totalTyped - errors) / totalTyped) * 100);
    const now = endTime ?? Date.now();
    const timeElapsed = (now - (startTime || 0)) / 60000;
    const wpm = timeElapsed > 0 ? Math.round(userInput.length / timeElapsed) : 0;
    return { wpm, accuracy: Math.max(0, accuracy) };
  }, [userInput, startTime, endTime, errorMap]);

  const passed = useMemo(() => {
    if (!isFinished) return false;
    return stats.accuracy >= criteria.minAccuracy && stats.wpm >= criteria.minWpm;
  }, [isFinished, stats, criteria]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isFinished) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Shift" || e.key === "Tab" || e.key === "Escape") return;
    e.preventDefault();

    // Handle Backspace for remove-repair-mistake mode
    if (e.key === "Backspace") {
      if (config === "remove-repair-mistake" && needsBackspace) {
        setNeedsBackspace(false);
      }
      return;
    }

    // If we need backspace first, ignore other keys
    if (needsBackspace) return;

    const charIndex = userInput.length;
    if (charIndex >= typingText.length) return;

    const targetChar = typingText[charIndex];
    let typedMatches = false;

    if (targetChar === ENTER_SYMBOL) {
      if (e.key === "Enter") typedMatches = true;
    } else if (targetChar === " ") {
      if (e.key === " ") typedMatches = true;
    } else {
      if (e.key === targetChar) typedMatches = true;
    }

    if (userInput.length === 0) {
      setStartTime(Date.now());
    }

    // Highlight pressed key
    if (targetChar === ENTER_SYMBOL) {
      setActiveKey("ENTER");
    } else {
      setActiveKey(e.key.length === 1 ? e.key.toUpperCase() : null);
    }
    setTimeout(() => setActiveKey(null), 100);

    if (!typedMatches) {
      play("key-error", 0.3);
      setErrorMap(prev => ({ ...prev, [charIndex]: true }));
      setErrorCharMap(prev => ({
        ...prev,
        [targetChar]: (prev[targetChar] || 0) + 1,
      }));

      if (config === "ignore-mistakes") {
        // Always advance
        const typedChar = targetChar === ENTER_SYMBOL ? ENTER_SYMBOL : (e.key.length === 1 ? e.key : targetChar);
        const newInput = userInput + typedChar;
        setUserInput(newInput);
        if (newInput.length === typingText.length) {
          setEndTime(Date.now());
          setIsFinished(true);
        }
      } else if (config === "repair-mistake") {
        // Stay on char, don't advance — user must press correct key
      } else if (config === "remove-repair-mistake") {
        // Must press Backspace first, then correct key
        setNeedsBackspace(true);
      }
      return;
    }

    // Correct key pressed
    play("key-correct", 0.2);
    const typedChar = targetChar === ENTER_SYMBOL ? ENTER_SYMBOL : e.key;
    const newInput = userInput + typedChar;
    setUserInput(newInput);

    if (newInput.length === typingText.length) {
      setEndTime(Date.now());
      setIsFinished(true);
    }
  }, [isFinished, userInput, typingText, config, needsBackspace]);

  const handleFinish = () => {
    const totalTime = startTime && endTime ? endTime - startTime : undefined;
    const errorCount = Object.keys(errorMap).length;
    onFinish({ ...stats, passed, errorCount, errors: JSON.stringify(errorCharMap), totalTime });
  };

  const handleRetry = useCallback(() => {
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setIsFinished(false);
    setActiveKey(null);
    setErrorMap({});
    setErrorCharMap({});
    setNeedsBackspace(false);
  }, []);

  const failReasons: string[] = [];
  if (isFinished && stats.accuracy < criteria.minAccuracy) {
    failReasons.push(`Přesnost ${stats.accuracy}% < ${criteria.minAccuracy}%`);
  }
  if (isFinished && stats.wpm < criteria.minWpm) {
    failReasons.push(`Rychlost ${stats.wpm} < ${criteria.minWpm} zn/min`);
  }

  // Render display text
  const renderDisplayText = () => {
    const chars: React.ReactNode[] = [];
    for (let i = 0; i < typingText.length; i++) {
      const char = typingText[i];
      let state = "pending";
      if (i < userInput.length) state = errorMap[i] ? "error" : "correct";
      else if (i === userInput.length) state = needsBackspace ? "error" : "active";

      const isActive = i === userInput.length;

      if (char === ENTER_SYMBOL) {
        chars.push(
          <React.Fragment key={i}>
            <span ref={isActive ? activeCharRef : undefined} className={`char ${state} opacity-50`}>{ENTER_SYMBOL}</span>
            <br />
          </React.Fragment>
        );
      } else {
        chars.push(
          <span key={i} ref={isActive ? activeCharRef : undefined} className={`char ${state}`}>
            {char}
          </span>
        );
      }
    }
    return chars;
  };

  // Auto-scroll to keep active character visible
  useEffect(() => {
    activeCharRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [userInput.length]);

  const currentTargetChar = typingText[userInput.length];
  const keyboardTarget = needsBackspace
    ? "Backspace"
    : currentTargetChar === ENTER_SYMBOL
      ? "Enter"
      : currentTargetChar;

  return (
    <GameShell
      progress={typingText.length > 0 ? userInput.length / typingText.length : 0}
      cpm={stats.wpm}
      isFinished={isFinished}
      passed={passed}
      stats={stats}
      xp={xp}
      criteria={criteria}
      isReview={isReview}
      failReasons={failReasons}
      errorCount={Object.keys(errorMap).length}
      onQuit={onQuit}
      onFinish={handleFinish}
      onRetry={handleRetry}
      onKeyDown={handleKeyDown}
    >
      <div className="typing-scene flex-1 flex flex-col justify-center items-center w-full max-w-3xl mx-auto py-20">
        <div ref={containerRef} className="text-display mb-12 max-h-[200px] overflow-hidden break-words">
          {renderDisplayText()}
        </div>
        <Keyboard targetKey={keyboardTarget} activeKey={activeKey} />
      </div>
    </GameShell>
  );
};
