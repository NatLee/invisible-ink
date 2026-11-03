/**
 * Small text helpers shared by the tools.
 *
 * JavaScript strings are UTF-16, so `"😀".split("")` gives two broken halves
 * (a "lone surrogate" each). Anything that inserts or moves text has to work
 * on whole characters instead, or emoji, flags and accented letters fall apart.
 */

/** Returns a number in [0, 1), like `Math.random`. */
export type RandomSource = () => number;

/**
 * A repeatable random source (mulberry32): the same seed always gives the
 * same sequence. The page keeps one seed per visit, so the random tools give
 * different results on every visit but a stable result for whatever is on
 * screen; tests use fixed seeds.
 */
export function seededRandom(seed: number): RandomSource {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const segmenter =
  typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

/**
 * Splits text into user-perceived characters (grapheme clusters): an emoji
 * with a skin tone, a flag, a ZWJ family or `e` + combining accent each stay
 * one piece.
 *
 * Compatibility fallback (the only one in the app): without `Intl.Segmenter`
 * this splits by code point, which still never cuts an emoji in half but does
 * separate combining accents. It is here because Next.js 14 targets browsers
 * back to Chrome 64, Firefox 67 and Safari 12, while `Intl.Segmenter` needs
 * Chrome/Edge 87, Firefox 125 or Safari 14.1. Once the supported browsers are
 * raised past those, drop `segmenter`'s null case and this branch.
 */
export function splitGraphemes(text: string): string[] {
  if (!segmenter) return Array.from(text);
  return Array.from(segmenter.segment(text), (s) => s.segment);
}

const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;

/**
 * `encodeURIComponent` that never throws. The built-in one throws a URIError
 * on a lone surrogate; here those become U+FFFD (the replacement character).
 */
export function encodeForDisplay(text: string): string {
  try {
    return encodeURIComponent(text);
  } catch {
    return encodeURIComponent(text.replace(LONE_SURROGATE, "\uFFFD"));
  }
}
