import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { DemoSection } from "../DemoSection";

const TimelineStretchDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(2000);

  const { controls, state } = useAnimeTimeline(
    {
      loop: true,
      duration: duration,
      autoplay: true,
    },
    [
      {
        targets: boxRef,
        translateX: 250,
        rotate: "1turn",
        duration: 2000,
        ease: "inOutQuad",
      },
    ],
  );

  const handleStretch = (newDuration: number) => {
    setDuration(newDuration);
    controls.stretch(newDuration);
  };

  return (
    <DemoSection title="timeline.stretch()">
      <div className="space-y-6 w-full">
        <p className="text-sm text-slate-400">
          Modifies the total duration of the timeline while maintaining the
          current progress percentage. The speed of the animation adjusts to fit
          the new duration.
        </p>

        <div className="h-24 bg-slate-900/50 rounded-xl flex items-center px-12 border border-slate-800 relative overflow-hidden">
          <div
            ref={boxRef}
            className="w-12 h-12 bg-linear-to-br from-cyan-400 to-blue-600 rounded-lg shadow-xl shadow-blue-500/20"
          />

          <div className="absolute top-2 right-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Timeline Duration:{" "}
            <span className="text-cyan-400 font-bold">
              {Math.round(state.duration)}ms
            </span>
          </div>

          <div className="absolute bottom-0 left-0 h-1 bg-cyan-500/20 w-full">
            <div
              className="h-full bg-cyan-500 transition-all duration-100 ease-linear"
              style={{ width: `${state.progress * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={duration}
              onChange={(e) => handleStretch(Number(e.target.value))}
              className="flex-1 accent-cyan-500"
            />
            <span className="text-xs font-mono text-cyan-400 min-w-[60px]">
              {(duration / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[1000, 2000, 4000, 8000].map((d) => (
              <button
                key={d}
                onClick={() => handleStretch(d)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                  duration === d
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {d / 1000}s
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          // Stretch duration while playing
          <br />
          controls.stretch({duration})
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelineStretchDemo;
