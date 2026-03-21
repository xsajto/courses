"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { loadSounds, playSound, setMuted, isMuted, type SoundName } from "./sounds";

/**
 * React hook for the sound manager.
 * Preloads sounds on first user interaction. Provides play() and mute toggle.
 */
export function useSounds() {
  const [mute, setMuteState] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    setMuteState(isMuted());
  }, []);

  useEffect(() => {
    if (loaded.current) return;

    const init = async () => {
      if (loaded.current) return;
      loaded.current = true;
      await loadSounds();
    };

    // Load on first user interaction
    const events = ["click", "keydown", "touchstart"] as const;
    const handler = () => {
      init();
      for (const e of events) {
        window.removeEventListener(e, handler);
      }
    };
    for (const e of events) {
      window.addEventListener(e, handler, { once: false });
    }

    return () => {
      for (const e of events) {
        window.removeEventListener(e, handler);
      }
    };
  }, []);

  const play = useCallback((name: SoundName, volume?: number) => {
    playSound(name, volume);
  }, []);

  const toggleMute = useCallback(() => {
    const newVal = !isMuted();
    setMuted(newVal);
    setMuteState(newVal);
  }, []);

  return { play, muted: mute, toggleMute };
}
