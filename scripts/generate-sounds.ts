/**
 * Generate minimal WAV sound effects for the typing tutor.
 * Run: npx tsx scripts/generate-sounds.ts
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SAMPLE_RATE = 44100;
const outDir = join(__dirname, "..", "public", "sounds");

function createWav(samples: Float32Array): Buffer {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // chunk size
  buffer.writeUInt16LE(1, 20);  // PCM
  buffer.writeUInt16LE(1, 22);  // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32);  // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write("data", 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }

  return buffer;
}

function sine(freq: number, duration: number, volume = 0.5): Float32Array {
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = Math.min(1, Math.min(t * 20, (duration - t) * 20));
    samples[i] = Math.sin(2 * Math.PI * freq * t) * volume * envelope;
  }
  return samples;
}

function mix(...arrays: Float32Array[]): Float32Array {
  const maxLen = Math.max(...arrays.map(a => a.length));
  const result = new Float32Array(maxLen);
  for (const arr of arrays) {
    for (let i = 0; i < arr.length; i++) {
      result[i] += arr[i];
    }
  }
  return result;
}

function concat(...arrays: Float32Array[]): Float32Array {
  const totalLen = arrays.reduce((s, a) => s + a.length, 0);
  const result = new Float32Array(totalLen);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// Key correct: short high click
const keyCorrect = sine(1200, 0.04, 0.3);

// Key error: low buzz
const keyError = mix(sine(200, 0.08, 0.3), sine(250, 0.08, 0.2));

// Lesson complete: ascending arpeggio C5-E5-G5-C6
const lessonComplete = concat(
  sine(523.25, 0.12, 0.4),
  sine(659.25, 0.12, 0.4),
  sine(783.99, 0.12, 0.4),
  sine(1046.5, 0.25, 0.5),
);

// Lesson fail: descending
const lessonFail = concat(
  sine(400, 0.15, 0.3),
  sine(300, 0.15, 0.3),
  sine(200, 0.3, 0.3),
);

// Achievement: triumphant chord
const achievement = concat(
  mix(sine(523.25, 0.15, 0.3), sine(659.25, 0.15, 0.3), sine(783.99, 0.15, 0.3)),
  mix(sine(587.33, 0.15, 0.3), sine(739.99, 0.15, 0.3), sine(880, 0.15, 0.3)),
  mix(sine(659.25, 0.3, 0.4), sine(830.61, 0.3, 0.4), sine(987.77, 0.3, 0.4)),
);

// Streak: flame whoosh (rising tone)
const streakLen = Math.floor(SAMPLE_RATE * 0.3);
const streakSamples = new Float32Array(streakLen);
for (let i = 0; i < streakLen; i++) {
  const t = i / SAMPLE_RATE;
  const freq = 300 + t * 2000;
  const envelope = Math.min(1, Math.min(t * 10, (0.3 - t) * 10));
  streakSamples[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 * envelope;
}

// XP tick: tiny blip
const xpTick = sine(880, 0.025, 0.2);

// Level up: fanfare
const levelUp = concat(
  mix(sine(523.25, 0.1, 0.3), sine(659.25, 0.1, 0.3)),
  mix(sine(659.25, 0.1, 0.3), sine(783.99, 0.1, 0.3)),
  mix(sine(783.99, 0.1, 0.3), sine(987.77, 0.1, 0.3)),
  mix(sine(1046.5, 0.4, 0.5), sine(1318.51, 0.4, 0.4), sine(1567.98, 0.4, 0.3)),
);

const sounds: Record<string, Float32Array> = {
  "key-correct": keyCorrect,
  "key-error": keyError,
  "lesson-complete": lessonComplete,
  "lesson-fail": lessonFail,
  "achievement": achievement,
  "streak": streakSamples,
  "xp-tick": xpTick,
  "level-up": levelUp,
};

for (const [name, samples] of Object.entries(sounds)) {
  // Save as .mp3 extension but WAV format — Web Audio API handles both
  const path = join(outDir, `${name}.mp3`);
  writeFileSync(path, createWav(samples));
  console.log(`  ✓ ${name}.mp3 (${(createWav(samples).length / 1024).toFixed(1)} KB)`);
}

console.log("\nAll sounds generated!");
