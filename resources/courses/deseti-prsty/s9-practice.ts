import {
  letterLesson,
  type SectionDef,
  type UnitDef,
  type LessonDef,
} from "./helpers";

export function buildSection9(): SectionDef {
  const units: UnitDef[] = [];

  // Unit 1: Weak Keys
  {
    const lessons: LessonDef[] = [];

    // We add 3 "slots" for practice lessons.
    // Their content will be dynamically generated on the client.
    lessons.push(letterLesson(
      ["a", "s", "d", "f"], 1, 90,
      "s9u1-weak1",
      "Problémové klávesy — úroveň 1",
      true
    ));
    lessons.push(letterLesson(
      ["j", "k", "l", ";"], 1, 90,
      "s9u1-weak2",
      "Problémové klávesy — úroveň 2",
      true
    ));
    lessons.push(letterLesson(
      ["g", "h"], 1, 90,
      "s9u1-weak3",
      "Problémové klávesy — úroveň 3",
      true
    ));

    units.push({ title: "Procvičování slabých míst", order: 1, lessons });
  }

  return {
    title: "Procvičování",
    order: 9,
    units,
  };
}
