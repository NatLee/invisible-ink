"use client";

import type { InjectionMode, CharType } from "@/lib/injector";

const CHAR_TYPE_CODES = ["200B", "200C", "200D", "mix"] as const;
type CharTypeCode = (typeof CHAR_TYPE_CODES)[number];

function charTypeToCode(c: CharType): CharTypeCode {
  if (c === "\u200B") return "200B";
  if (c === "\u200C") return "200C";
  if (c === "\u200D") return "200D";
  return "mix";
}

function codeToCharType(code: CharTypeCode): CharType {
  if (code === "200B") return "\u200B";
  if (code === "200C") return "\u200C";
  if (code === "200D") return "\u200D";
  return "mix";
}

const MODE_OPTIONS: { value: InjectionMode; label: string }[] = [
  { value: "interval", label: "Full Interval" },
  { value: "random", label: "Random" },
  { value: "space-only", label: "Space Only" },
  { value: "url-breaker", label: "URL Breaker" },
];

const CHAR_OPTIONS: { value: CharTypeCode; label: string }[] = [
  { value: "200B", label: "Zero Width Space (U+200B)" },
  { value: "200C", label: "Zero Width Non-Joiner (U+200C)" },
  { value: "200D", label: "Zero Width Joiner (U+200D)" },
  { value: "mix", label: "Mix" },
];

const stripInput =
  "px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/80 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200";

export default function TweakPanel({
  mode,
  charType,
  density,
  onModeChange,
  onCharTypeChange,
  onDensityChange,
}: {
  mode: InjectionMode;
  charType: CharType;
  density: number;
  onModeChange: (m: InjectionMode) => void;
  onCharTypeChange: (c: CharType) => void;
  onDensityChange: (d: number) => void;
}) {
  const showDensity = mode === "random";

  return (
    <section
      aria-labelledby="tweak-label"
      className="flex flex-wrap items-end gap-4"
    >
      <h2 id="tweak-label" className="sr-only">
        設定區 (Tweaks)
      </h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="injection-mode" className="text-xs font-medium text-slate-300">
          模式
        </label>
        <select
          id="injection-mode"
          value={mode}
          onChange={(e) => onModeChange(e.target.value as InjectionMode)}
          className={`min-w-[140px] ${stripInput}`}
          aria-describedby={showDensity ? "density-desc" : undefined}
        >
          {MODE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="char-type" className="text-xs font-medium text-slate-300">
          字元類型
        </label>
        <select
          id="char-type"
          value={charTypeToCode(charType)}
          onChange={(e) => onCharTypeChange(codeToCharType(e.target.value as CharTypeCode))}
          className={`min-w-[180px] ${stripInput}`}
        >
          {CHAR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {showDensity && (
        <div id="density-desc" className="flex flex-col gap-1 flex-1 min-w-[160px] max-w-[240px]">
          <label htmlFor="density" className="text-xs font-medium text-slate-300">
            密度: {density}%
          </label>
          <input
            id="density"
            type="range"
            min={0}
            max={100}
            value={density}
            onChange={(e) => onDensityChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none bg-slate-600 accent-violet-400"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={density}
          />
        </div>
      )}
    </section>
  );
}
