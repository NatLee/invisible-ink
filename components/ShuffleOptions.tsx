"use client";

import type { ShuffleStrategy } from "@/lib/shuffle";
import { stripInput } from "./styles";

const STRATEGIES: { value: ShuffleStrategy; label: string }[] = [
  { value: "word", label: "依單字" },
  { value: "sentence", label: "依句子" },
  { value: "char-block", label: "固定字元區塊" },
];

export default function ShuffleOptions({
  strategy,
  charBlockSize,
  onStrategyChange,
  onCharBlockSizeChange,
}: {
  strategy: ShuffleStrategy;
  charBlockSize: number;
  onStrategyChange: (s: ShuffleStrategy) => void;
  onCharBlockSizeChange: (n: number) => void;
}) {
  const showBlockSize = strategy === "char-block";

  return (
    <section
      aria-labelledby="shuffle-options-label"
      className="flex flex-wrap items-end gap-4"
    >
      <h2 id="shuffle-options-label" className="sr-only">
        片段打亂設定
      </h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="shuffle-strategy" className="text-xs font-medium text-slate-300">
          切分方式
        </label>
        <select
          id="shuffle-strategy"
          value={strategy}
          onChange={(e) => onStrategyChange(e.target.value as ShuffleStrategy)}
          className={`min-w-[160px] ${stripInput}`}
        >
          {STRATEGIES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {showBlockSize && (
        <div className="flex flex-col gap-1">
          <label htmlFor="char-block-size" className="text-xs font-medium text-slate-300">
            區塊大小: {charBlockSize}
          </label>
          <input
            id="char-block-size"
            type="range"
            min={2}
            max={8}
            value={charBlockSize}
            onChange={(e) => onCharBlockSizeChange(Number(e.target.value))}
            className="w-32 h-2 rounded-lg appearance-none bg-slate-600 accent-violet-400"
            aria-valuemin={2}
            aria-valuemax={8}
            aria-valuenow={charBlockSize}
          />
        </div>
      )}
    </section>
  );
}
