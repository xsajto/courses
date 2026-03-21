/**
 * Section 8: Mistr klávesnice (Keyboard mastery)
 * Speed & fluency, final exam
 * 2 units, ~14 lessons
 */
import {
  copyingLesson,
  rainingLesson,
  buildReviewUnit,
  type SectionDef,
  type UnitDef,
  type LessonDef,
} from "./helpers";
import { SENTENCES_SPEED, SENTENCES_FULL_DIAC } from "../../vocabulary";
import { POOL_AFTER_S7 } from "./s7-special";

export function buildSection8(): SectionDef {
  const pool = [...POOL_AFTER_S7];
  const units: UnitDef[] = [];

  // Unit 1: Speed and fluency
  {
    const lessons: LessonDef[] = [];
    const allSentences = [...SENTENCES_SPEED, ...SENTENCES_FULL_DIAC];

    // Progressive speed drills
    lessons.push(rainingLesson(
      pool.slice(0, 20), pool, 50, 85, 90,
      "s8u1-rain1",
    ));
    lessons.push(copyingLesson(
      allSentences[0], "repair-mistake", 85, 90,
      "s8u1-copy1",
    ));
    lessons.push(rainingLesson(
      pool.slice(0, 20), pool, 55, 88, 90,
      "s8u1-fast1",
    ));
    lessons.push(copyingLesson(
      allSentences[1] + " " + allSentences[2], "repair-mistake", 88, 91,
      "s8u1-copy2",
    ));
    lessons.push(copyingLesson(
      allSentences[3] + " " + allSentences[4], "repair-mistake", 88, 91,
      "s8u1-copy3",
    ));
    lessons.push(rainingLesson(
      pool.slice(0, 20), pool, 60, 90, 92,
      "s8u1-fast2",
    ));
    lessons.push(copyingLesson(
      allSentences[5] + " " + allSentences[6] + " " + allSentences[7],
      "remove-repair-mistake", 90, 92,
      "s8u1-copy4",
    ));

    units.push({ title: "Rychlost a plynulost", order: 1, lessons });
  }

  // Unit 2: Final exam
  {
    const lessons: LessonDef[] = [];
    const allSentences = [...SENTENCES_SPEED, ...SENTENCES_FULL_DIAC];

    lessons.push(copyingLesson(
      allSentences[8] + " " + allSentences[9],
      "repair-mistake", 85, 92,
      "s8u2-warm",
      "Zahřívací kolo",
    ));
    lessons.push(copyingLesson(
      allSentences[10] + " " + allSentences[11],
      "remove-repair-mistake", 88, 93,
      "s8u2-exam1",
      "Zkouška — část 1",
    ));
    lessons.push(copyingLesson(
      allSentences[12] + " " + allSentences[13],
      "remove-repair-mistake", 90, 93,
      "s8u2-exam2",
      "Zkouška — část 2",
    ));
    lessons.push(copyingLesson(
      allSentences[0] + " " + allSentences[2] + " " + allSentences[4],
      "remove-repair-mistake", 92, 94,
      "s8u2-exam3",
      "Zkouška — část 3",
    ));
    lessons.push(copyingLesson(
      allSentences[1] + " " + allSentences[3] + " " + allSentences[5] + " " + allSentences[7],
      "remove-repair-mistake", 95, 94,
      "s8u2-final",
      "Závěrečná zkouška",
      true,
    ));
    lessons.push(copyingLesson(
      allSentences.slice(8, 15).join(" "),
      "remove-repair-mistake", 100, 95,
      "s8u2-master",
      "Mistr klávesnice",
      true,
    ));

    units.push({ title: "Závěrečná zkouška", order: 2, lessons });
  }

  return {
    title: "Mistr klávesnice",
    order: 8,
    units,
  };
}
