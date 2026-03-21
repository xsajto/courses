// ── Game mode content types ──────────────────────────────────────────

export type GameMode = "copying" | "letter" | "new-letter" | "raining" | "fast-raining";

export type CopyingConfig = "ignore-mistakes" | "repair-mistake" | "remove-repair-mistake";

export interface CopyingContent {
  mode: "copying";
  text: string;
  config: CopyingConfig;
}

export interface LetterContent {
  mode: "letter";
  letters: string[];
}

export interface NewLetterContent {
  mode: "new-letter";
  letter: string;
  finger: string;
  letters: string[];
}

export interface RainingContent {
  mode: "raining";
  letters: string[];
}

export interface FastRainingContent {
  mode: "fast-raining";
  letters: string[];
  speed: number;
}

export type GameContent =
  | CopyingContent
  | LetterContent
  | NewLetterContent
  | RainingContent
  | FastRainingContent;

/**
 * Normalize raw lesson content JSON into a typed GameContent object.
 * Existing lessons without a `mode` field default to "copying" with "ignore-mistakes".
 */
export function normalizeContent(raw: unknown): GameContent {
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      return { mode: "copying", text: raw as string, config: "ignore-mistakes" };
    }
  }

  const obj = raw as Record<string, unknown>;

  // Legacy content: { text: "..." } without mode
  if (!obj.mode) {
    return {
      mode: "copying",
      text: (obj.text as string) ?? "",
      config: "ignore-mistakes",
    };
  }

  switch (obj.mode) {
    case "copying":
      return {
        mode: "copying",
        text: (obj.text as string) ?? "",
        config: (obj.config as CopyingConfig) ?? "ignore-mistakes",
      };

    case "letter":
      return {
        mode: "letter",
        letters: (obj.letters as string[]) ?? [],
      };

    case "new-letter":
      return {
        mode: "new-letter",
        letter: (obj.letter as string) ?? "",
        finger: (obj.finger as string) ?? "",
        letters: (obj.letters as string[]) ?? [],
      };

    case "raining":
      return {
        mode: "raining",
        letters: (obj.letters as string[]) ?? [],
      };

    case "fast-raining":
      return {
        mode: "fast-raining",
        letters: (obj.letters as string[]) ?? [],
        speed: (obj.speed as number) ?? 1,
      };

    default:
      // Unknown mode — treat as copying fallback
      return {
        mode: "copying",
        text: (obj.text as string) ?? "",
        config: "ignore-mistakes",
      };
  }
}
