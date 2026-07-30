import React, { useRef } from "react";
import { useAnimeTimeline } from "@shakibdshy/react-animejs";
import { Edit2, RotateCcw } from "lucide-react";

export const TimelineAutoplayDemo: React.FC = () => {
  const squareRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);

  const { controls, state } = useAnimeTimeline(
    {
      autoplay: true, // Starts immediately
      loop: true,
      alternate: true,
    },
    [
      { targets: squareRef, translateX: "15rem", duration: 800 },
      {
        targets: circleRef,
        translateX: "15rem",
        duration: 800,
        position: "-=400",
      },
      {
        targets: triangleRef,
        translateX: "15rem",
        duration: 800,
        position: "-=400",
      },
    ],
  );

  return (
    <div className="w-full bg-demo-card rounded-3xl p-6 border border-demo-border shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-demo-accent font-bold text-xl">autoplay</h4>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-white/5 rounded-md text-demo-text-secondary hover:text-demo-accent transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => controls.restart()}
            className="p-1.5 hover:bg-white/5 rounded-md text-demo-text-secondary hover:text-demo-accent transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-[#302c11] rounded-2xl p-8 relative min-h-[200px] flex items-center justify-start overflow-hidden border border-[#48421a]/30">
        <div className="flex flex-col items-center gap-1">
          <div
            ref={triangleRef}
            className="w-0 h-0 border-l-14 border-r-14 border-b-24 border-transparent border-b-demo-accent"
          />
          <div className="flex gap-1">
            <div
              ref={squareRef}
              className="w-10 h-10 bg-demo-accent rounded-lg"
            />
            <div
              ref={circleRef}
              className="w-10 h-10 bg-demo-accent rounded-full"
            />
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-demo-accent/20 px-3 py-1 rounded-full border border-demo-accent/40">
          <span className="text-demo-accent text-[10px] font-bold tracking-widest uppercase">
            Autoplay Active
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
          <span>Mode: Autostart</span>
          <span>{Math.round(state.progress * 100)}%</span>
        </div>
        <div className="h-1 bg-demo-card rounded-full overflow-hidden">
          <div
            className="h-full bg-demo-accent shadow-[0_0_10px_var(--demo-accent)/0.5]"
            style={{ width: `${state.progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
