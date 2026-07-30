import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@shakibdshy/react-animejs";
import { CirclePause, Pause, Play, RotateCcw } from "lucide-react";

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
    <div className="w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-demo-accent font-bold text-xl tracking-tight">
            onPause
          </h4>
          <p className="text-[10px] text-demo-text-muted font-mono mt-1 uppercase tracking-wider">
            Triggers when explicitly paused
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="p-2 hover:bg-white/5 rounded-full text-demo-text-secondary hover:text-demo-accent transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-demo-bg rounded-2xl p-8 relative min-h-[160px] flex items-center justify-start border border-demo-border overflow-hidden">
        <div
          ref={boxRef}
          className="w-12 h-12 bg-linear-to-br from-demo-accent to-[#ff9100] rounded-xl shadow-[0_0_20px_rgba(255,209,26,0.2)]"
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isPausedEvent && (
            <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
              <CirclePause className="w-12 h-12 text-demo-accent" />
              <span className="text-[10px] text-demo-accent font-mono font-bold tracking-[0.3em] uppercase">
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
                : "bg-demo-accent text-demo-card shadow-[0_4px_15px_var(--demo-accent)/0.3] hover:scale-[1.02]"
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

          <div className="p-3 rounded-xl bg-black/40 border border-demo-border flex items-center justify-center">
            <span
              className={`text-[10px] font-mono font-bold uppercase transition-colors ${isPausedEvent ? "text-demo-accent" : "text-slate-600"}`}
            >
              {isPausedEvent ? "Event Logged" : "Ready to Pause"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
