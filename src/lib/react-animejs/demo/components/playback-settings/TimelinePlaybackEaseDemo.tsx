import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { RotateCcw } from "lucide-react";
import type { EasingName } from "../../../types";

export const TimelinePlaybackEaseDemo: React.FC = () => {
  const squareRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const triangleRef = useRef<HTMLDivElement>(null);
  const [ease, setEase] = useState<EasingName>("easeInOutSine");

  const { controls, state, isPlaying } = useAnimeTimeline(
    {
      autoplay: false,
      loop: true,
      playbackEase: ease, // The timeline's time itself is eased!
      deps: [ease],
    },
    [
      {
        targets: circleRef,
        translateX: "15rem",
        duration: 2000,
        ease: "out(1)",
      },
      {
        targets: triangleRef,
        translateX: "15rem",
        duration: 2000,
        ease: "out(2)",
        position: "-=1500",
      },
      {
        targets: squareRef,
        translateX: "15rem",
        duration: 2000,
        ease: "out(3)",
        position: "-=1500",
      },
    ],
  );

  return (
    <div className="w-full bg-[#1a1a24] rounded-3xl p-6 border border-[#2a2a3a] shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[#ffd11a] font-bold text-xl">playbackEase</h4>
        <div className="flex gap-4 items-center">
          <select
            value={ease}
            onChange={(e) => setEase(e.target.value as EasingName)}
            className="bg-black/40 text-[#ffd11a] text-xs border border-[#ffd11a]/20 rounded px-2 py-1 outline-none"
          >
            <option value="linear">Linear</option>
            <option value="in-out(3)">in-out(3)</option>
            <option value="out-sine">EaseOut Sine</option>
            <option value="in-out-sine">EaseInOut Sine</option>
            <option value="out-back">EaseOut Back</option>
            <option value="out-elastic">EaseOut Elastic</option>
            <option value="out-bounce">EaseOut Bounce</option>
          </select>
          <button
            onClick={() => controls.restart()}
            className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-[#ffd11a] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-[#302c11] rounded-2xl p-8 relative min-h-[200px] flex items-center justify-start overflow-hidden border border-[#48421a]/30">
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

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full overflow-hidden">
          <div
            className="h-full bg-[#ffd11a] shadow-[0_0_10px_rgba(255,209,26,0.5)]"
            style={{ width: `${state.progress * 100}%` }}
          />
        </div>

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

      <p className="text-[10px] text-slate-400 mt-4 italic font-light">
        * Notice how the animation speed changes according to the playbackEase
        curve.
      </p>
    </div>
  );
};
