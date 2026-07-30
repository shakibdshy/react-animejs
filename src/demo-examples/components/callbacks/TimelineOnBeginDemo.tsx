import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@shakibdshy/react-animejs";
import { Play, RotateCcw } from "lucide-react";

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
        ease: "outExpo",
      },
    ],
  );

  const handleRestart = () => {
    setTriggered(false);
    setBeginTime(null);
    controls.restart();
  };

  return (
    <div className="w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-demo-accent font-bold text-xl tracking-tight">
            onBegin
          </h4>
          <p className="text-[10px] text-demo-text-muted font-mono mt-1 uppercase tracking-wider">
            Triggers after the initial delay
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="p-2 hover:bg-white/5 rounded-full text-demo-text-secondary hover:text-demo-accent transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-demo-bg rounded-2xl p-8 relative min-h-40 flex items-center justify-start border border-demo-border overflow-hidden">
        <div
          ref={boxRef}
          className="w-12 h-12 bg-linear-to-br from-demo-accent to-[#ff9100] rounded-xl shadow-[0_0_20px_rgba(255,209,26,0.2)]"
        />

        {!isPlaying && !triggered && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer z-10"
            onClick={() => controls.play()}
          >
            <div className="w-14 h-14 bg-demo-accent rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group">
              <Play className="w-6 h-6 text-demo-card fill-[#1a1a24] translate-x-0.5" />
            </div>
            <span className="absolute bottom-4 text-[10px] text-demo-accent font-mono font-bold animate-pulse">
              CLICK TO START (500ms DELAY)
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="p-3 rounded-xl bg-black/40 border border-demo-border flex items-center justify-between">
          <span className="text-[10px] font-mono text-demo-text-secondary uppercase tracking-widest">
            Callback Status:
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${triggered ? "bg-demo-accent shadow-demo-accent/50" : "bg-slate-700 shadow-transparent"}`}
            />
            <span
              className={`text-[10px] font-mono font-bold ${triggered ? "text-demo-accent" : "text-demo-text-muted"}`}
            >
              {triggered ? `TRIGGERED AT ${beginTime}` : "WAITING..."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-demo-text-muted italic px-1">
          <div className="w-1 h-3 bg-slate-700 rounded-full" />
          <span>
            Notice the callback only fires after the initial 500ms delay passes.
          </span>
        </div>
      </div>
    </div>
  );
};
