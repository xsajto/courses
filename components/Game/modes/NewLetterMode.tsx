"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard } from "@/components/Game/Keyboard";
import { GameShell } from "../GameShell";
import { LetterMode } from "./LetterMode";
import { FINGER_MAP } from "../keyboard-utils";
import type { NewLetterContent, LetterContent } from "@/lib/game-types";

interface NewLetterModeProps {
  content: NewLetterContent;
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

export const NewLetterMode: React.FC<NewLetterModeProps> = ({
  content, criteria, xp, isReview, onQuit, onFinish,
}) => {
  const [phase, setPhase] = useState<"intro" | "practice">("intro");

  const fingerName = content.finger || FINGER_MAP[content.letter] || "prstem";

  const handleIntroKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Shift" || e.key === "Tab" || e.key === "Escape") return;
    e.preventDefault();

    if (e.key === content.letter) {
      setPhase("practice");
    }
  }, [content.letter]);

  // If in practice phase, render LetterMode with the letters array
  if (phase === "practice") {
    const letterContent: LetterContent = {
      mode: "letter",
      letters: content.letters,
    };
    return (
      <LetterMode
        content={letterContent}
        criteria={criteria}
        xp={xp}
        isReview={isReview}
        onQuit={onQuit}
        onFinish={onFinish}
      />
    );
  }

  // Intro phase
  return (
    <GameShell
      progress={0}
      cpm={0}
      isFinished={false}
      passed={false}
      stats={{ wpm: 0, accuracy: 100 }}
      xp={xp}
      criteria={criteria}
      isReview={isReview}
      failReasons={[]}
      errorCount={0}
      onQuit={onQuit}
      onFinish={() => {}}
      onRetry={() => {}}
      onKeyDown={handleIntroKeyDown}
    >
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-3xl mx-auto py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Speech bubble */}
            <div className="relative bg-duo-blue-light border-2 border-duo-blue/20 rounded-2xl px-8 py-5 max-w-md text-center">
              <p className="text-lg font-bold text-duo-text">
                Klávesu <span className="text-duo-blue text-2xl font-black">{content.letter}</span> píšeš{" "}
                <span className="text-duo-blue font-black">{fingerName}</span>.
              </p>
              <p className="text-sm text-duo-gray-dark mt-2">Pokračuj stisknutím klávesy.</p>
              {/* Bubble arrow */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-duo-blue-light border-b-2 border-r-2 border-duo-blue/20 rotate-45" />
            </div>

            {/* Large letter card */}
            <motion.div
              className="w-32 h-32 rounded-3xl bg-duo-blue-light flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <span className="text-6xl font-black text-duo-blue">{content.letter}</span>
            </motion.div>

            {/* Keyboard with target highlight */}
            <Keyboard
              targetKey={content.letter}
              activeKey={null}
              highlightKeys={[content.letter]}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </GameShell>
  );
};
