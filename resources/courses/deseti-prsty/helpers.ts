/**
 * Shared helpers for building lesson definitions.
 */
import { FINGER_DESCRIPTIONS } from "../../finger-map";
import {
  generatePracticeLetters,
  generateCopyingText,
  pickSentence,
  buildText,
  getWordsForLetters,
} from "../../vocabulary";
import type { GameContent } from "@/lib/game-types";

// ── Types matching what seed.ts expects ─────────────────────────────

export interface LessonDef {
  title: string;
  slug: string;
  order: number;
  isReview: boolean;
  xp: number;
  content: GameContent;
  criteria: { minWpm: number; minAccuracy: number };
}

export interface UnitDef {
  title: string;
  order: number;
  lessons: LessonDef[];
}

export interface SectionDef {
  title: string;
  order: number;
  units: UnitDef[];
}

// ── Global lesson counter (used for unique slugs) ───────────────────

let globalLessonOrder = 0;

export function resetLessonOrder() {
  globalLessonOrder = 0;
}

function nextOrder(): number {
  return ++globalLessonOrder;
}

// ── Display name helpers ────────────────────────────────────────────

const SPECIAL_NAMES: Record<string, string> = {
  " ": "Mezerník",
  ",": "Čárka",
  ".": "Tečka",
  "-": "Pomlčka",
  "?": "Otazník",
  "!": "Vykřičník",
  ";": "Středník",
  ":": "Dvojtečka",
};

/** Human-readable name for a character */
function charName(ch: string): string {
  return SPECIAL_NAMES[ch] ?? ch.toUpperCase();
}

/** Short label for a set of letters, e.g. "F J D K" */
function lettersLabel(letters: string[], max: number = 6): string {
  const shown = letters.slice(0, max).map(charName);
  return shown.join(" ");
}

/** Title for copying lessons based on config */
function copyingTitle(config: string): string {
  switch (config) {
    case "ignore-mistakes": return "Volný opis";
    case "repair-mistake": return "Přesný opis";
    case "remove-repair-mistake": return "Opis bez chyb";
    default: return "Opis";
  }
}

// ── Sentence filtering ──────────────────────────────────────────────

/**
 * Returns only sentences whose every character belongs to the given pool.
 */
export function filterSentences(sentences: string[], pool: string[]): string[] {
  const set = new Set(pool);
  return sentences.filter(s => {
    for (const ch of s) {
      if (!set.has(ch)) return false;
    }
    return true;
  });
}

// ── Lesson builders ─────────────────────────────────────────────────

export function newLetterLesson(
  letter: string,
  knownSoFar: string[],
  wpm: number,
  acc: number,
  slug: string,
): LessonDef {
  const finger = FINGER_DESCRIPTIONS[letter] ?? "ukazováčkem";
  // Only use the new letter + letters already taught before this lesson
  const letters = generatePracticeLetters([letter], [...knownSoFar, letter], 20, slug.length * 7);
  const title = SPECIAL_NAMES[letter]
    ? `Nové písmeno ${SPECIAL_NAMES[letter]}`
    : `Nové písmeno ${letter.toUpperCase()}`;
  return {
    title,
    slug,
    order: nextOrder(),
    isReview: false,
    xp: 10,
    content: { mode: "new-letter", letter, finger, letters },
    criteria: { minWpm: wpm, minAccuracy: acc },
  };
}

export function letterDrillLesson(
  newLetters: string[],
  allKnown: string[],
  count: number,
  wpm: number,
  acc: number,
  slug: string,
  title?: string,
  isReview: boolean = false,
): LessonDef {
  const letters = generatePracticeLetters(newLetters, allKnown, count, slug.length * 13);
  return {
    title: title ?? `Dril ${lettersLabel(newLetters)}`,
    slug,
    order: nextOrder(),
    isReview,
    xp: isReview ? 25 : 10,
    content: { mode: "letter", letters },
    criteria: { minWpm: wpm, minAccuracy: acc },
  };
}

export function rainingLesson(
  newLetters: string[],
  allKnown: string[],
  count: number,
  wpm: number,
  acc: number,
  slug: string,
): LessonDef {
  const letters = generatePracticeLetters(newLetters, allKnown, count, slug.length * 17);
  return {
    title: "Déšť písmen",
    slug,
    order: nextOrder(),
    isReview: false,
    xp: 15,
    content: { mode: "raining", letters },
    criteria: { minWpm: wpm, minAccuracy: acc },
  };
}

export function fastRainingLesson(
  newLetters: string[],
  allKnown: string[],
  count: number,
  speed: number,
  wpm: number,
  acc: number,
  slug: string,
): LessonDef {
  const letters = generatePracticeLetters(newLetters, allKnown, count, slug.length * 19);
  return {
    title: "Rychlý déšť",
    slug,
    order: nextOrder(),
    isReview: false,
    xp: 15,
    content: { mode: "fast-raining", letters, speed },
    criteria: { minWpm: wpm, minAccuracy: acc },
  };
}

export function copyingLesson(
  text: string,
  config: "ignore-mistakes" | "repair-mistake" | "remove-repair-mistake",
  wpm: number,
  acc: number,
  slug: string,
  title?: string,
  isReview: boolean = false,
): LessonDef {
  return {
    title: title ?? copyingTitle(config),
    slug,
    order: nextOrder(),
    isReview,
    xp: isReview ? 25 : 15,
    content: { mode: "copying", text, config },
    criteria: { minWpm: wpm, minAccuracy: acc },
  };
}

export function copyingFromPoolLesson(
  available: string[],
  targetLength: number,
  config: "ignore-mistakes" | "repair-mistake" | "remove-repair-mistake",
  wpm: number,
  acc: number,
  slug: string,
  title?: string,
  isReview: boolean = false,
): LessonDef {
  const text = generateCopyingText(available, targetLength, slug.length * 23);
  return copyingLesson(text, config, wpm, acc, slug, title, isReview);
}

export function sentenceCopyLesson(
  sentences: string[],
  index: number,
  targetLength: number,
  config: "ignore-mistakes" | "repair-mistake" | "remove-repair-mistake",
  wpm: number,
  acc: number,
  slug: string,
  title?: string,
  isReview: boolean = false,
): LessonDef {
  const text = targetLength > 0
    ? buildText(sentences, index, targetLength)
    : pickSentence(sentences, index);
  return copyingLesson(text, config, wpm, acc, slug, title, isReview);
}

/**
 * Build a standard unit introducing new letters.
 *
 * Adaptive template:
 * - When the pool has space and enough matching sentences/words → includes copying lessons
 * - When the pool is too small (no space, few letters) → replaces copying with more drills/raining
 */
export function buildStandardUnit(opts: {
  unitTitle: string;
  unitOrder: number;
  slugPrefix: string;
  newLetters: string[];
  allKnown: string[];
  sentences: string[];
  sentenceStartIdx: number;
  wpmRange: [number, number]; // [start, end] for this unit
  accRange: [number, number];
}): UnitDef {
  const { unitTitle, unitOrder, slugPrefix, newLetters, allKnown, sentences, sentenceStartIdx } = opts;
  const [wpmLo, wpmHi] = opts.wpmRange;
  const [accLo, accHi] = opts.accRange;

  // Interpolate WPM/acc across 7 lessons
  const w = (i: number) => Math.max(40, Math.round(wpmLo + (wpmHi - wpmLo) * (i / 6)));
  const a = (i: number) => Math.round(accLo + (accHi - accLo) * (i / 6));

  const lessons: LessonDef[] = [];

  // Letters known before this unit (allKnown minus newLetters)
  const newSet = new Set(newLetters);
  const previouslyKnown = allKnown.filter(l => !newSet.has(l));

  // Determine if copying lessons are feasible
  const hasSpace = allKnown.includes(" ");
  const matchingSentences = filterSentences(sentences, allKnown);
  const matchingWords = hasSpace ? getWordsForLetters(allKnown) : [];
  const canDoCopying = hasSpace && (matchingSentences.length >= 2 || matchingWords.length >= 8);

  // 1. New letter intro — interleave mini-drills between new letters
  //    when there are 2+ new letters and previously known letters exist (from D+K onwards).
  const interleave = newLetters.length >= 2 && previouslyKnown.length > 0;
  for (let nl = 0; nl < newLetters.length; nl++) {
    const knownSoFar = [...previouslyKnown, ...newLetters.slice(0, nl)];
    lessons.push(newLetterLesson(
      newLetters[nl], knownSoFar, w(0), a(0),
      `${slugPrefix}-new-${newLetters[nl]}`,
    ));
    // After each new-letter except the last, insert a mini-drill
    if (interleave && nl < newLetters.length - 1) {
      const drillPool = [...knownSoFar, newLetters[nl]];
      lessons.push(letterDrillLesson(
        [newLetters[nl]], drillPool, 50, w(0), a(0),
        `${slugPrefix}-minidrill-${newLetters[nl]}`,
        `Dril ${charName(newLetters[nl])}`,
      ));
    }
  }

  // F+J special path (pool ≤ 2): just raining and done — quick start
  if (allKnown.length <= 2) {
    lessons.push(rainingLesson(
      newLetters, allKnown, 35, w(2), a(2),
      `${slugPrefix}-rain`,
    ));
    return { title: unitTitle, order: unitOrder, lessons };
  }

  // 2. Letter drill
  lessons.push(letterDrillLesson(
    newLetters, allKnown, 80, w(1), a(1),
    `${slugPrefix}-drill`,
  ));

  // 3. Raining
  lessons.push(rainingLesson(
    newLetters, allKnown, 35, w(2), a(2),
    `${slugPrefix}-rain`,
  ));

  if (canDoCopying) {
    // 4. Copying (ignore mistakes) — use filtered sentences or fall back to pool
    if (matchingSentences.length >= 2) {
      lessons.push(sentenceCopyLesson(
        matchingSentences, sentenceStartIdx, 180, "ignore-mistakes",
        w(3), a(3), `${slugPrefix}-copy1`,
      ));
    } else {
      lessons.push(copyingFromPoolLesson(
        allKnown, 180, "ignore-mistakes",
        w(3), a(3), `${slugPrefix}-copy1`,
      ));
    }

    // 5. Raining
    lessons.push(rainingLesson(
      newLetters, allKnown, 45, w(4), a(4),
      `${slugPrefix}-fast`,
    ));

    // 6. Copying (repair mistake)
    if (matchingSentences.length >= 4) {
      lessons.push(sentenceCopyLesson(
        matchingSentences, sentenceStartIdx + 2, 250, "repair-mistake",
        w(5), a(5), `${slugPrefix}-copy2`,
      ));
    } else {
      lessons.push(copyingFromPoolLesson(
        allKnown, 250, "repair-mistake",
        w(5), a(5), `${slugPrefix}-copy2`,
      ));
    }

    // 7. Test
    if (matchingSentences.length >= 4) {
      lessons.push(sentenceCopyLesson(
        matchingSentences, sentenceStartIdx + 4, 440, "repair-mistake",
        w(6), a(6), `${slugPrefix}-test`,
        "Test", true,
      ));
    } else {
      lessons.push(copyingFromPoolLesson(
        allKnown, 440, "repair-mistake",
        w(6), a(6), `${slugPrefix}-test`,
        "Test", true,
      ));
    }
  } else if (allKnown.length <= 4) {
    // Small pool (D+K) — compact template

    // 4. Raining
    lessons.push(rainingLesson(
      newLetters, allKnown, 40, w(4), a(4),
      `${slugPrefix}-fast`,
    ));

    // 5. Test drill
    lessons.push(letterDrillLesson(
      newLetters, allKnown, 90, w(6), a(6),
      `${slugPrefix}-test`,
      "Test", true,
    ));
  } else {
    // Medium pool without space — full drill/raining template

    // 4. Extra drill (instead of Volný opis)
    lessons.push(letterDrillLesson(
      newLetters, allKnown, 90, w(3), a(3),
      `${slugPrefix}-drill2`,
      "Dril",
    ));

    // 5. Raining
    lessons.push(rainingLesson(
      newLetters, allKnown, 45, w(4), a(4),
      `${slugPrefix}-fast`,
    ));

    // 6. Raining (instead of Přesný opis)
    lessons.push(rainingLesson(
      newLetters, allKnown, 50, w(5), a(5),
      `${slugPrefix}-rain2`,
    ));

    // 7. Test drill (instead of copying test)
    lessons.push(letterDrillLesson(
      newLetters, allKnown, 100, w(6), a(6),
      `${slugPrefix}-test`,
      "Test", true,
    ));
  }

  return { title: unitTitle, order: unitOrder, lessons };
}

/**
 * Build a review unit (no new letters, just practice).
 * Sentences are filtered to only use known characters.
 */
export function buildReviewUnit(opts: {
  unitTitle: string;
  unitOrder: number;
  slugPrefix: string;
  allKnown: string[];
  sentences: string[];
  wpm: number;
  acc: number;
  lessonCount?: number;
}): UnitDef {
  const { unitTitle, unitOrder, slugPrefix, allKnown, sentences, wpm, acc } = opts;
  const count = opts.lessonCount ?? 5;
  const lessons: LessonDef[] = [];

  const filtered = filterSentences(sentences, allKnown);
  const hasSpace = allKnown.includes(" ");
  const matchingWords = hasSpace ? getWordsForLetters(allKnown) : [];
  const canDoCopying = hasSpace && (filtered.length >= 2 || matchingWords.length >= 8);

  for (let i = 0; i < count; i++) {
    if (i === 0) {
      lessons.push(rainingLesson(
        allKnown, allKnown, 40, wpm - 5, acc - 2,
        `${slugPrefix}-r${i}`,
      ));
    } else if (i === count - 1) {
      // Final test — copying if possible, otherwise drill
      if (canDoCopying) {
        if (filtered.length >= 2) {
          lessons.push(sentenceCopyLesson(
            filtered, i * 2, 250, "repair-mistake",
            wpm, acc, `${slugPrefix}-r${i}`,
            "Závěrečný test", true,
          ));
        } else {
          lessons.push(copyingFromPoolLesson(
            allKnown, 250, "repair-mistake",
            wpm, acc, `${slugPrefix}-r${i}`,
            "Závěrečný test", true,
          ));
        }
      } else {
        lessons.push(letterDrillLesson(
          allKnown, allKnown, 100, wpm, acc,
          `${slugPrefix}-r${i}`,
          "Závěrečný test", true,
        ));
      }
    } else if (i % 2 === 1 && canDoCopying) {
      // Copying on odd slots (when possible)
      if (filtered.length >= 2) {
        lessons.push(sentenceCopyLesson(
          filtered, i * 2, 200, "ignore-mistakes",
          wpm - 3, acc - 1, `${slugPrefix}-r${i}`,
        ));
      } else {
        lessons.push(copyingFromPoolLesson(
          allKnown, 200, "ignore-mistakes",
          wpm - 3, acc - 1, `${slugPrefix}-r${i}`,
        ));
      }
    } else {
      // Drill on even slots (or all non-raining slots when no copying)
      lessons.push(letterDrillLesson(
        allKnown, allKnown, 90, wpm - 3, acc - 1,
        `${slugPrefix}-r${i}`,
        "Dril",
      ));
    }
  }

  return { title: unitTitle, order: unitOrder, lessons };
}
