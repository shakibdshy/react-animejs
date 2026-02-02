/**
 * V4FeaturesDemo - Demonstrates new Anime.js v4 features
 * (onRender, onBeforeUpdate, persist, refresh)
 */

import React, { useState, useRef } from "react";
import { useAnime } from "../../hooks";

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
                ? "bg-[#ffd11a] text-[#12121a]"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Persist: {isPersisted ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => controls.refresh()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-tighter"
          >
            Refresh
          </button>
        </div>

        <div className="h-24 flex items-center bg-[#1a1a24]/50 rounded-2xl p-6 border border-white/5 relative">
          <div
            ref={boxRef}
            className="w-12 h-12 bg-[#ffd11a] rounded-xl shadow-[0_0_20px_rgba(255,209,26,0.2)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">
              Before Update
            </span>
            <span className="text-xl font-black text-[#ffd11a]">
              {beforeUpdateCount}
            </span>
          </div>
          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">
              Render Count
            </span>
            <span className="text-xl font-black text-[#ffd11a]">
              {renderCount}
            </span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 space-y-2 opacity-60 font-medium">
          <p>• onBeforeUpdate and onRender are new v4 internal callbacks.</p>
          <p>• persist: true prevents auto-removal from the engine.</p>
        </div>
      </div>
    </DemoCard>
  );
};

export default V4FeaturesDemo;
