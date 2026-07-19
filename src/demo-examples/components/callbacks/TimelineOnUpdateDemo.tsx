import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@/lib/react-animejs/hooks";
import { Activity, Play, RotateCcw } from "lucide-react";

export const TimelineOnUpdateDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const { controls, isPlaying, state } = useAnimeTimeline(
    {
      autoplay: false,
      onUpdate: () => {
        setUpdateCount((prev) => prev + 1);
      },
    },
    [
      {
        targets: boxRef,
        rotate: "360deg",
        duration: 2000,
        ease: "linear",
      },
    ],
  );

  const handleRestart = () => {
    setUpdateCount(0);
    controls.restart();
  };

  return (
    <div className="w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-demo-accent font-bold text-xl tracking-tight">
            onUpdate
          </h4>
          <p className="text-[10px] text-demo-text-muted font-mono mt-1 uppercase tracking-wider">
            Triggers on every single frame
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
          className="w-16 h-16 border-4 border-demo-accent rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,209,26,0.1)]"
        >
          <Activity
            className={`w-6 h-6 text-demo-accent ${isPlaying ? "animate-pulse" : ""}`}
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
            Total Frame Updates:
          </span>
          <div className="text-4xl font-mono font-black text-demo-accent tabular-nums tracking-tighter">
            {updateCount.toString().padStart(4, "0")}
          </div>
        </div>

        <p className="text-[10px] text-demo-text-muted text-center leading-relaxed">
          This callback fires roughly 60 times per second (depending on screen
          refresh rate).
        </p>
      </div>
    </div>
  );
};
