import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@/lib/react-animejs/hooks";
import { Play, RefreshCw, RotateCcw } from "lucide-react";

export const TimelineOnLoopDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [loopCount, setLoopCount] = useState(0);

  const { controls, isPlaying, state } = useAnimeTimeline(
    {
      autoplay: false,
      loop: 3,
      onLoop: () => {
        setLoopCount((prev) => prev + 1);
      },
    },
    [
      {
        targets: boxRef,
        rotate: "1turn",
        duration: 800,
        ease: "inOutSine",
      },
    ],
  );

  const handleRestart = () => {
    setLoopCount(0);
    controls.restart();
  };

  return (
    <div className="w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-demo-accent font-bold text-xl tracking-tight">
            onLoop
          </h4>
          <p className="text-[10px] text-demo-text-muted font-mono mt-1 uppercase tracking-wider">
            Triggers on every iteration
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
          className="w-16 h-16 bg-linear-to-br from-demo-accent to-[#ff9100] rounded-2xl flex items-center justify-center shadow-lg"
        >
          <RefreshCw
            className={`w-8 h-8 text-demo-card ${isPlaying ? "animate-spin" : ""}`}
            style={{ animationDuration: "0.8s" }}
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
            <span className="absolute bottom-4 text-[10px] text-demo-accent font-mono font-bold">
              3 LOOPS PLANNED
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-black/40 border border-demo-border flex flex-col items-center">
            <span className="text-[8px] font-mono text-demo-text-muted uppercase tracking-widest mb-1">
              Iterations
            </span>
            <span className="text-xl font-mono font-bold text-demo-accent">
              {loopCount} / 3
            </span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-demo-border flex flex-col items-center">
            <span className="text-[8px] font-mono text-demo-text-muted uppercase tracking-widest mb-1">
              State Iteration
            </span>
            <span className="text-xl font-mono font-bold text-demo-accent">
              {state.currentIteration}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-demo-text-muted text-center leading-relaxed">
          Fires at the end of each loop iteration. Note how it matches the
          state&apos;s iteration count.
        </p>
      </div>
    </div>
  );
};
