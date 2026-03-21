"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Keyboard } from "@/components/Game/Keyboard";
import { GameShell } from "../GameShell";
import { useSounds } from "@/lib/useSounds";
import { HOME_ROW_POSITIONS, getKeyXCenter, CHAR_TO_KEY } from "../keyboard-utils";
import { theme } from "@/lib/theme";
import type { FastRainingContent } from "@/lib/game-types";

interface FastRainingModeProps {
  content: FastRainingContent;
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

interface FallingLetter {
  id: number;
  char: string;
  x: number;
  y: number;
  status: "falling" | "hit" | "missed";
}

interface HitBurst {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

const AREA_HEIGHT = 480;
const MISS_THRESHOLD = 480;
const BASE_SPEED = 120;           // px per second

function getXForChar(ch: string): number {
  if (HOME_ROW_POSITIONS[ch] !== undefined) return HOME_ROW_POSITIONS[ch];
  const mapping = CHAR_TO_KEY.get(ch);
  if (mapping) {
    const x = getKeyXCenter(mapping.keyId);
    if (x !== undefined) return x;
  }
  return 364;
}

/** Interpolate between two hex colors by t (0–1) */
function lerpColor(a: string, b: string, t: number): string {
  const clamp = Math.max(0, Math.min(1, t));
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * clamp);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * clamp);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * clamp);
  return `rgb(${r},${g},${bl})`;
}

export const FastRainingMode: React.FC<FastRainingModeProps> = ({
  content, criteria, xp, isReview, onQuit, onFinish,
}) => {
  const { play } = useSounds();
  const letters = content.letters;
  const speed = content.speed ?? 1;

  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [errorCharMap, setErrorCharMap] = useState<Record<string, number>>({});
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [hitCount, setHitCount] = useState(0);

  // Error feedback state
  const [errorFlash, setErrorFlash] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Hit burst state
  const [hitBursts, setHitBursts] = useState<HitBurst[]>([]);
  const burstIdRef = useRef(0);

  // Combo state
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  // Track falling letters
  const fallingRef = useRef<FallingLetter[]>([]);
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);
  const nextLetterIndex = useRef(0);
  const nextId = useRef(0);
  const lastSpawnTime = useRef(0);
  const rafRef = useRef<number>(0);
  const lastFrameTime = useRef(0);

  // Spawn interval: spacing between letters
  const spawnInterval = useMemo(() => Math.max(600, 1200 / speed), [speed]);

  // Animation loop stored in a ref so it can reference itself
  const gameLoopRef = useRef<((timestamp: number) => void) | null>(null);

  useEffect(() => {
    gameLoopRef.current = (timestamp: number) => {
      if (!lastFrameTime.current) lastFrameTime.current = timestamp;
      const dt = (timestamp - lastFrameTime.current) / 1000;
      lastFrameTime.current = timestamp;

      const pxPerSecond = BASE_SPEED * speed;

      // Spawn new letters
      if (
        nextLetterIndex.current < letters.length &&
        timestamp - lastSpawnTime.current > spawnInterval
      ) {
        const ch = letters[nextLetterIndex.current];
        const letter: FallingLetter = {
          id: nextId.current++,
          char: ch,
          x: getXForChar(ch),
          y: -40,
          status: "falling",
        };
        fallingRef.current.push(letter);
        nextLetterIndex.current++;
        lastSpawnTime.current = timestamp;
      }

      // Update positions
      let changed = false;
      for (const letter of fallingRef.current) {
        if (letter.status === "falling") {
          letter.y += pxPerSecond * dt;
          changed = true;

          // Missed: fell off screen
          if (letter.y > MISS_THRESHOLD) {
            letter.status = "missed";
          }
        }
      }

      // Count misses as errors
      const newMisses = fallingRef.current.filter(l => l.status === "missed");
      if (newMisses.length > 0) {
        fallingRef.current = fallingRef.current.filter(l => l.status !== "missed");
        changed = true;
      }

      // Remove hit letters
      fallingRef.current = fallingRef.current.filter(l => l.status !== "hit");

      if (changed || newMisses.length > 0) {
        setFallingLetters([...fallingRef.current]);
      }

      if (newMisses.length > 0) {
        setErrorCount(prev => prev + newMisses.length);
        setCombo(0);
        setShowCombo(false);
        for (const m of newMisses) {
          setErrorCharMap(prev => ({
            ...prev,
            [m.char]: (prev[m.char] || 0) + 1,
          }));
        }
        setTotalKeystrokes(prev => prev + newMisses.length);
        // Shake + flash on miss (letter hit keyboard)
        setShaking(true);
        setErrorFlash(true);
        setTimeout(() => setErrorFlash(false), 200);
      }

      // Check if game is done
      if (
        nextLetterIndex.current >= letters.length &&
        fallingRef.current.filter(l => l.status === "falling").length === 0
      ) {
        setEndTime(Date.now());
        setIsFinished(true);
        return;
      }

      rafRef.current = requestAnimationFrame((ts) => gameLoopRef.current?.(ts));
    };
  }, [letters, speed, spawnInterval]);

  // Start/stop animation loop
  useEffect(() => {
    if (started && !isFinished) {
      lastFrameTime.current = 0;
      rafRef.current = requestAnimationFrame((ts) => gameLoopRef.current?.(ts));
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, isFinished]);

  // Auto-remove expired hit bursts
  useEffect(() => {
    if (hitBursts.length === 0) return;
    const timer = setTimeout(() => {
      const now = Date.now();
      setHitBursts(prev => prev.filter(b => now - b.timestamp < 500));
    }, 500);
    return () => clearTimeout(timer);
  }, [hitBursts]);

  const stats = useMemo(() => {
    if (totalKeystrokes === 0) return { wpm: 0, accuracy: 100 };
    const accuracy = Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100);
    const now = endTime ?? Date.now();
    const timeElapsed = (now - (startTime || 0)) / 60000;
    const wpm = timeElapsed > 0 ? Math.round(hitCount / timeElapsed) : 0;
    return { wpm, accuracy: Math.max(0, accuracy) };
  }, [totalKeystrokes, errorCount, hitCount, startTime, endTime]);

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

    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }

    setActiveKey(e.key.toUpperCase());
    setTimeout(() => setActiveKey(null), 100);
    setTotalKeystrokes(prev => prev + 1);

    // Find the lowest (highest Y) falling letter matching this key
    const inZone = fallingRef.current
      .filter(l => l.status === "falling" && l.char === e.key)
      .sort((a, b) => b.y - a.y);

    if (inZone.length > 0) {
      // Hit
      play("key-correct", 0.2);
      const hitLetter = inZone[0];
      hitLetter.status = "hit";
      setHitCount(prev => prev + 1);
      setFallingLetters([...fallingRef.current]);

      // Combo
      setCombo(prev => {
        const next = prev + 1;
        if (next >= 3) setShowCombo(true);
        return next;
      });

      // Hit burst
      setHitBursts(prev => [
        ...prev.slice(-2), // keep max ~3
        { id: burstIdRef.current++, x: hitLetter.x, y: hitLetter.y, timestamp: Date.now() },
      ]);
    } else {
      // Wrong key
      play("key-error", 0.3);
      setErrorCount(prev => prev + 1);
      setCombo(0);
      setShowCombo(false);
    }
  }, [isFinished, started, play]);

  const handleFinishAction = () => {
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
    setStarted(false);
    setStartTime(null);
    setEndTime(null);
    setIsFinished(false);
    setActiveKey(null);
    setErrorCount(0);
    setErrorCharMap({});
    setTotalKeystrokes(0);
    setHitCount(0);
    setErrorFlash(false);
    setShaking(false);
    setHitBursts([]);
    setCombo(0);
    setShowCombo(false);
    fallingRef.current = [];
    setFallingLetters([]);
    nextLetterIndex.current = 0;
    nextId.current = 0;
    lastSpawnTime.current = 0;
    lastFrameTime.current = 0;
  }, []);

  const failReasons: string[] = [];
  if (isFinished && stats.accuracy < criteria.minAccuracy) {
    failReasons.push(`Přesnost ${stats.accuracy}% < ${criteria.minAccuracy}%`);
  }
  if (isFinished && stats.wpm < criteria.minWpm) {
    failReasons.push(`Rychlost ${stats.wpm} < ${criteria.minWpm} zn/min`);
  }

  // Find the lowest falling letter for keyboard target hint (derived from state, not ref)
  const lowestFalling = fallingLetters
    .filter(l => l.status === "falling")
    .sort((a, b) => b.y - a.y)[0];

  return (
    <GameShell
      progress={letters.length > 0 ? (hitCount + errorCount) / letters.length : 0}
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
      onFinish={handleFinishAction}
      onRetry={handleRetry}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`flex-1 flex flex-col justify-center items-center w-full max-w-3xl mx-auto py-20${shaking ? " game-shake" : ""}`}
        onAnimationEnd={() => setShaking(false)}
      >
        {/* Start prompt */}
        {!started && (
          <div className="absolute top-1/3 text-center">
            <p className="text-2xl font-bold text-duo-gray-dark animate-pulse">
              Stiskni libovolnou klávesu pro start
            </p>
          </div>
        )}

        {/* Rain area */}
        <div className="relative mb-4 w-full max-w-[728px] overflow-hidden" style={{ height: AREA_HEIGHT }}>
          {/* Error flash overlay */}
          <div
            className="absolute inset-0 bg-duo-red rounded-2xl pointer-events-none z-10"
            style={{
              opacity: errorFlash ? 0.12 : 0,
              transition: "opacity 150ms ease-out",
            }}
          />

          {/* Combo counter */}
          {showCombo && combo >= 3 && (
            <div
              className="absolute top-2 right-3 z-20 font-black text-lg px-3 py-1 rounded-full select-none"
              style={{
                background: "linear-gradient(135deg, #58cc02, #46a302)",
                color: "#fff",
                boxShadow: "0 2px 8px rgba(88,204,2,0.4)",
              }}
            >
              {combo}x Combo!
            </div>
          )}

          {/* Hit bursts */}
          {hitBursts.map((burst) => (
            <React.Fragment key={burst.id}>
              {/* Expanding ring */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: burst.x - 24,
                  top: burst.y - 24,
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "3px solid rgba(88,204,2,0.6)",
                  animation: "hit-ring 0.4s ease-out forwards",
                }}
              />
              {/* Green pop circle */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: burst.x - 10,
                  top: burst.y - 10,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "rgba(88,204,2,0.5)",
                  animation: "hit-pop 0.35s ease-out forwards",
                }}
              />
            </React.Fragment>
          ))}

          {/* Falling letters */}
          {fallingLetters.map((letter) => {
            const progress = Math.max(0, Math.min(1, letter.y / AREA_HEIGHT));
            const bg = letter.status === "hit"
              ? theme.green
              : lerpColor("#ddf4ff", "#ffe0cc", progress);
            const fg = letter.status === "hit"
              ? theme.white
              : lerpColor(theme.blue, "#c44900", progress);

            return (
              <div
                key={letter.id}
                className="absolute w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl select-none transition-opacity duration-200"
                style={{
                  left: letter.x - 24,
                  top: letter.y,
                  backgroundColor: bg,
                  color: fg,
                  opacity: letter.status === "hit" ? 0 : 1,
                  transform: letter.status === "hit" ? "scale(1.5)" : "scale(1)",
                }}
              >
                {letter.char}
              </div>
            );
          })}
        </div>

        <Keyboard targetKey={lowestFalling?.char} activeKey={activeKey} />
      </div>
    </GameShell>
  );
};
