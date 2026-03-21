/**
 * Section 7: Speciální znaky (Special characters)
 * Adds: ú, ď, ť, ň, numbers, punctuation (!?;:)
 * 8 units (1 letter per unit, numbers together), ~50 lessons
 */
import {
  buildStandardUnit,
  buildReviewUnit,
  type SectionDef,
} from "./helpers";
import {
  SENTENCES_DIAC_U,
  SENTENCES_NUMBERS,
  SENTENCES_PUNCT,
  SENTENCES_FULL_DIAC,
} from "../../vocabulary";
import { POOL_AFTER_S6 } from "./s6-diacritics";

export function buildSection7(): SectionDef {
  const units = [];
  let pool = [...POOL_AFTER_S6];

  // Unit 1: ú
  pool = [...pool, "ú"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Ú",
    unitOrder: 1,
    slugPrefix: "s7u1",
    newLetters: ["ú"],
    allKnown: pool,
    sentences: [...SENTENCES_DIAC_U, ...SENTENCES_FULL_DIAC],
    sentenceStartIdx: 0,
    wpmRange: [75, 88],
    accRange: [87, 92],
  }));

  // Unit 2: ď
  pool = [...pool, "ď"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Ď",
    unitOrder: 2,
    slugPrefix: "s7u2",
    newLetters: ["ď"],
    allKnown: pool,
    sentences: SENTENCES_FULL_DIAC,
    sentenceStartIdx: 0,
    wpmRange: [76, 88],
    accRange: [87, 92],
  }));

  // Unit 3: ť
  pool = [...pool, "ť"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Ť",
    unitOrder: 3,
    slugPrefix: "s7u3",
    newLetters: ["ť"],
    allKnown: pool,
    sentences: SENTENCES_FULL_DIAC,
    sentenceStartIdx: 2,
    wpmRange: [76, 89],
    accRange: [87, 92],
  }));

  // Unit 4: ň
  pool = [...pool, "ň"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Ň",
    unitOrder: 4,
    slugPrefix: "s7u4",
    newLetters: ["ň"],
    allKnown: pool,
    sentences: SENTENCES_FULL_DIAC,
    sentenceStartIdx: 4,
    wpmRange: [77, 89],
    accRange: [87, 93],
  }));

  // Unit 5: Numbers
  pool = [...pool, "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  units.push(buildStandardUnit({
    unitTitle: "Čísla",
    unitOrder: 5,
    slugPrefix: "s7u5",
    newLetters: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    allKnown: pool,
    sentences: SENTENCES_NUMBERS,
    sentenceStartIdx: 0,
    wpmRange: [72, 85],
    accRange: [86, 92],
  }));

  // Unit 6: ?
  pool = [...pool, "?", ";"];
  units.push(buildStandardUnit({
    unitTitle: "Otazník",
    unitOrder: 6,
    slugPrefix: "s7u6",
    newLetters: ["?"],
    allKnown: pool,
    sentences: SENTENCES_PUNCT,
    sentenceStartIdx: 0,
    wpmRange: [78, 90],
    accRange: [88, 93],
  }));

  // Unit 7: !
  pool = [...pool, "!", ":"];
  units.push(buildStandardUnit({
    unitTitle: "Vykřičník",
    unitOrder: 7,
    slugPrefix: "s7u7",
    newLetters: ["!"],
    allKnown: pool,
    sentences: SENTENCES_PUNCT,
    sentenceStartIdx: 2,
    wpmRange: [78, 90],
    accRange: [88, 93],
  }));

  // Unit 8: Review
  units.push(buildReviewUnit({
    unitTitle: "Opakování speciálních znaků",
    unitOrder: 8,
    slugPrefix: "s7u8",
    allKnown: pool,
    sentences: [...SENTENCES_NUMBERS, ...SENTENCES_PUNCT, ...SENTENCES_FULL_DIAC],
    wpm: 90,
    acc: 93,
    lessonCount: 6,
  }));

  return {
    title: "Speciální znaky",
    order: 7,
    units,
  };
}

export const POOL_AFTER_S7 = [
  ...POOL_AFTER_S6, "ú", "ď", "ť", "ň",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "?", "!", ";", ":",
];
