import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { RotateCcw, Play, CheckCircle2 } from "lucide-react";

export const TimelineOnCompleteDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completeTime, setCompleteTime] = useState<string | null>(null);

  const { controls, isPlaying, state } = useAnimeTimeline(
    {
      autoplay: false,
      onComplete: () => {
        setIsCompleted(true);
        setCompleteTime(new Date().toLocaleTimeString());
      },
    },
    [
      {
        targets: boxRef,
        translateX: "15rem",
        duration: 2000,
        ease: "in-out-expo",
      },
    ],
  );

  const handleRestart = () => {
    setIsCompleted(false);
    setCompleteTime(null);
    controls.restart();
  };

  return (
    <div className="w-full bg-[#1a1a24] rounded-3xl p-6 border border-[#2a2a3a] shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-[#ffd11a] font-bold text-xl tracking-tight">
            onComplete
          </h4>
          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
            Triggers when everything finishes
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-[#ffd11a] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-[#0f0f13] rounded-2xl p-8 relative min-h-[160px] flex items-center justify-start border border-[#2a2a3a] overflow-hidden">
        <div
          ref={boxRef}
          className="w-12 h-12 bg-linear-to-br from-[#ffd11a] to-[#ff9100] rounded-xl shadow-[0_0_20px_rgba(255,209,26,0.2)]"
        />

        {!isPlaying && state.progress === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-10"
            onClick={() => controls.play()}
          >
            <div className="w-14 h-14 bg-[#ffd11a] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group">
              <Play className="w-6 h-6 text-[#1a1a24] fill-[#1a1a24] translate-x-0.5" />
            </div>
            <span className="absolute bottom-4 text-[10px] text-[#ffd11a] font-mono font-bold animate-pulse uppercase tracking-[0.2em]">
              Start Timeline
            </span>
          </div>
        )}

        {isCompleted && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#ffd11a]/10 px-3 py-1.5 rounded-full border border-[#ffd11a]/20 animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="w-3 h-3 text-[#ffd11a]" />
            <span className="text-[10px] text-[#ffd11a] font-mono font-bold uppercase tracking-widest">
              Finished
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="relative h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[#ffd11a]"
            style={{ width: `${state.progress * 100}%` }}
          />
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-[#2a2a3a] flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Callback Status:
          </span>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${isCompleted ? "bg-[#ffd11a]/10" : "bg-transparent"}`}
          >
            <span
              className={`text-[10px] font-mono font-bold ${isCompleted ? "text-[#ffd11a]" : "text-slate-500"}`}
            >
              {isCompleted
                ? `COMPLETED AT ${completeTime}`
                : "IN PROGRESS / READY"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
