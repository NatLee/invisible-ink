"use client";

import CopyButton from "./CopyButton";
import {
  renderInvisibleForInspector,
  BLOCK_ZWSP,
  BLOCK_ZWNJ,
  BLOCK_ZWJ,
  type InspectorStyle,
  type CharType,
} from "@/lib/injector";

export default function ResultSection({
  result,
  charType,
  inspectorEnabled,
  inspectorStyle,
  onInspectorToggle,
  onInspectorStyleChange,
  onReset,
  showInspector = true,
}: {
  result: string;
  charType: CharType;
  inspectorEnabled: boolean;
  inspectorStyle: InspectorStyle;
  onInspectorToggle: () => void;
  onInspectorStyleChange: (style: InspectorStyle) => void;
  onReset: () => void;
  showInspector?: boolean;
}) {
  const displayText = showInspector
    ? renderInvisibleForInspector(
    result,
    inspectorEnabled,
    inspectorStyle,
    charType === "mix"
  )
    : result;

  const isBlockStyle = showInspector && inspectorEnabled && inspectorStyle === "block";
  const distinguishMix = isBlockStyle && charType === "mix";

  const renderBlockContent = () => {
    if (distinguishMix) {
      return (
        <>
          {displayText.split("").map((c, i) => {
            if (c === BLOCK_ZWSP)
              return (
                <span key={i} className="bg-red-400 text-red-900 rounded px-0.5" title="U+200B" aria-hidden>■</span>
              );
            if (c === BLOCK_ZWNJ)
              return (
                <span key={i} className="bg-blue-400 text-blue-900 rounded px-0.5" title="U+200C" aria-hidden>□</span>
              );
            if (c === BLOCK_ZWJ)
              return (
                <span key={i} className="bg-emerald-500 text-emerald-900 rounded px-0.5" title="U+200D" aria-hidden>▪</span>
              );
            return <span key={i}>{c}</span>;
          })}
        </>
      );
    }
    const blockParts = displayText.split("▯");
    return (
      <>
        {blockParts.map((part, i) => (
          <span key={i}>
            {part}
            {i < blockParts.length - 1 && (
              <span className="bg-red-400 text-red-900 rounded px-0.5" aria-hidden>▯</span>
            )}
          </span>
        ))}
      </>
    );
  };

  return (
    <section aria-labelledby="result-label">
      <div className="flex items-center justify-between gap-2 mb-2">
        <label id="result-label" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Result
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          <CopyButton text={result} disabled={!result} />
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:border-violet-300 transition-all duration-200"
            aria-label="重置"
          >
            重置
          </button>
        </div>
      </div>
      {isBlockStyle ? (
        <div
          role="region"
          className="w-full min-h-[160px] lg:min-h-[220px] rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 font-mono text-sm text-slate-900 whitespace-pre-wrap break-words"
          aria-label={distinguishMix ? "處理後的結果（隱形字元以三色方塊顯示）" : "處理後的結果（隱形字元以紅色方塊顯示）"}
        >
          {renderBlockContent()}
        </div>
      ) : (
        <textarea
          readOnly
          value={displayText}
          aria-label="處理後的結果"
          className="w-full min-h-[160px] lg:min-h-[220px] resize-none rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2 font-mono text-sm text-slate-900"
          rows={5}
        />
      )}
      {showInspector && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="inspector-toggle"
              checked={inspectorEnabled}
              onChange={onInspectorToggle}
              className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              aria-describedby="inspector-desc"
            />
            <span id="inspector-desc" className="text-sm text-slate-600">
              Debug
            </span>
          </label>
          {inspectorEnabled && (
            <div className="flex items-center gap-2">
              <label htmlFor="inspector-style" className="text-sm text-slate-500">
                顯示為
              </label>
              <select
                id="inspector-style"
                value={inspectorStyle}
                onChange={(e) => onInspectorStyleChange(e.target.value as InspectorStyle)}
                className="text-sm rounded-lg border border-slate-200 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                aria-label="透視顯示樣式"
              >
                <option value="tag">編碼標記</option>
                <option value="block">方塊</option>
              </select>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
