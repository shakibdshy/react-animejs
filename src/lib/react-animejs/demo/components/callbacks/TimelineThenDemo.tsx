import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@/lib/react-animejs/hooks";
import { RotateCcw, Play, Zap } from "lucide-react";

export const TimelineThenDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isResolved, setIsResolved] = useState(false);
  const [resolveTime, setResolveTime] = useState<string | null>(null);

  const { timeline, controls, isPlaying, state } = useAnimeTimeline(
    {
      autoplay: false,
    },
    [
      {
        targets: boxRef,
        scale: [1, 2, 1],
        rotate: "180deg",
        duration: 1500,
        ease: "easeInOutBack",
      },
    ],
  );

  const handlePlay = () => {
    setIsResolved(false);
    setResolveTime(null);
    controls.play();

    // Use the .then() promise from the timeline instance
    if (timeline) {
      timeline.then(() => {
        setIsResolved(true);
        setResolveTime(new Date().toLocaleTimeString());
      });
    }
  };

  const handleRestart = () => {
    setIsResolved(false);
    setResolveTime(null);
    controls.restart();

    if (timeline) {
      timeline.then(() => {
        setIsResolved(true);
        setResolveTime(new Date().toLocaleTimeString());
      });
    }
  };

  return (
    <div className="w-full bg-[#1a1a24] rounded-3xl p-6 border border-[#2a2a3a] shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-[#ffd11a] font-bold text-xl tracking-tight">
            .then()
          </h4>
          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
            Promise resolved when finished
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
          className="w-16 h-16 bg-linear-to-br from-[#ffd11a] to-[#ff9100] rounded-2xl flex items-center justify-center shadow-lg"
        >
          <Zap
            className={`w-8 h-8 text-[#1a1a24] ${isPlaying ? "animate-pulse" : ""}`}
          />
        </div>

        {!isPlaying && state.progress === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-10"
            onClick={handlePlay}
          >
            <div className="w-14 h-14 bg-[#ffd11a] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group">
              <Play className="w-6 h-6 text-[#1a1a24] fill-[#1a1a24] translate-x-0.5" />
            </div>
            <span className="absolute bottom-4 text-[10px] text-[#ffd11a] font-mono font-bold">
              START PROMISE CHAIN
            </span>
          </div>
        )}

        {isResolved && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-[#ffd11a]/20 border border-[#ffd11a]/40 px-6 py-2 rounded-xl backdrop-blur-sm animate-in zoom-in fade-in duration-500">
              <span className="text-sm font-mono font-black text-[#ffd11a] uppercase tracking-tighter">
                Promise Resolved!
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="p-3 rounded-xl bg-black/40 border border-[#2a2a3a] flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Resolution:
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-bold ${isResolved ? "text-[#ffd11a]" : "text-slate-500"}`}
            >
              {isResolved ? `RESOLVED AT ${resolveTime}` : "AWAITING..."}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 italic px-1">
          The .then() method allows you to use standard async/await or promise
          chains for sequential logic after the timeline completes.
        </p>
      </div>
    </div>
  );
};
