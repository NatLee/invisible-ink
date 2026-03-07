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
    <section aria-labelledby="tweak-label" className="space-y-4">
      <h2 id="tweak-label" className="text-sm font-medium text-slate-700">
        設定區 (Tweaks)
      </h2>

      <div>
        <label htmlFor="injection-mode" className="block text-sm text-slate-600 mb-1">
          注入模式
        </label>
        <select
          id="injection-mode"
          value={mode}
          onChange={(e) => onModeChange(e.target.value as InjectionMode)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300"
          aria-describedby={showDensity ? "density-desc" : undefined}
        >
          {MODE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="char-type" className="block text-sm text-slate-600 mb-1">
          隱形字元類型
        </label>
        <select
          id="char-type"
          value={charTypeToCode(charType)}
          onChange={(e) => onCharTypeChange(codeToCharType(e.target.value as CharTypeCode))}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300"
        >
          {CHAR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {showDensity && (
        <div id="density-desc">
          <label htmlFor="density" className="block text-sm text-slate-600 mb-1">
            密度: {density}%
          </label>
          <input
            id="density"
            type="range"
            min={0}
            max={100}
            value={density}
            onChange={(e) => onDensityChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none bg-slate-200 accent-indigo-600"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={density}
          />
        </div>
      )}
    </section>
  );
}
