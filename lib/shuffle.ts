/**
 * Shuffle text fragments. Easy to generate; recovering original order
 * requires trying k! permutations (or solving TSP) — not a simple replace.
 */

export type ShuffleStrategy = "word" | "sentence" | "char-block";

function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter(Boolean);
}

function splitSentences(text: string): string[] {
  return text.split(/([.!?。！？\n]+)/).filter(Boolean);
}

function splitCharBlocks(text: string, blockSize: number): string[] {
  const blocks: string[] = [];
  for (let i = 0; i < text.length; i += blockSize) {
    blocks.push(text.slice(i, i + blockSize));
  }
  return blocks;
}

/** Fisher–Yates shuffle (in-place), returns new array. */
function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Splits text by strategy, shuffles the segments, joins back.
 * Humans can still read the fragments; machines need k! or TSP to recover order.
 */
export function shuffleFragments(
  text: string,
  strategy: ShuffleStrategy,
  charBlockSize: number = 3
): string {
  if (!text.trim()) return text;

  let parts: string[];
  switch (strategy) {
    case "word":
      parts = splitWords(text);
      break;
    case "sentence":
      parts = splitSentences(text);
      break;
    case "char-block":
      parts = splitCharBlocks(text, Math.max(1, charBlockSize));
      break;
    default:
      return text;
  }

  if (parts.length <= 1) return text;
  return shuffleArray(parts).join("");
}
