import React, { useRef, useState } from "react";
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from "../../components/AnimeLayout";
import { DemoCard } from "./DemoCard";
import { Layout, Maximize2, Sliders } from "lucide-react";

export const LayoutSettingsDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [duration, setDuration] = useState(500);
  const [delay, setDelay] = useState(0);
  const [useStagger, setUseStagger] = useState(false);
  const [isRow, setIsRow] = useState(false);

  const toggleLayout = () => {
    layoutRef.current?.update((layout) => {
      const root = layout.root as HTMLElement;
      root.classList.toggle("flex-row");
      root.classList.toggle("flex-col");
    });
    setIsRow(!isRow);
  };

  const playDemo = () => {
    toggleLayout();
    setTimeout(toggleLayout, duration + 200);
  };

  const items = ["A", "B", "C", "D", "E"];

  return (
    <DemoCard
      title="layout settings"
      description="Configure duration, delay, and staggering. Using <AnimeLayout> component."
      actions={
        <div className="flex gap-2">
          <button
            onClick={toggleLayout}
            className="p-2 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-[#ffd11a] rounded-lg transition-all"
            title="Toggle Layout orientation"
          >
            <Layout size={16} className={isRow ? "rotate-90" : ""} />
          </button>
        </div>
      }
      controls={{
        play: playDemo,
        restart: () => {
          if (isRow) toggleLayout();
        },
      }}
      state={layoutRef.current?.state}
      isPlaying={layoutRef.current?.isAnimating}
      code={`<AnimeLayout duration={${duration}} delay={${useStagger ? "50" : delay}} />`}
    >
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Settings Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <label className="flex items-center gap-1.5">
                <Maximize2 size={10} /> Duration
              </label>
              <span className="text-[#ffd11a]">{duration}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#ffd11a]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <label className="flex items-center gap-1.5">
                <Sliders size={10} /> Delay
              </label>
              <span className="text-[#ffd11a]">
                {useStagger ? "stagger" : `${delay}ms`}
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="range"
                min="0"
                max="500"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                disabled={useStagger}
                className="flex-1 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#ffd11a] disabled:opacity-30"
              />
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={useStagger}
                  onChange={(e) => setUseStagger(e.target.checked)}
                  className="w-3 h-3 rounded border-white/10 bg-white/5 checked:bg-[#ffd11a] accent-[#ffd11a]"
                />
                Stagger
              </label>
            </div>
          </div>
        </div>

        {/* Layout Container */}
        <AnimeLayout
          ref={layoutRef}
          duration={duration}
          delay={useStagger ? 50 : delay}
          className={`flex-1 flex gap-3 min-h-[140px] items-stretch ${isRow ? "flex-row" : "flex-col"}`}
        >
          {items.map((item) => (
            <AnimeLayoutItem
              key={item}
              layoutId={`settings-item-${item}`}
              className="flex-1 flex items-center justify-center rounded-xl bg-[#ffd11a]/5 border border-[#ffd11a]/10 text-[#ffd11a] font-bold text-sm shadow-sm"
            >
              ITEM {item}
            </AnimeLayoutItem>
          ))}
        </AnimeLayout>
      </div>
    </DemoCard>
  );
};

export default LayoutSettingsDemo;
