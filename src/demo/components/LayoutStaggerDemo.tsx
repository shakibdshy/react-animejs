import React, { useRef, useState } from "react";
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from "@/lib/react-animejs/components/AnimeLayout";
import { stagger } from "animejs";
import { DemoCard } from "./DemoCard";
import { Layout, Sliders, Target } from "lucide-react";

export const LayoutStaggerDemo: React.FC = () => {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [staggerFrom, setStaggerFrom] = useState<"first" | "last" | "center">(
    "first",
  );
  const [staggerDelay, setStaggerDelay] = useState(75);
  const [isRow, setIsRow] = useState(true);

  const toggleLayout = () => {
    layoutRef.current?.update(
      (layout) => {
        const root = layout.root as HTMLElement;
        root.classList.toggle("flex-row");
        root.classList.toggle("flex-col");
      },
      {
        delay: stagger(staggerDelay, { from: staggerFrom }),
      },
    );
    setIsRow(!isRow);
  };

  const items = ["1", "2", "3", "4", "5", "6"];

  const playDemo = () => {
    toggleLayout();
    setTimeout(toggleLayout, 1000);
  };

  return (
    <DemoCard
      title="staggered layout"
      description="Apply sequential delays to layout transitions. Click 'Play' to toggle with stagger."
      actions={
        <div className="flex gap-2">
          <button
            onClick={toggleLayout}
            className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-demo-accent rounded-lg transition-all"
            title="Toggle orientation"
          >
            <Layout size={16} className={isRow ? "rotate-90" : ""} />
          </button>
        </div>
      }
      controls={{
        play: playDemo,
        restart: () => {
          if (!isRow) toggleLayout();
        },
      }}
      state={layoutRef.current?.state}
      isPlaying={
        !layoutRef.current?.state.paused &&
        layoutRef.current?.state.began &&
        !layoutRef.current?.state.completed
      }
      code={`delay: stagger(${staggerDelay}, { from: '${staggerFrom}' })`}
    >
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
              <label className="flex items-center gap-1.5">
                <Target size={10} /> Stagger From
              </label>
              <span className="text-demo-accent capitalize">{staggerFrom}</span>
            </div>
            <div className="flex gap-1">
              {(["first", "center", "last"] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setStaggerFrom(pos)}
                  className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                    staggerFrom === pos
                      ? "bg-demo-accent text-demo-bg"
                      : "bg-white/5 text-demo-text-muted hover:bg-white/10"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
              <label className="flex items-center gap-1.5">
                <Sliders size={10} /> Stagger Delay
              </label>
              <span className="text-demo-accent">{staggerDelay}ms</span>
            </div>
            <input
              type="range"
              min="25"
              max="200"
              value={staggerDelay}
              onChange={(e) => setStaggerDelay(Number(e.target.value))}
              className="w-full h-1 bg-demo-card rounded-full appearance-none cursor-pointer accent-demo-accent"
            />
          </div>
        </div>

        {/* Layout Container */}
        <AnimeLayout
          ref={layoutRef}
          childrenSelector=".stagger-item"
          duration={600}
          ease="outExpo"
          className={`flex-1 flex gap-3 min-h-[140px] items-stretch ${isRow ? "flex-row" : "flex-col"}`}
        >
          {items.map((item, index) => (
            <AnimeLayoutItem
              key={item}
              className="stagger-item flex-1 flex items-center justify-center rounded-xl bg-demo-accent/5 border border-demo-accent/10 text-demo-accent font-bold text-lg shadow-sm"
              style={{
                borderColor: `hsla(${200 + index * 25}, 70%, 50%, 0.3)`,
                backgroundColor: `hsla(${200 + index * 25}, 70%, 50%, 0.1)`,
                color: `hsl(${200 + index * 25}, 70%, 60%)`,
              }}
            >
              {item}
            </AnimeLayoutItem>
          ))}
        </AnimeLayout>
      </div>
    </DemoCard>
  );
};

export default LayoutStaggerDemo;
