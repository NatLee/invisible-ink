"use client";

import CopyButton from "./CopyButton";
import { renderInvisibleForInspector, type InspectorStyle } from "@/lib/injector";

export default function ResultSection({
  result,
  inspectorEnabled,
  inspectorStyle,
  onInspectorToggle,
  onInspectorStyleChange,
  onReset,
}: {
  result: string;
  inspectorEnabled: boolean;
  inspectorStyle: InspectorStyle;
  onInspectorToggle: () => void;
  onInspectorStyleChange: (style: InspectorStyle) => void;
  onReset: () => void;
}) {
  const displayText = renderInvisibleForInspector(
    result,
    inspectorEnabled,
    inspectorStyle
  );

  const isBlockStyle = inspectorEnabled && inspectorStyle === "block";
  const blockParts = isBlockStyle ? displayText.split("▯") : [];

  return (
    <section aria-labelledby="result-label">
      <div className="flex items-center justify-between gap-2 mb-1">
        <label id="result-label" className="text-sm font-medium text-slate-700">
          輸出區 (Result)
        </label>
        <div className="flex items-center gap-2">
          <CopyButton text={result} disabled={!result} />
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="重置"
          >
            重置
          </button>
        </div>
      </div>
      {isBlockStyle ? (
        <div
          className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm whitespace-pre-wrap break-words"
          aria-label="處理後的結果（隱形字元以紅色方塊顯示）"
        >
          {blockParts.map((part, i) => (
            <span key={i}>
              {part}
              {i < blockParts.length - 1 && (
                <span className="bg-red-400 text-red-900 rounded px-0.5" aria-hidden>▯</span>
              )}
            </span>
          ))}
        </div>
      ) : (
        <textarea
          readOnly
          value={displayText}
          aria-label="處理後的結果"
          className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-mono text-sm"
          rows={5}
        />
      )}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="inspector-toggle"
            checked={inspectorEnabled}
            onChange={onInspectorToggle}
            className="rounded border-slate-300 text-slate-600 focus:ring-slate-400"
            aria-describedby="inspector-desc"
          />
          <label htmlFor="inspector-toggle" id="inspector-desc" className="text-sm text-slate-600">
            顯示隱形字元 (Debug 模式)
          </label>
        </div>
        {inspectorEnabled && (
          <div className="flex items-center gap-2">
            <label htmlFor="inspector-style" className="text-sm text-slate-600">
              顯示為
            </label>
            <select
              id="inspector-style"
              value={inspectorStyle}
              onChange={(e) => onInspectorStyleChange(e.target.value as InspectorStyle)}
              className="text-sm rounded border border-slate-300 bg-white px-2 py-1"
              aria-label="透視顯示樣式"
            >
              <option value="tag">編碼標記 (&lt;200B&gt;)</option>
              <option value="block">紅色方塊</option>
            </select>
          </div>
        )}
      </div>
    </section>
  );
}
