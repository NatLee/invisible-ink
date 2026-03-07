"use client";

import { useState, useMemo, useEffect } from "react";
import { Github } from "lucide-react";
import InputSection from "@/components/InputSection";
import TweakPanel from "@/components/TweakPanel";
import ResultSection from "@/components/ResultSection";
import ToolSelector, { type ToolId } from "@/components/ToolSelector";
import ShuffleOptions from "@/components/ShuffleOptions";
import HomoglyphOptions from "@/components/HomoglyphOptions";
import {
  injectZeroWidth,
  type InjectionMode,
  type CharType,
  type InspectorStyle,
} from "@/lib/injector";
import { shuffleFragments, type ShuffleStrategy } from "@/lib/shuffle";
import { applyHomoglyph, type HomoglyphStrength } from "@/lib/homoglyph";

const DEFAULT_MODE: InjectionMode = "interval";
const DEFAULT_CHAR: CharType = "\u200B";
const DEFAULT_DENSITY = 50;

export default function Home() {
  const [tool, setTool] = useState<ToolId>("zero-width");
  const [source, setSource] = useState("https://natlee.github.io/invisible-inkr/");
  const [mode, setMode] = useState<InjectionMode>(DEFAULT_MODE);
  const [charType, setCharType] = useState<CharType>(DEFAULT_CHAR);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const [inspectorStyle, setInspectorStyle] = useState<InspectorStyle>("tag");

  const [shuffleStrategy, setShuffleStrategy] = useState<ShuffleStrategy>("word");
  const [charBlockSize, setCharBlockSize] = useState(3);
  const [homoglyphStrength, setHomoglyphStrength] = useState<HomoglyphStrength>("medium");

  const zeroWidthResult = useMemo(
    () => injectZeroWidth(source, mode, charType, density),
    [source, mode, charType, density]
  );

  const [shuffleResult, setShuffleResult] = useState("");
  const [homoglyphResult, setHomoglyphResult] = useState("");
  useEffect(() => {
    if (!source.trim()) {
      setShuffleResult("");
      setHomoglyphResult("");
      return;
    }
    setShuffleResult(shuffleFragments(source, shuffleStrategy, charBlockSize));
    setHomoglyphResult(applyHomoglyph(source, homoglyphStrength));
  }, [source, shuffleStrategy, charBlockSize, homoglyphStrength]);

  const result =
    tool === "zero-width"
      ? zeroWidthResult
      : tool === "shuffle"
        ? shuffleResult
        : homoglyphResult;

  const handleReset = () => {
    setSource("");
    setMode(DEFAULT_MODE);
    setCharType(DEFAULT_CHAR);
    setDensity(DEFAULT_DENSITY);
    setInspectorEnabled(false);
    setInspectorStyle("tag");
    setShuffleStrategy("word");
    setCharBlockSize(3);
    setHomoglyphStrength("medium");
    setShuffleResult("");
    setHomoglyphResult("");
  };

  const originalLength = source.length;
  const resultLength = result.length;
  const originalEncoded = source ? encodeURIComponent(source) : "";
  const resultEncoded = result ? encodeURIComponent(result) : "";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight sm:tracking-wide">
          Invisible Ink
        </h1>
        <a
          href="https://github.com/NatLee/invisible-inkr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 transition-colors rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          aria-label="GitHub 儲存庫"
        >
          <Github className="w-5 h-5" aria-hidden />
        </a>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-6 space-y-5">
        <div
          role="tabpanel"
          id="panel-toolbox"
          aria-labelledby="tab-toolbox"
          className="space-y-4"
        >
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">
              工具箱
            </span>
            <ToolSelector value={tool} onChange={setTool} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-0">
          <div className="min-h-0 rounded-xl bg-white/90 backdrop-blur-md border border-white/20 shadow-card p-4 border-l-4 border-violet-500">
            <InputSection value={source} onChange={setSource} />
          </div>
          <div className="min-h-0 rounded-xl bg-white/90 backdrop-blur-md border border-white/20 shadow-card p-4 border-l-4 border-indigo-500">
            <ResultSection
              result={result}
              charType={charType}
              inspectorEnabled={inspectorEnabled}
              inspectorStyle={inspectorStyle}
              onInspectorToggle={() => setInspectorEnabled((v) => !v)}
              onInspectorStyleChange={setInspectorStyle}
              onReset={handleReset}
              showInspector={tool === "zero-width"}
            />
          </div>
        </div>

        <div
          className="rounded-xl bg-slate-800/90 text-slate-100 px-4 py-3 border border-slate-700/50"
          role="region"
          aria-label={tool === "zero-width" ? "注入設定" : tool === "shuffle" ? "打亂設定" : "同形字設定"}
        >
          {tool === "zero-width" && (
            <TweakPanel
              mode={mode}
              charType={charType}
              density={density}
              onModeChange={setMode}
              onCharTypeChange={setCharType}
              onDensityChange={setDensity}
            />
          )}
          {tool === "shuffle" && (
            <ShuffleOptions
              strategy={shuffleStrategy}
              charBlockSize={charBlockSize}
              onStrategyChange={setShuffleStrategy}
              onCharBlockSizeChange={setCharBlockSize}
            />
          )}
          {tool === "homoglyph" && (
            <HomoglyphOptions
              strength={homoglyphStrength}
              onStrengthChange={setHomoglyphStrength}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section
            aria-labelledby="comparison-heading"
            className="rounded-xl bg-white/90 backdrop-blur-md border border-white/20 shadow-card p-4"
          >
            <h2 id="comparison-heading" className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              長度對比
            </h2>
            <div className="flex flex-wrap gap-6 text-sm">
              <p>
                <span className="text-slate-500">原始：</span>
                <span className="font-mono font-medium">{originalLength}</span>
              </p>
              <p>
                <span className="text-slate-500">處理後：</span>
                <span className="font-mono font-medium">{resultLength}</span>
              </p>
            </div>
          </section>
          <section
            aria-labelledby="encode-heading"
            className="rounded-xl bg-white/90 backdrop-blur-md border border-white/20 shadow-card p-4"
          >
            <h2 id="encode-heading" className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              URI Encode 對照
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-500">Original: </span>
                <code className="break-all font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                  {originalEncoded || "(空)"}
                </code>
              </div>
              <div>
                <span className="text-slate-500">Obfuscated: </span>
                <code className="break-all font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                  {resultEncoded || "(空)"}
                </code>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
