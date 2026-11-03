import { describe, expect, it } from "vitest";
import { encodeForDisplay, splitGraphemes } from "./text";

describe("splitGraphemes", () => {
  it("splits plain text into characters", () => {
    expect(splitGraphemes("")).toEqual([]);
    expect(splitGraphemes("ab 中")).toEqual(["a", "b", " ", "中"]);
  });

  it("keeps emoji, flags and combining accents in one piece", () => {
    expect(splitGraphemes("a\u{1F600}b")).toEqual(["a", "\u{1F600}", "b"]);
    expect(splitGraphemes("\u{1F1F9}\u{1F1FC}")).toHaveLength(1);
    expect(splitGraphemes("\u{1F468}\u200D\u{1F469}\u200D\u{1F467}")).toHaveLength(1);
    expect(splitGraphemes("e\u0301x")).toEqual(["e\u0301", "x"]);
  });
});

describe("encodeForDisplay", () => {
  it("matches encodeURIComponent for normal text", () => {
    for (const s of ["https://a.b/c?d=e", "\u4E2D\u6587", "a\u200Bb", "\u{1F600}"])
      expect(encodeForDisplay(s)).toBe(encodeURIComponent(s));
  });

  it("does not throw on a broken emoji half", () => {
    expect(() => encodeURIComponent("a\uD83D")).toThrow(URIError);
    expect(encodeForDisplay("a\uD83D")).toBe("a%EF%BF%BD");
    expect(encodeForDisplay("\uDE00b")).toBe("%EF%BF%BDb");
  });
});
