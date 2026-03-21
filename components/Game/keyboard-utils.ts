// ── Keyboard layout data & utilities ─────────────────────────────────
// Extracted from Keyboard.tsx so other game modes can use key positions.

// --- Key types ---
export type KeyDef =
  | { type: "letter"; label: string; id: string }
  | { type: "dual"; main: string; shift: string; id: string }
  | { type: "special"; label: string; id: string; flex?: boolean; align?: "left" | "right" };

// --- Full Czech QWERTZ layout (5 rows) ---
export const ROWS: KeyDef[][] = [
  // Row 0 — Number row
  [
    { type: "dual", main: ";", shift: "°", id: "semicolon" },
    { type: "dual", main: "+", shift: "1", id: "1" },
    { type: "dual", main: "ě", shift: "2", id: "2" },
    { type: "dual", main: "š", shift: "3", id: "3" },
    { type: "dual", main: "č", shift: "4", id: "4" },
    { type: "dual", main: "ř", shift: "5", id: "5" },
    { type: "dual", main: "ž", shift: "6", id: "6" },
    { type: "dual", main: "ý", shift: "7", id: "7" },
    { type: "dual", main: "á", shift: "8", id: "8" },
    { type: "dual", main: "í", shift: "9", id: "9" },
    { type: "dual", main: "é", shift: "0", id: "0" },
    { type: "dual", main: "=", shift: "%", id: "equal" },
    { type: "dual", main: "´", shift: "ˇ", id: "accent" },
    { type: "special", label: "Backspace ⌫", id: "backspace", flex: true, align: "right" },
  ],
  // Row 1 — Top letter row (QWERTZ)
  [
    { type: "special", label: "→| Tab", id: "tab", flex: true, align: "left" },
    { type: "letter", label: "Q", id: "q" },
    { type: "letter", label: "W", id: "w" },
    { type: "letter", label: "E", id: "e" },
    { type: "letter", label: "R", id: "r" },
    { type: "letter", label: "T", id: "t" },
    { type: "letter", label: "Z", id: "z" },
    { type: "letter", label: "U", id: "u" },
    { type: "letter", label: "I", id: "i" },
    { type: "letter", label: "O", id: "o" },
    { type: "letter", label: "P", id: "p" },
    { type: "dual", main: "ú", shift: "/", id: "uuring" },
    { type: "dual", main: ")", shift: "(", id: "paren" },
    { type: "dual", main: "¨", shift: "'", id: "diaeresis" },
  ],
  // Row 2 — Home row
  [
    { type: "special", label: "⇧ Caps Lock", id: "caps", flex: true, align: "left" },
    { type: "letter", label: "A", id: "a" },
    { type: "letter", label: "S", id: "s" },
    { type: "letter", label: "D", id: "d" },
    { type: "letter", label: "F", id: "f" },
    { type: "letter", label: "G", id: "g" },
    { type: "letter", label: "H", id: "h" },
    { type: "letter", label: "J", id: "j" },
    { type: "letter", label: "K", id: "k" },
    { type: "letter", label: "L", id: "l" },
    { type: "dual", main: "ů", shift: "\"", id: "uring" },
    { type: "dual", main: "§", shift: "!", id: "section" },
    { type: "special", label: "Enter ↵", id: "enter", flex: true, align: "right" },
  ],
  // Row 3 — Bottom row
  [
    { type: "special", label: "⇧ Shift", id: "lshift", flex: true, align: "left" },
    { type: "letter", label: "Y", id: "y" },
    { type: "letter", label: "X", id: "x" },
    { type: "letter", label: "C", id: "c" },
    { type: "letter", label: "V", id: "v" },
    { type: "letter", label: "B", id: "b" },
    { type: "letter", label: "N", id: "n" },
    { type: "letter", label: "M", id: "m" },
    { type: "dual", main: ",", shift: "?", id: "comma" },
    { type: "dual", main: ".", shift: ":", id: "period" },
    { type: "dual", main: "-", shift: "_", id: "minus" },
    { type: "special", label: "Shift ⇧", id: "rshift", flex: true, align: "right" },
  ],
  // Row 4 — Modifiers
  [
    { type: "special", label: "", id: "fn" },
    { type: "special", label: "", id: "lctrl" },
    { type: "special", label: "", id: "lalt" },
    { type: "special", label: "", id: "lcmd" },
    { type: "special", label: "", id: "space", flex: true },
    { type: "special", label: "", id: "rcmd" },
    { type: "special", label: "", id: "ralt" },
    { type: "special", label: "", id: "rctrl" },
  ],
];

// --- Character → key mapping ---
export type CharMapping = { keyId: string; needsShift: boolean };

export function buildCharMap(): Map<string, CharMapping> {
  const map = new Map<string, CharMapping>();

  for (const row of ROWS) {
    for (const key of row) {
      if (key.type === "letter") {
        map.set(key.label.toLowerCase(), { keyId: key.id, needsShift: false });
        map.set(key.label, { keyId: key.id, needsShift: true });
      } else if (key.type === "dual") {
        map.set(key.main, { keyId: key.id, needsShift: false });
        map.set(key.shift, { keyId: key.id, needsShift: true });
        const upper = key.main.toUpperCase();
        if (upper !== key.main && !map.has(upper)) {
          map.set(upper, { keyId: key.id, needsShift: true });
        }
      }
    }
  }

  map.set(" ", { keyId: "space", needsShift: false });
  map.set("\u00A0", { keyId: "space", needsShift: false });
  map.set("Enter", { keyId: "enter", needsShift: false });

  return map;
}

export const CHAR_TO_KEY = buildCharMap();

// Keys on the left side → use RIGHT shift
export const LEFT_KEYS = new Set([
  "semicolon", "1", "2", "3", "4", "5",
  "q", "w", "e", "r", "t",
  "a", "s", "d", "f", "g",
  "y", "x", "c", "v", "b",
]);

// ── Key position utilities (for RainingMode) ────────────────────────

// Keyboard total width: 728px, padding 6px each side, gap 6px between keys
const KEYBOARD_WIDTH = 728;
const PADDING = 6;
const GAP = 6;

/**
 * Compute the X center (in pixels, within 728px keyboard) of a given key ID.
 * Returns undefined if key not found.
 */
export function getKeyXCenter(keyId: string): number | undefined {
  for (const row of ROWS) {
    // Calculate sizes: flex keys share remaining space, fixed keys are 42px
    const fixedCount = row.filter(k => !(k.type === "special" && k.flex)).length;
    const flexCount = row.filter(k => k.type === "special" && k.flex).length;
    const totalGaps = (row.length - 1) * GAP;
    const fixedWidth = fixedCount * 42;
    const flexWidth = flexCount > 0
      ? (KEYBOARD_WIDTH - 2 * PADDING - totalGaps - fixedWidth) / flexCount
      : 0;

    let x = PADDING;
    for (const key of row) {
      const w = (key.type === "special" && key.flex) ? flexWidth : 42;
      if (key.id === keyId) {
        return x + w / 2;
      }
      x += w + GAP;
    }
  }
  return undefined;
}

// Map each lowercase letter to the Czech finger name
export const FINGER_MAP: Record<string, string> = {
  // Left hand (pinky → index)
  a: "levým malíčkem",
  s: "levým prsteníčkem",
  d: "levým prostředníčkem",
  f: "levým ukazováčkem",
  g: "levým ukazováčkem",
  // Right hand (index → pinky)
  h: "pravým ukazováčkem",
  j: "pravým ukazováčkem",
  k: "pravým prostředníčkem",
  l: "pravým prsteníčkem",
  ů: "pravým malíčkem",
};

// Precomputed X centers for home row letter keys
export const HOME_ROW_POSITIONS: Record<string, number> = (() => {
  const positions: Record<string, number> = {};
  const homeRowLetters = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "uring"];
  const letterToChar: Record<string, string> = {
    a: "a", s: "s", d: "d", f: "f", g: "g",
    h: "h", j: "j", k: "k", l: "l", uring: "ů",
  };
  for (const id of homeRowLetters) {
    const x = getKeyXCenter(id);
    if (x !== undefined) {
      positions[letterToChar[id]] = x;
    }
  }
  return positions;
})();
