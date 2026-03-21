"use client";

import React from "react";
import { X, Activity, Volume2, VolumeX } from "lucide-react";

interface GameNavbarProps {
  progress: number; // 0–1
  cpm: number;
  onQuit: () => void;
  muted?: boolean;
  onToggleMute?: () => void;
}

export const GameNavbar: React.FC<GameNavbarProps> = ({ progress, cpm, onQuit, muted, onToggleMute }) => (
  <div className="game-navbar">
    <button onClick={onQuit} className="nav-back"><X size={24} /></button>
    <div className="xp-track flex-1 mx-8">
      <div className="fill" style={{ width: `${progress * 100}%` }} />
    </div>
    <div className="flex items-center gap-3">
      <div className="currency-pill">
        <Activity size={20} className="text-duo-red" />
        <span className="text-duo-red font-black text-sm">{cpm}</span>
      </div>
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className="p-2 rounded-xl hover:bg-duo-gray/20 transition-colors"
          aria-label={muted ? "Zapnout zvuk" : "Vypnout zvuk"}
        >
          {muted ? (
            <VolumeX size={20} className="text-duo-gray-dark" />
          ) : (
            <Volume2 size={20} className="text-duo-gray-dark" />
          )}
        </button>
      )}
    </div>
  </div>
);
