import React, { useRef } from "react";
import { useAnimeTimeline } from "../../../hooks";
import { DemoSection } from "../DemoSection";

const TimelinePropertiesDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  const { controls, state } = useAnimeTimeline(
    {
      autoplay: false,
      loop: true,
      duration: 3000,
    },
    [
      { label: "start", position: 0 },
      {
        targets: boxRef,
        translateX: 250,
        rotate: "1turn",
        duration: 2000,
        ease: "inOutQuad",
      },
      { label: "middle", position: 1000 },
      { label: "end", position: 3000 },
    ],
  );

  const PropertyRow = ({
    label,
    value,
    color = "text-indigo-400",
  }: {
    label: string;
    value: any;
    color?: string;
  }) => (
    <div className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
        {label}
      </span>
      <span className={`text-[11px] font-mono ${color}`}>{String(value)}</span>
    </div>
  );

  return (
    <DemoSection title="Timeline Properties">
      <div className="space-y-6 w-full">
        <p className="text-sm text-slate-400">
          Reactive access to all Timeline instance properties. These values
          update automatically as the animation progresses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-24 bg-slate-900/50 rounded-xl flex items-center px-12 border border-slate-800 relative overflow-hidden">
              <div
                ref={boxRef}
                className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg shadow-xl"
              />
              <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 w-full opacity-20" />
              <div
                className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-100 ease-linear"
                style={{ width: `${state.progress * 100}%` }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => controls.play()}
                className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-xs font-bold uppercase"
              >
                Play
              </button>
              <button
                onClick={() => controls.pause()}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-xs font-bold uppercase"
              >
                Pause
              </button>
              <button
                onClick={() => controls.restart()}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-xs font-bold uppercase"
              >
                Restart
              </button>
            </div>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-slate-800 space-y-1">
            <PropertyRow label="ID" value={state.id} color="text-slate-400" />
            <PropertyRow label="Progress" value={state.progress.toFixed(4)} />
            <PropertyRow
              label="Current Time"
              value={`${Math.round(state.currentTime)}ms`}
            />
            <PropertyRow
              label="Duration"
              value={`${state.duration}ms`}
              color="text-slate-400"
            />
            <PropertyRow
              label="Paused"
              value={state.paused}
              color={state.paused ? "text-amber-500" : "text-emerald-500"}
            />
            <PropertyRow
              label="Began"
              value={state.began}
              color={state.began ? "text-emerald-500" : "text-slate-500"}
            />
            <PropertyRow
              label="Completed"
              value={state.completed}
              color={state.completed ? "text-emerald-500" : "text-slate-500"}
            />
            <PropertyRow
              label="Reversed"
              value={state.reversed}
              color={state.reversed ? "text-pink-500" : "text-slate-500"}
            />

            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-2">
                Labels
              </span>
              <div className="grid grid-cols-2 gap-2">
                {state.labels &&
                  Object.entries(state.labels).map(([name, pos]) => (
                    <div
                      key={name}
                      className="flex justify-between bg-white/5 rounded px-2 py-1"
                    >
                      <span className="text-[9px] text-slate-400 uppercase">
                        {name}
                      </span>
                      <span className="text-[9px] text-indigo-400 font-mono">
                        {pos}ms
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelinePropertiesDemo;
