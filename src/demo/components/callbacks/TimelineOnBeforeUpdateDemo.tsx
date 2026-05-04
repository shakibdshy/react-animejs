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
    <div className="w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-demo-accent font-bold text-xl tracking-tight">
            onBeforeUpdate
          </h4>
          <p className="text-[10px] text-demo-text-muted font-mono mt-1 uppercase tracking-wider">
            Triggers before values are calculated
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="p-2 hover:bg-white/5 rounded-full text-demo-text-secondary hover:text-demo-accent transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-demo-bg rounded-2xl p-8 relative min-h-[160px] flex items-center justify-center border border-demo-border overflow-hidden">
        <div
          ref={boxRef}
          className="w-16 h-16 bg-demo-accent/20 border border-demo-accent/40 rounded-xl flex items-center justify-center shadow-lg"
        >
          <Clock9
            className={`w-8 h-8 text-demo-accent ${isPlaying ? "animate-spin" : ""}`}
            style={{ animationDuration: "3s" }}
          />
        </div>

        {!isPlaying && state.progress === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-10"
            onClick={() => controls.play()}
          >
            <div className="w-14 h-14 bg-demo-accent rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group">
              <Play className="w-6 h-6 text-demo-card fill-[#1a1a24] translate-x-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="p-4 rounded-xl bg-black/40 border border-demo-border flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-demo-text-secondary uppercase tracking-widest self-start">
            Calculation cycles:
          </span>
          <div className="text-4xl font-mono font-black text-demo-accent tabular-nums tracking-tighter">
            {beforeUpdateCount.toString().padStart(4, "0")}
          </div>
        </div>

        <p className="text-[10px] text-demo-text-muted text-center leading-relaxed">
          This represents the number of times the engine prepared to calculate
          new values.
        </p>
      </div>
    </div>
  );
};
