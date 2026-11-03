"use client";

import CopyButton from "./CopyButton";
import {
  renderInvisibleAsTags,
  splitInvisible,
  codePointHex,
  INVISIBLE_CHARS,
  type InspectorStyle,
  type CharType,
  type InvisibleChar,
} from "@/lib/injector";

/** How each invisible character is drawn in the block view when Mix is on. */
const MIX_BLOCKS: Record<InvisibleChar, { symbol: string; className: string }> = {
  "\u200B": { symbol: "\u25A0", className: "bg-red-400 text-red-900" },
  "\u200C": { symbol: "\u25A1", className: "bg-blue-400 text-blue-900" },
  "\u200D": { symbol: "\u25AA", className: "bg-emerald-500 text-emerald-900" },
};

const codeLabel = (char: string) => `U+${codePointHex(char)}`;

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
  const inspecting = showInspector && inspectorEnabled;
  const isBlockStyle = inspecting && inspectorStyle === "block";
  const distinguishMix = isBlockStyle && charType === "mix";
  const displayText = inspecting ? renderInvisibleAsTags(result) : result;

  const renderBlockContent = () =>
    splitInvisible(result).map((part, i) => {
      if (part.kind === "text") return <span key={i}>{part.text}</span>;
      const block = MIX_BLOCKS[part.char];
      return distinguishMix ? (
        <span key={i} className={`${block.className} rounded px-0.5`} title={codeLabel(part.char)} aria-hidden>
          {block.symbol}
        </span>
      ) : (
        <span key={i} className="bg-red-400 text-red-900 rounded px-0.5" title={codeLabel(part.char)} aria-hidden>
          {"\u25AF"}
        </span>
      );
    });

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
          {distinguishMix && (
            <ul className="flex items-center gap-3 text-xs text-slate-500 font-mono" aria-label="方塊顏色說明">
              {INVISIBLE_CHARS.map(({ char }) => (
                <li key={char} className="inline-flex items-center gap-1">
                  <span className={`${MIX_BLOCKS[char].className} rounded px-0.5`} aria-hidden>
                    {MIX_BLOCKS[char].symbol}
                  </span>
                  {codeLabel(char)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
