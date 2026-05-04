import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@/lib/react-animejs/hooks";
import { Clock9, Play, RotateCcw } from "lucide-react";

export const TimelineOnBeforeUpdateDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [beforeUpdateCount, setBeforeUpdateCount] = useState(0);

  const { controls, isPlaying, state } = useAnimeTimeline(
    {
      autoplay: false,
      onBeforeUpdate: () => {
        setBeforeUpdateCount((prev) => prev + 1);
      },
    },
    [
      {
        targets: boxRef,
        translateY: [-20, 20, -20],
        duration: 2000,
        ease: "inOutSine",
        loop: true,
      },
    ],
  );

  const handleRestart = () => {
    setBeforeUpdateCount(0);
    controls.restart();
  };

  return (
    <div className="w-full bg-[#1a1a24] rounded-3xl p-6 border border-[#2a2a3a] shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-[#ffd11a] font-bold text-xl tracking-tight">
            onBeforeUpdate
          </h4>
          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
            Triggers before values are calculated
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-[#ffd11a] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#0f0f13] rounded-2xl p-8 relative min-h-[160px] flex items-center justify-center border border-[#2a2a3a] overflow-hidden">
        <div
          ref={boxRef}
          className="w-16 h-16 bg-[#ffd11a]/20 border border-[#ffd11a]/40 rounded-xl flex items-center justify-center shadow-lg"
        >
          <Clock9
            className={`w-8 h-8 text-[#ffd11a] ${isPlaying ? "animate-spin" : ""}`}
            style={{ animationDuration: "3s" }}
          />
        </div>

        {!isPlaying && state.progress === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-10"
            onClick={() => controls.play()}
          >
            <div className="w-14 h-14 bg-[#ffd11a] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group">
              <Play className="w-6 h-6 text-[#1a1a24] fill-[#1a1a24] translate-x-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="p-4 rounded-xl bg-black/40 border border-[#2a2a3a] flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest self-start">
            Calculation cycles:
          </span>
          <div className="text-4xl font-mono font-black text-[#ffd11a] tabular-nums tracking-tighter">
            {beforeUpdateCount.toString().padStart(4, "0")}
          </div>
        </div>

        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          This represents the number of times the engine prepared to calculate
          new values.
        </p>
      </div>
    </div>
  );
};
