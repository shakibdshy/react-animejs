import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { RotateCcw, Play } from "lucide-react";

export const TimelineOnBeginDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [beginTime, setBeginTime] = useState<string | null>(null);

  const { controls, isPlaying } = useAnimeTimeline(
    {
      autoplay: false,
      delay: 500,
      onBegin: () => {
        setTriggered(true);
        setBeginTime(new Date().toLocaleTimeString());
      },
    },
    [
      {
        targets: boxRef,
        translateX: "15rem",
        duration: 2000,
        ease: "out-expo",
      },
    ],
  );

  const handleRestart = () => {
    setTriggered(false);
    setBeginTime(null);
    controls.restart();
  };

  return (
    <div className="w-full bg-[#1a1a24] rounded-3xl p-6 border border-[#2a2a3a] shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-[#ffd11a] font-bold text-xl tracking-tight">
            onBegin
          </h4>
          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
            Triggers after the initial delay
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

        {!isPlaying && !triggered && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-10"
            onClick={() => controls.play()}
          >
            <div className="w-14 h-14 bg-[#ffd11a] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group">
              <Play className="w-6 h-6 text-[#1a1a24] fill-[#1a1a24] translate-x-0.5" />
            </div>
            <span className="absolute bottom-4 text-[10px] text-[#ffd11a] font-mono font-bold animate-pulse">
              CLICK TO START (500ms DELAY)
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="p-3 rounded-xl bg-black/40 border border-[#2a2a3a] flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Callback Status:
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${triggered ? "bg-[#ffd11a] shadow-[#ffd11a]/50" : "bg-slate-700 shadow-transparent"}`}
            />
            <span
              className={`text-[10px] font-mono font-bold ${triggered ? "text-[#ffd11a]" : "text-slate-500"}`}
            >
              {triggered ? `TRIGGERED AT ${beginTime}` : "WAITING..."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-500 italic px-1">
          <div className="w-1 h-3 bg-slate-700 rounded-full" />
          <span>
            Notice the callback only fires after the initial 500ms delay passes.
          </span>
        </div>
      </div>
    </div>
  );
};
