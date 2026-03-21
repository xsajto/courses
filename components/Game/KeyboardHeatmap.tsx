"use client";

import React from "react";

const ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

function getHeatColor(ratio: number): string {
  // 0 = green, 0.5 = yellow, 1 = red
  if (ratio <= 0) return "#58cc02"; // duo-green
  if (ratio <= 0.25) return "#a3e635";
  if (ratio <= 0.5) return "#ffc800"; // duo-yellow
  if (ratio <= 0.75) return "#ff8c00";
  return "#ff4b4b"; // duo-red
}

interface KeyboardHeatmapProps {
  charErrors: Record<string, number>;
}

export function KeyboardHeatmap({ charErrors }: KeyboardHeatmapProps) {
  const maxErrors = Math.max(1, ...Object.values(charErrors));

  return (
    <div className="flex flex-col items-center gap-1.5">
      {ROWS.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-1.5" style={{ marginLeft: rIdx * 16 }}>
          {row.map(key => {
            const errors = charErrors[key] ?? 0;
            const ratio = errors / maxErrors;
            const color = errors > 0 ? getHeatColor(ratio) : "#e5e5e5";

            return (
              <div
                key={key}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black transition-colors relative"
                style={{
                  backgroundColor: color,
                  color: errors > 0 ? "white" : "#afafaf",
                  boxShadow: errors > 0 ? `0 3px 0 ${color}80` : "0 3px 0 #d5d5d5",
                }}
              >
                {key}
                {errors > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-duo-red text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-duo-red/20">
                    {errors}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
