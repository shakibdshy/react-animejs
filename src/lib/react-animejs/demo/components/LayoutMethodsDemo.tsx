import React, { useCallback, useRef, useState } from "react";
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from "../../components/AnimeLayout";
import { DemoCard } from "./DemoCard";
import { Play, RotateCcw, Zap } from "lucide-react";

export const LayoutMethodsDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [cols, setCols] = useState(2);
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  const useRecordAnimate = useCallback(() => {
    if (!layoutRef.current) return;
    layoutRef.current.record();
    const root = layoutRef.current.getElement();
    if (root) {
      const nextCols = cols === 2 ? 4 : cols === 4 ? 3 : 2;
      root.style.gridTemplateColumns = `repeat(${nextCols}, 1fr)`;
      setCols(nextCols);
    }
    layoutRef.current.animate({ duration: 500 });
    setLastMethod("record() → animate()");
  }, [cols]);

  const useUpdate = useCallback(() => {
    const nextCols = cols === 2 ? 4 : cols === 4 ? 3 : 2;
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        root.style.gridTemplateColumns = `repeat(${nextCols}, minmax(0, 1fr))`;
      },
      { duration: 700, ease: "outBack" },
    );
    setCols(nextCols);
    setLastMethod("update()");
  }, [cols]);

  const useRevert = useCallback(() => {
    layoutRef.current?.revert();
    setLastMethod("revert()");
    setCols(2);
  }, []);

  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <DemoCard
      title="layout methods"
      description="Directly control the layout engine. Using <AnimeLayout> component."
      actions={
        <div className="flex gap-2">
          <button
            onClick={useRecordAnimate}
            className="p-2 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-blue-400 rounded-lg transition-all"
            title="record() + animate()"
          >
            <Zap size={16} />
          </button>
          <button
            onClick={useUpdate}
            className="p-2 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-green-400 rounded-lg transition-all"
            title="update()"
          >
            <Play size={16} />
          </button>
          <button
            onClick={useRevert}
            className="p-2 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-red-400 rounded-lg transition-all"
            title="revert()"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      }
      controls={{
        play: useUpdate,
        restart: useRevert,
      }}
      state={layoutRef.current?.state}
      isPlaying={layoutRef.current?.isAnimating}
      code={lastMethod ? `controls.${lastMethod}` : `// choose a method above`}
    >
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Method Indicator */}
        <div className="flex items-center gap-3 bg-black/20 px-4 py-3 rounded-xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
            Active Method:{" "}
            <span className="text-[#ffd11a] ml-1">{lastMethod || "Idle"}</span>
          </span>
        </div>

        {/* Layout Container */}
        <AnimeLayout
          ref={layoutRef}
          duration={600}
          ease="outExpo"
          className="flex-1 grid gap-3 p-1 min-h-[160px]"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {items.map((item) => (
            <AnimeLayoutItem
              key={item}
              layoutId={`method-item-${item}`}
              className="h-12 flex items-center justify-center rounded-xl bg-[#ffd11a]/10 border border-[#ffd11a]/20 text-[#ffd11a] font-bold text-sm shadow-sm"
            >
              ITEM {item}
            </AnimeLayoutItem>
          ))}
        </AnimeLayout>

        {/* Method descriptions */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed mt-2 opacity-60">
          <span className="text-blue-400">Zap</span>{" "}
          <span>Record & Animate</span>
          <span className="text-green-400">Play</span>{" "}
          <span>Update Callback</span>
          <span className="text-red-400">Rotate</span>{" "}
          <span>Revert Styles</span>
        </div>
      </div>
    </DemoCard>
  );
};

export default LayoutMethodsDemo;
