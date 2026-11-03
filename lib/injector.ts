import { splitGraphemes, type RandomSource } from "./text";

export type InjectionMode =
  | "interval"
  | "random"
  | "space-only"
  | "url-breaker";

/**
 * The invisible characters the tool can insert, in Mix rotation order.
 * Everything else (the type, the Debug tags and blocks, the options in the
 * UI) is derived from this list, so adding one means adding one line here.
 */
export const INVISIBLE_CHARS = [
  { char: "\u200B", name: "Zero Width Space" },
  { char: "\u200C", name: "Zero Width Non-Joiner" },
  { char: "\u200D", name: "Zero Width Joiner" },
] as const;

export type InvisibleChar = (typeof INVISIBLE_CHARS)[number]["char"];

export type CharType = InvisibleChar | "mix";

/** The default character: the first one, U+200B zero width space. */
export const DEFAULT_CHAR_TYPE: CharType = INVISIBLE_CHARS[0].char;

/** Default chance (in %) that Random mode fills a gap. */
export const DEFAULT_DENSITY = 50;

/** Hex code point as shown in the UI, e.g. "200B" for U+200B. */
export function codePointHex(char: string): string {
  return char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0");
}

const INVISIBLE_CLASS = `[${INVISIBLE_CHARS.map((c) => c.char).join("")}]`;

const isInvisibleChar = (s: string): s is InvisibleChar => INVISIBLE_CHARS.some((c) => c.char === s);

/**
 * The invisible character to insert. Mix rotates through INVISIBLE_CHARS by
 * `index`, or picks one at random when there is no index (Random mode).
 */
function pickChar(charType: CharType, index: number | undefined, random: RandomSource): string {
  if (charType !== "mix") return charType;
  const i = index ?? Math.floor(random() * INVISIBLE_CHARS.length);
  return INVISIBLE_CHARS[i % INVISIBLE_CHARS.length].char;
}

/** Inserts an invisible character after every match of `pattern`. */
function insertAfter(text: string, pattern: RegExp, charType: CharType, random: RandomSource): string {
  let count = 0;
  return text.replace(pattern, (match) => match + pickChar(charType, count++, random));
}

/**
 * Injects zero-width characters into text according to mode.
 *
 * - `interval`: one between every pair of characters.
 * - `random`: each gap between characters gets one with probability `density`%
 *   (so 100 is the same as `interval`, 0 changes nothing).
 * - `space-only`: one after every whitespace character.
 * - `url-breaker`: one after every `:`, `.` and `/`.
 *
 * "Character" means what a reader sees as one character (a grapheme cluster),
 * so emoji, flags and accented letters are never split.
 */
export function injectZeroWidth(
  text: string,
  mode: InjectionMode,
  charType: CharType = DEFAULT_CHAR_TYPE,
  density: number = DEFAULT_DENSITY,
  random: RandomSource = Math.random
): string {
  if (!text) return text;

  switch (mode) {
    case "interval":
    case "random": {
      const chars = splitGraphemes(text);
      let out = chars[0];
      for (let i = 1; i < chars.length; i++) {
        if (mode === "interval") out += pickChar(charType, i - 1, random);
        else if (random() * 100 < density) out += pickChar(charType, undefined, random);
        out += chars[i];
      }
      return out;
    }
    case "space-only":
      return insertAfter(text, /\s/g, charType, random);
    case "url-breaker":
      return insertAfter(text, /[:./]/g, charType, random);
    default:
      return text;
  }
}

export type InspectorStyle = "tag" | "block";

/**
 * Debug view, tag style: shows each invisible character as its code, e.g.
 * <200B>. (The block style is drawn by the component from splitInvisible.)
 */
export function renderInvisibleAsTags(text: string): string {
  return text.replace(new RegExp(INVISIBLE_CLASS, "g"), (c) => `<${codePointHex(c)}>`);
}

/** A run of ordinary text, or one invisible character (for the block view). */
export type InspectorPart =
  | { kind: "text"; text: string }
  | { kind: "invisible"; char: InvisibleChar };

/**
 * Splits text into ordinary runs and the invisible characters between them,
 * so the inspector can draw each invisible character as a coloured block
 * without touching the visible text (an emoji or a literal ▯ stays as is).
 */
export function splitInvisible(text: string): InspectorPart[] {
  return text
    .split(new RegExp(`(${INVISIBLE_CLASS})`))
    .filter(Boolean)
    .map((piece) =>
      isInvisibleChar(piece) ? { kind: "invisible", char: piece } : { kind: "text", text: piece }
    );
}
