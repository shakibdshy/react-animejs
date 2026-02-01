import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { RotateCcw, Play, Pause, CirclePause } from "lucide-react";

export const TimelineOnPauseDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isPausedEvent, setIsPausedEvent] = useState(false);

  const { controls, isPlaying, state } = useAnimeTimeline(
    {
      autoplay: false,
      loop: true,
      onPause: () => {
        setIsPausedEvent(true);
      },
    },
    [
      {
        targets: boxRef,
        translateX: "15rem",
        duration: 3000,
        ease: "linear",
      },
    ],
  );

  const handleRestart = () => {
    setIsPausedEvent(false);
    controls.restart();
  };

  const handlePlay = () => {
    setIsPausedEvent(false);
    controls.play();
  };

  return (
    <div className="w-full bg-[#1a1a24] rounded-3xl p-6 border border-[#2a2a3a] shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-[#ffd11a] font-bold text-xl tracking-tight">
            onPause
          </h4>
          <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
            Triggers when explicitly paused
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

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isPausedEvent && (
            <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
              <CirclePause className="w-12 h-12 text-[#ffd11a]" />
              <span className="text-[10px] text-[#ffd11a] font-mono font-bold tracking-[0.3em] uppercase">
                Paused Callback Fired
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={isPlaying ? () => controls.pause() : handlePlay}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all ${
              isPlaying
                ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                : "bg-[#ffd11a] text-[#1a1a24] shadow-[0_4px_15px_rgba(255,209,26,0.3)] hover:scale-[1.02]"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />{" "}
                {state.progress > 0 ? "Resume" : "Play"}
              </>
            )}
          </button>

          <div className="p-3 rounded-xl bg-black/40 border border-[#2a2a3a] flex items-center justify-center">
            <span
              className={`text-[10px] font-mono font-bold uppercase transition-colors ${isPausedEvent ? "text-[#ffd11a]" : "text-slate-600"}`}
            >
              {isPausedEvent ? "Event Logged" : "Ready to Pause"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
