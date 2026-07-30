/**
 * V4FeaturesDemo - Demonstrates new Anime.js v4 features
 * (onRender, onBeforeUpdate, persist, refresh)
 */

import React, { useRef, useState } from "react";
import { useAnime } from "@shakibdshy/react-animejs";

import { DemoCard } from "./DemoCard";

export const V4FeaturesDemo: React.FC = () => {
  const [renderCount, setRenderCount] = useState(0);
  const [beforeUpdateCount, setBeforeUpdateCount] = useState(0);
  const [isPersisted, setIsPersisted] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);

  const { controls, state, isPlaying } = useAnime({
    targets: boxRef,
    translateX: 250,
    rotate: "90deg",
    duration: 2000,
    autoplay: false,
    persist: isPersisted,
    onBeforeUpdate: () => {
      setBeforeUpdateCount((c) => c + 1);
    },
    onRender: () => {
      setRenderCount((c) => c + 1);
    },
  });

  return (
    <DemoCard
      title="v4 new features"
      description="Showcasing onRender, onBeforeUpdate, and persist functionality."
      controls={controls}
      state={state}
      isPlaying={isPlaying}
    >
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setIsPersisted(!isPersisted)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
              isPersisted
                ? "bg-demo-accent text-demo-bg"
                : "bg-demo-card text-demo-text-secondary hover:text-white"
            }`}
          >
            Persist: {isPersisted ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => controls.refresh()}
            className="px-3 py-1.5 bg-demo-card hover:bg-slate-700 text-demo-text-secondary hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-tighter"
          >
            Refresh
          </button>
        </div>

        <div className="h-24 flex items-center bg-demo-card/50 rounded-2xl p-6 border border-white/5 relative">
          <div
            ref={boxRef}
            className="w-12 h-12 bg-demo-accent rounded-xl shadow-[0_0_20px_rgba(255,209,26,0.2)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[10px] text-demo-text-muted uppercase font-bold tracking-widest mb-1">
              Before Update
            </span>
            <span className="text-xl font-black text-demo-accent">
              {beforeUpdateCount}
            </span>
          </div>
          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[10px] text-demo-text-muted uppercase font-bold tracking-widest mb-1">
              Render Count
            </span>
            <span className="text-xl font-black text-demo-accent">
              {renderCount}
            </span>
          </div>
        </div>

        <div className="text-[10px] text-demo-text-muted space-y-2 opacity-60 font-medium">
          <p>• onBeforeUpdate and onRender are new v4 internal callbacks.</p>
          <p>• persist: true prevents auto-removal from the engine.</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default V4FeaturesDemo;
