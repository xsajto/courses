"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ROWS, CHAR_TO_KEY, LEFT_KEYS, type KeyDef } from "./keyboard-utils";

// --- Component ---
interface KeyboardProps {
  targetKey: string | undefined;
  activeKey: string | null;
  highlightKeys?: string[];
}

export const Keyboard: React.FC<KeyboardProps> = ({ targetKey, activeKey, highlightKeys }) => {
  // Resolve target character → which key to highlight + shift
  const targetMapping = targetKey ? CHAR_TO_KEY.get(targetKey) : undefined;
  const targetKeyId = targetMapping?.keyId;
  const needsShift = targetMapping?.needsShift ?? false;
  const shiftKeyId = targetKeyId
    ? LEFT_KEYS.has(targetKeyId) ? "rshift" : "lshift"
    : undefined;

  // Build set of highlighted key IDs
  const highlightSet = React.useMemo(() => {
    if (!highlightKeys) return undefined;
    const set = new Set<string>();
    for (const ch of highlightKeys) {
      const m = CHAR_TO_KEY.get(ch) ?? CHAR_TO_KEY.get(ch.toLowerCase());
      if (m) set.add(m.keyId);
    }
    return set;
  }, [highlightKeys]);

  // Resolve active (pressed) key
  let activeKeyId: string | undefined;
  if (activeKey === "ENTER") {
    activeKeyId = "enter";
  } else if (activeKey === " " || activeKey === "SPACE") {
    activeKeyId = "space";
  } else if (activeKey) {
    const m = CHAR_TO_KEY.get(activeKey) ?? CHAR_TO_KEY.get(activeKey.toLowerCase());
    activeKeyId = m?.keyId;
  }

  return (
    <div className="bg-duo-keyboard-bg rounded-xl p-[6px] pb-0 w-[728px] max-w-full mx-auto">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-[6px] mb-[6px]">
          {row.map((keyDef) => (
            <Key
              key={keyDef.id}
              keyDef={keyDef}
              isTarget={keyDef.id === targetKeyId || (needsShift && (keyDef.id === shiftKeyId))}
              isActive={keyDef.id === activeKeyId}
              isHighlighted={highlightSet?.has(keyDef.id) ?? false}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// --- Single key renderer ---
const Key: React.FC<{
  keyDef: KeyDef;
  isTarget: boolean;
  isActive: boolean;
  isHighlighted: boolean;
}> = ({ keyDef, isTarget, isActive, isHighlighted }) => {
  const isSpace = keyDef.id === "space";
  const isFlex = keyDef.type === "special" && keyDef.flex;
  const align = keyDef.type === "special" ? keyDef.align : undefined;

  const showHighlight = isTarget || isHighlighted;

  const base = cn(
    "h-[44px] rounded-lg select-none transition-all duration-75 flex items-center flex-shrink-0",
    "shadow-[0_1px_0_1px_var(--color-duo-keyboard-shadow)]",
    isFlex ? "flex-1 min-w-0" : "w-[42px]",
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center",
    showHighlight
      ? "bg-duo-blue-light text-duo-blue shadow-[0_1px_0_1px_var(--color-duo-blue-dark)]"
      : "bg-white text-gray-600",
    isActive && "translate-y-[2px] scale-[0.97] shadow-none",
  );

  // Spacebar
  if (isSpace) {
    return (
      <div className={base}>
        {showHighlight && (
          <span className="text-[10px] text-duo-blue uppercase tracking-[0.2em] animate-pulse font-bold">
            Mezerník
          </span>
        )}
      </div>
    );
  }

  // Dual-label key (shift char on top, main on bottom)
  if (keyDef.type === "dual") {
    return (
      <div className={cn(base, "flex-col justify-center gap-0.5 px-1")}>
        <span className={cn("text-[10px] leading-none", showHighlight ? "text-duo-blue/60" : "text-gray-400")}>
          {keyDef.shift}
        </span>
        <span className={cn("text-[16px] leading-none font-medium", showHighlight ? "text-duo-blue" : "text-gray-700")}>
          {keyDef.main}
        </span>
      </div>
    );
  }

  // Letter key
  if (keyDef.type === "letter") {
    return (
      <div className={base}>
        <span className={cn("text-[16px] font-medium", showHighlight ? "text-duo-blue" : "text-gray-700")}>
          {keyDef.label}
        </span>
      </div>
    );
  }

  // Special key (Tab, Caps, Enter, Shift, modifiers)
  return (
    <div className={cn(base, "px-2")}>
      <span className={cn(
        "text-[10px] font-medium whitespace-nowrap",
        showHighlight ? "text-duo-blue" : "text-gray-500"
      )}>
        {keyDef.label}
      </span>
    </div>
  );
};
