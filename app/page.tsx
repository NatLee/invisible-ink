"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { Github } from "lucide-react";
import InputSection from "@/components/InputSection";
import TweakPanel from "@/components/TweakPanel";
import ResultSection from "@/components/ResultSection";
import ToolSelector, { type ToolId } from "@/components/ToolSelector";
import ShuffleOptions from "@/components/ShuffleOptions";
import HomoglyphOptions from "@/components/HomoglyphOptions";
import {
  injectZeroWidth,
  DEFAULT_CHAR_TYPE,
  DEFAULT_DENSITY,
  type InjectionMode,
  type CharType,
  type InspectorStyle,
} from "@/lib/injector";
import { shuffleFragments, DEFAULT_BLOCK_SIZE, type ShuffleStrategy } from "@/lib/shuffle";
import { applyHomoglyph, type HomoglyphStrength } from "@/lib/homoglyph";
import { encodeForDisplay, seededRandom } from "@/lib/text";

/** What the source box shows on first load (Reset clears it). */
const SAMPLE_TEXT = "https://natlee.github.io/invisible-ink/";

/** Starting value of every option; Reset puts them all back. */
const DEFAULTS: {
  mode: InjectionMode;
  charType: CharType;
  density: number;
  inspectorEnabled: boolean;
  inspectorStyle: InspectorStyle;
  shuffleStrategy: ShuffleStrategy;
  charBlockSize: number;
  homoglyphStrength: HomoglyphStrength;
} = {
  mode: "interval",
  charType: DEFAULT_CHAR_TYPE,
  density: DEFAULT_DENSITY,
  inspectorEnabled: false,
  inspectorStyle: "tag",
  shuffleStrategy: "word",
  charBlockSize: DEFAULT_BLOCK_SIZE,
  homoglyphStrength: "medium",
};

/**
 * One random seed per visit, shared by the tools that use randomness. The
 * static prerender has no visit yet and uses 0; in the browser React switches
 * to the real seed right after hydration. useSyncExternalStore is React's API
 * for a value that differs between server and browser, so the first client
 * render still matches the prerendered HTML.
 */
let visitSeed: number | undefined;
const noSubscription = () => () => {};
const readVisitSeed = () => (visitSeed ??= Math.floor(Math.random() * 2 ** 32));
const readServerSeed = () => 0;

function useVisitSeed(): number {
  return useSyncExternalStore(noSubscription, readVisitSeed, readServerSeed);
}

export default function Home() {
  const [tool, setTool] = useState<ToolId>("zero-width");
  const [source, setSource] = useState(SAMPLE_TEXT);
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [charType, setCharType] = useState(DEFAULTS.charType);
  const [density, setDensity] = useState(DEFAULTS.density);
  const [inspectorEnabled, setInspectorEnabled] = useState(DEFAULTS.inspectorEnabled);
  const [inspectorStyle, setInspectorStyle] = useState(DEFAULTS.inspectorStyle);

  const [shuffleStrategy, setShuffleStrategy] = useState(DEFAULTS.shuffleStrategy);
  const [charBlockSize, setCharBlockSize] = useState(DEFAULTS.charBlockSize);
  const [homoglyphStrength, setHomoglyphStrength] = useState(DEFAULTS.homoglyphStrength);

  // Every result is a pure function of what is on screen plus the visit seed,
  // so rendering the same state always gives the same text.
  const seed = useVisitSeed();
  const zeroWidthResult = useMemo(
    () => injectZeroWidth(source, mode, charType, density, seededRandom(seed)),
    [source, mode, charType, density, seed]
  );
  const shuffleResult = useMemo(
    () => (source.trim() ? shuffleFragments(source, shuffleStrategy, charBlockSize, seededRandom(seed)) : ""),
    [source, shuffleStrategy, charBlockSize, seed]
  );
  const homoglyphResult = useMemo(
    () => (source.trim() ? applyHomoglyph(source, homoglyphStrength, seededRandom(seed)) : ""),
    [source, homoglyphStrength, seed]
  );

  const results: Record<ToolId, string> = {
    "zero-width": zeroWidthResult,
    shuffle: shuffleResult,
    homoglyph: homoglyphResult,
  };
  const result = results[tool];

  const handleReset = () => {
    setSource("");
    setMode(DEFAULTS.mode);
    setCharType(DEFAULTS.charType);
    setDensity(DEFAULTS.density);
    setInspectorEnabled(DEFAULTS.inspectorEnabled);
    setInspectorStyle(DEFAULTS.inspectorStyle);
    setShuffleStrategy(DEFAULTS.shuffleStrategy);
    setCharBlockSize(DEFAULTS.charBlockSize);
    setHomoglyphStrength(DEFAULTS.homoglyphStrength);
  };

  const originalLength = source.length;
  const resultLength = result.length;
  const originalEncoded = source ? encodeForDisplay(source) : "";
  const resultEncoded = result ? encodeForDisplay(result) : "";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight sm:tracking-wide">
          Invisible Ink
        </h1>
        <a
          href="https://github.com/NatLee/invisible-ink"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 transition-colors rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          aria-label="GitHub 儲存庫"
        >
          <Github className="w-5 h-5" aria-hidden />
        </a>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-6 space-y-5">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">
            工具箱
          </span>
          <ToolSelector value={tool} onChange={setTool} />
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
          role="tabpanel"
          id={`panel-${tool}`}
          aria-labelledby={`tab-${tool}`}
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
