/**
 * Web Audio API based sound manager for low-latency typing sounds.
 * Decodes audio buffers once, then plays with near-zero latency.
 */

export type SoundName =
  | "key-correct"
  | "key-error"
  | "lesson-complete"
  | "lesson-fail"
  | "achievement"
  | "streak"
  | "xp-tick"
  | "level-up";

const SOUND_URLS: Record<SoundName, string> = {
  "key-correct": "/sounds/key-correct.mp3",
  "key-error": "/sounds/key-error.mp3",
  "lesson-complete": "/sounds/lesson-complete.mp3",
  "lesson-fail": "/sounds/lesson-fail.mp3",
  "achievement": "/sounds/achievement.mp3",
  "streak": "/sounds/streak.mp3",
  "xp-tick": "/sounds/xp-tick.mp3",
  "level-up": "/sounds/level-up.mp3",
};

let audioContext: AudioContext | null = null;
const buffers = new Map<SoundName, AudioBuffer>();
let muted = false;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export async function loadSounds(): Promise<void> {
  const ctx = getContext();

  // Resume context if suspended (browsers require user interaction)
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const entries = Object.entries(SOUND_URLS) as [SoundName, string][];
  await Promise.allSettled(
    entries.map(async ([name, url]) => {
      if (buffers.has(name)) return;
      try {
        const res = await fetch(url);
        const arrayBuf = await res.arrayBuffer();
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        buffers.set(name, audioBuf);
      } catch {
        // Sound file missing — silently ignore
      }
    })
  );
}

export function playSound(name: SoundName, volume = 0.5): void {
  if (muted) return;

  const ctx = getContext();
  const buffer = buffers.get(name);
  if (!buffer) return;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gainNode = ctx.createGain();
  gainNode.gain.value = volume;

  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(0);
}

export function setMuted(value: boolean): void {
  muted = value;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("tukej-muted", value ? "1" : "0");
  }
}

export function isMuted(): boolean {
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem("tukej-muted");
    if (stored !== null) {
      muted = stored === "1";
    }
  }
  return muted;
}
