export type InjectionMode =
  | "interval"
  | "random"
  | "space-only"
  | "url-breaker";

export type InvisibleChar = "\u200B" | "\u200C" | "\u200D";

export type CharType = InvisibleChar | "mix";

const INVISIBLE_CHARS: InvisibleChar[] = ["\u200B", "\u200C", "\u200D"];

function getCharForMode(charType: CharType, index?: number): string {
  if (charType === "mix") {
    const idx =
      index !== undefined ? index : Math.floor(Math.random() * INVISIBLE_CHARS.length);
    return INVISIBLE_CHARS[idx % INVISIBLE_CHARS.length];
  }
  return charType;
}

/**
 * Injects zero-width (or other invisible) characters into text according to mode.
 */
export function injectZeroWidth(
  text: string,
  mode: InjectionMode,
  charType: CharType = "\u200B",
  density: number = 50
): string {
  if (!text) return text;

  const chars = text.split("");

  if (mode === "interval") {
    return chars
      .map((c, i) => (i < chars.length - 1 ? c + getCharForMode(charType, i) : c))
      .join("");
  }

  if (mode === "random") {
    return chars
      .map((c) => {
        return Math.random() * 100 < density
          ? c + getCharForMode(charType)
          : c;
      })
      .join("");
  }

  if (mode === "space-only") {
    let insertIndex = 0;
    return text.replace(/\s/g, (match) => {
      const invisible = getCharForMode(charType, insertIndex++);
      return match + invisible;
    });
  }

  if (mode === "url-breaker") {
    let insertIndex = 0;
    return text.replace(/([:./])/g, (match) => {
      const invisible = getCharForMode(charType, insertIndex++);
      return match + invisible;
    });
  }

  return text;
}

export type InspectorStyle = "tag" | "block";

const ZWSP = "\u200B";
const ZWNJ = "\u200C";
const ZWJ = "\u200D";

/** Placeholders for block style when distinguishing Mix (U+200B, U+200C, U+200D). */
export const BLOCK_ZWSP = "\u25A0";
export const BLOCK_ZWNJ = "\u25A1";
export const BLOCK_ZWJ = "\u25AA";

/**
 * Renders invisible characters visibly for inspector/debug mode.
 * - tag: replace with <200B>, <200C>, <200D>
 * - block: replace with a visible block; if distinguishMix, use ■ □ ▪ for the three types.
 */
export function renderInvisibleForInspector(
  text: string,
  enabled: boolean,
  style: InspectorStyle = "tag",
  distinguishMix: boolean = false
): string {
  if (!enabled) return text;
  if (style === "block") {
    if (distinguishMix) {
      return text
        .replace(new RegExp(ZWSP, "g"), BLOCK_ZWSP)
        .replace(new RegExp(ZWNJ, "g"), BLOCK_ZWNJ)
        .replace(new RegExp(ZWJ, "g"), BLOCK_ZWJ);
    }
    return text
      .replace(new RegExp(ZWSP, "g"), "▯")
      .replace(new RegExp(ZWNJ, "g"), "▯")
      .replace(new RegExp(ZWJ, "g"), "▯");
  }
  return text
    .replace(new RegExp(ZWSP, "g"), "<200B>")
    .replace(new RegExp(ZWNJ, "g"), "<200C>")
    .replace(new RegExp(ZWJ, "g"), "<200D>");
}
