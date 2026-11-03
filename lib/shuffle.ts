/**
 * Shuffle text fragments. Easy to generate; recovering original order
 * requires trying k! permutations (or solving TSP) — not a simple replace.
 */

import { splitGraphemes, type RandomSource } from "./text";

export type ShuffleStrategy = "word" | "sentence" | "char-block";

/** Default block size for the char-block strategy. */
export const DEFAULT_BLOCK_SIZE = 3;

/** A piece of the text, and whether the shuffle may move it. */
type Token = { text: string; movable: boolean };

/** Words move; the whitespace between them stays where it was. */
function wordTokens(text: string): Token[] {
  return text
    .split(/(\s+)/)
    .filter(Boolean)
    .map((t) => ({ text: t, movable: /\S/.test(t) }));
}

/** Marks that end a sentence (a line break also ends one). */
const SENTENCE_END = ".!?。！？";

/** A sentence with its end marks, a run of end marks on their own, or line breaks. */
const SENTENCE_CHUNK = new RegExp(
  `[^${SENTENCE_END}\\n]+[${SENTENCE_END}]*|[${SENTENCE_END}]+|\\n+`,
  "g"
);

/**
 * Sentences move together with their end marks (SENTENCE_END); a line break
 * always ends a sentence. Spaces and line breaks between sentences stay
 * where they were.
 */
function sentenceTokens(text: string): Token[] {
  const tokens: Token[] = [];
  for (const [chunk] of text.matchAll(SENTENCE_CHUNK)) {
    const lead = chunk.match(/^\s*/)![0];
    const body = chunk.slice(lead.length).trimEnd();
    const trail = chunk.slice(lead.length + body.length);
    if (lead) tokens.push({ text: lead, movable: false });
    if (body) tokens.push({ text: body, movable: true });
    if (trail) tokens.push({ text: trail, movable: false });
  }
  return tokens;
}

/** Fixed-size blocks of whole characters (an emoji counts as one). */
function charBlockTokens(text: string, blockSize: number): Token[] {
  const chars = splitGraphemes(text);
  const tokens: Token[] = [];
  for (let i = 0; i < chars.length; i += blockSize) {
    tokens.push({ text: chars.slice(i, i + blockSize).join(""), movable: true });
  }
  return tokens;
}

/** Fisher–Yates shuffle, in place. */
function shuffleInPlace<T>(items: T[], random: RandomSource): void {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

/** Shuffles the movable tokens among the movable slots; fixed tokens stay put. */
function shuffleTokens(tokens: Token[], random: RandomSource): string {
  const pieces = tokens.filter((t) => t.movable).map((t) => t.text);
  const original = [...pieces];
  shuffleInPlace(pieces, random);
  // A shuffle can land on the original order (half the time with two pieces).
  // Rotating by one always changes the order, unless every piece is the same.
  if (pieces.every((p, i) => p === original[i])) pieces.push(pieces.shift()!);
  let next = 0;
  return tokens.map((t) => (t.movable ? pieces[next++] : t.text)).join("");
}

/**
 * Splits text by strategy, shuffles the segments, joins back.
 * Humans can still read the fragments; machines need k! or TSP to recover order.
 * When there are at least two different fragments, the result is never the
 * original order.
 */
export function shuffleFragments(
  text: string,
  strategy: ShuffleStrategy,
  charBlockSize: number = DEFAULT_BLOCK_SIZE,
  random: RandomSource = Math.random
): string {
  if (!text.trim()) return text;

  let tokens: Token[];
  switch (strategy) {
    case "word":
      tokens = wordTokens(text);
      break;
    case "sentence":
      tokens = sentenceTokens(text);
      break;
    case "char-block":
      tokens = charBlockTokens(text, Math.max(1, Math.floor(charBlockSize)));
      break;
    default:
      return text;
  }

  if (tokens.filter((t) => t.movable).length <= 1) return text;
  return shuffleTokens(tokens, random);
}
