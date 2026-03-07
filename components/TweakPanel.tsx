"use client";

import type { InjectionMode, CharType } from "@/lib/injector";

const MODE_OPTIONS: { value: InjectionMode; label: string }[] = [
  { value: "interval", label: "Full Interval" },
  { value: "random", label: "Random" },
  { value: "space-only", label: "Space Only" },
  { value: "url-breaker", label: "URL Breaker" },
];

const CHAR_OPTIONS: { value: CharType; label: string }[] = [
  { value: "\u200B", label: "Zero Width Space (U+200B)" },
  { value: "\u200C", label: "Zero Width Non-Joiner (U+200C)" },
  { value: "\u200D", label: "Zero Width Joiner (U+200D)" },
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
          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
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
          value={charType}
          onChange={(e) => onCharTypeChange(e.target.value as CharType)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
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
            className="w-full h-2 rounded-lg appearance-none bg-slate-200 accent-slate-600"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={density}
          />
        </div>
      )}
    </section>
  );
}
