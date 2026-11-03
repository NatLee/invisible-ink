import { describe, expect, it } from "vitest";
import { shuffleFragments, type ShuffleStrategy } from "./shuffle";
import { seeded } from "./test-utils";

const STRATEGIES: ShuffleStrategy[] = ["word", "sentence", "char-block"];
const sortedChars = (s: string) => Array.from(s).sort().join("");

describe("shuffleFragments", () => {
  it("returns blank input unchanged", () => {
    for (const strategy of STRATEGIES) {
      expect(shuffleFragments("", strategy)).toBe("");
      expect(shuffleFragments("   ", strategy)).toBe("   ");
    }
  });

  it("returns a single fragment unchanged", () => {
    expect(shuffleFragments("hello", "word")).toBe("hello");
    expect(shuffleFragments("abc", "char-block", 3)).toBe("abc");
  });

  it("only reorders: the output uses exactly the same characters", () => {
    const text = "The quick brown fox. Jumps over! The lazy dog?";
    for (const strategy of STRATEGIES)
      for (let i = 0; i < 50; i++)
        expect(sortedChars(shuffleFragments(text, strategy, 3))).toBe(sortedChars(text));
  });

  it("keeps fixed-size blocks intact", () => {
    for (let i = 0; i < 50; i++) {
      const out = shuffleFragments("aaabbbccc", "char-block", 3);
      expect(out.match(/.{3}/g)!.sort()).toEqual(["aaa", "bbb", "ccc"]);
    }
  });
});

const wellFormed = (s: string) =>
  !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(s);

describe("shuffleFragments by word", () => {
  const text = "alpha beta  gamma\tdelta\nepsilon";

  it("moves words but leaves every space, tab and line break where it was", () => {
    for (let i = 0; i < 200; i++) {
      const out = shuffleFragments(text, "word");
      expect(out.replace(/\S+/g, "_")).toBe(text.replace(/\S+/g, "_"));
      expect(out.split(/\s+/).sort()).toEqual(text.split(/\s+/).sort());
    }
  });

  it("never glues two words together", () => {
    for (let i = 0; i < 200; i++)
      expect(shuffleFragments("alpha beta gamma delta", "word").split(" ")).toHaveLength(4);
  });
});

describe("shuffleFragments by sentence", () => {
  it("keeps each sentence together with its punctuation", () => {
    const sentences = ["One.", "Two!", "Three?", "\u56DB\u3002"];
    for (let i = 0; i < 200; i++) {
      const out = shuffleFragments(sentences.join(" "), "sentence");
      expect(out.split(" ").sort()).toEqual([...sentences].sort());
    }
  });

  it("treats each line as a sentence and keeps the line breaks", () => {
    for (let i = 0; i < 100; i++) {
      const out = shuffleFragments("first line\nsecond line.\nthird", "sentence");
      expect(out.split("\n").sort()).toEqual(["first line", "second line.", "third"]);
    }
  });
});

describe("shuffleFragments by character block", () => {
  it("never cuts an emoji in half", () => {
    const text = "ab\u{1F600}cd\u{1F600}ef\u{1F1F9}\u{1F1FC}gh";
    for (let i = 0; i < 300; i++) {
      const out = shuffleFragments(text, "char-block", 3);
      expect(wellFormed(out)).toBe(true);
      expect(() => encodeURIComponent(out)).not.toThrow();
    }
  });

  it("counts an emoji as one character when sizing blocks", () => {
    const out = shuffleFragments("\u{1F600}\u{1F600}x", "char-block", 2, seeded(3));
    expect(out).toBe("x\u{1F600}\u{1F600}");
  });
});

describe("shuffleFragments order", () => {
  it("never gives back the original order when another order exists", () => {
    const twoPieces: Record<ShuffleStrategy, string> = {
      word: "hello world",
      sentence: "Hi. Bye.",
      "char-block": "abcdef",
    };
    for (const strategy of STRATEGIES)
      for (let i = 0; i < 200; i++)
        expect(shuffleFragments(twoPieces[strategy], strategy, 3)).not.toBe(twoPieces[strategy]);
  });

  it("returns the text unchanged when every fragment is the same", () => {
    expect(shuffleFragments("ha ha ha", "word")).toBe("ha ha ha");
  });

  it("is repeatable with the same random source", () => {
    const text = "one two three four five";
    expect(shuffleFragments(text, "word", 3, seeded(7))).toBe(shuffleFragments(text, "word", 3, seeded(7)));
  });
});
