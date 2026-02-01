import React, { useRef } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { Edit2, RotateCcw } from "lucide-react";

export const TimelineDefaultsDemo: React.FC = () => {
  const squareRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);

  const { controls, state, isPlaying } = useAnimeTimeline(
    {
      autoplay: false,
      // Timeline-level defaults (for shared parameters)
      defaults: {
        duration: 1000,
        ease: "out-expo",
      },
    },
    [
      // These will all inherit duration: 1000 and ease: 'out-expo'
      { targets: squareRef, x: 250 },
      { targets: circleRef, x: 250, position: "-=500" },
      { targets: triangleRef, x: 250, position: "-=500" },
    ],
  );

  return (
    <div className="w-full bg-[#1a1a24] rounded-3xl p-6 border border-[#2a2a3a] shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[#ffd11a] font-bold text-xl">defaults</h4>
        <div className="flex gap-2">
          <button className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-[#ffd11a] transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => controls.restart()}
            className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-[#ffd11a] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-[#302c11] rounded-2xl p-8 relative min-h-[200px] flex items-center justify-start overflow-hidden border border-[#48421a]/30">
        {/* Shapes */}
        <div className="flex flex-col items-center gap-1">
          <div
            ref={triangleRef}
            className="w-0 h-0 border-l-14 border-r-14 border-b-24 border-transparent border-b-[#ffd11a]"
          />
          <div className="flex gap-1">
            <div
              ref={squareRef}
              className="w-10 h-10 bg-[#ffd11a] rounded-lg"
            />
            <div
              ref={circleRef}
              className="w-10 h-10 bg-[#ffd11a] rounded-full"
            />
          </div>
        </div>

        {/* Play Button Overlay */}
        {!isPlaying && state.progress === 0 && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#302c11]/40 cursor-pointer z-10"
            onClick={() => controls.play()}
          >
            <div className="w-12 h-12 bg-[#ffd11a] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <div className="translate-x-0.5 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-[#302c11]" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span>Inherited Duration: 1000ms</span>
          <span>{Math.round(state.progress * 100)}%</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ffd11a] shadow-[0_0_10px_rgba(255,209,26,0.5)]"
            style={{ width: `${state.progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
