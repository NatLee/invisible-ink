import { splitGraphemes, type RandomSource } from "./text";

export type InjectionMode =
  | "interval"
  | "random"
  | "space-only"
  | "url-breaker";

export type InvisibleChar = "\u200B" | "\u200C" | "\u200D";

export type CharType = InvisibleChar | "mix";

export const INVISIBLE_CHARS: readonly InvisibleChar[] = ["\u200B", "\u200C", "\u200D"];

/**
 * The invisible character to insert. Mix rotates U+200B → U+200C → U+200D by
 * `index`, or picks one at random when there is no index (Random mode).
 */
function pickChar(charType: CharType, index: number | undefined, random: RandomSource): string {
  if (charType !== "mix") return charType;
  const i = index ?? Math.floor(random() * INVISIBLE_CHARS.length);
  return INVISIBLE_CHARS[i % INVISIBLE_CHARS.length];
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
  charType: CharType = "\u200B",
  density: number = 50,
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

const ZWSP = "\u200B";
const ZWNJ = "\u200C";
const ZWJ = "\u200D";

/**
 * Debug view, tag style: shows each invisible character as its code, e.g.
 * <200B>. (The block style is drawn by the component from splitInvisible.)
 */
export function renderInvisibleAsTags(text: string): string {
  return text
    .replace(new RegExp(ZWSP, "g"), "<200B>")
    .replace(new RegExp(ZWNJ, "g"), "<200C>")
    .replace(new RegExp(ZWJ, "g"), "<200D>");
}

/** A run of ordinary text, or one invisible character (for the block view). */
export type InspectorPart =
  | { kind: "text"; text: string }
  | { kind: "invisible"; char: InvisibleChar };

const isInvisibleChar = (s: string): s is InvisibleChar =>
  (INVISIBLE_CHARS as readonly string[]).includes(s);

/**
 * Splits text into ordinary runs and the invisible characters between them,
 * so the inspector can draw each invisible character as a coloured block
 * without touching the visible text (an emoji or a literal ▯ stays as is).
 */
export function splitInvisible(text: string): InspectorPart[] {
  return text
    .split(/([\u200B\u200C\u200D])/)
    .filter(Boolean)
    .map((piece) =>
      isInvisibleChar(piece) ? { kind: "invisible", char: piece } : { kind: "text", text: piece }
    );
}
