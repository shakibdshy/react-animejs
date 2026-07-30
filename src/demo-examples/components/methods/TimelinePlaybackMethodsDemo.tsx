import React, { useRef, useState } from "react";
import { useAnimeTimeline } from "@shakibdshy/react-animejs";
import { DemoSection } from "../DemoSection";

const TimelinePlaybackMethodsDemo: React.FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [currentMethod, setCurrentMethod] = useState<string>("none");

  const { controls, state } = useAnimeTimeline(
    {
      autoplay: false,
      loop: true,
      duration: 2000,
    },
    [
      { label: "start", position: 0 },
      {
        targets: boxRef,
        translateX: 250,
        rotate: "1turn",
        borderRadius: ["0%", "50%"],
        duration: 2000,
        ease: "inOutQuad",
      },
      { label: "end", position: 2000 },
    ],
  );

  const runMethod = (name: string, fn: () => void) => {
    setCurrentMethod(name);
    fn();
  };

  const methods = [
    { name: "play", action: () => controls.play(), color: "bg-emerald-500" },
    { name: "pause", action: () => controls.pause(), color: "bg-amber-500" },
    {
      name: "resume",
      action: () => controls.resume(),
      color: "bg-emerald-600",
    },
    { name: "restart", action: () => controls.restart(), color: "bg-blue-500" },
    {
      name: "reverse",
      action: () => controls.reverse(),
      color: "bg-purple-500",
    },
    {
      name: "alternate",
      action: () => controls.alternate(),
      color: "bg-pink-500",
    },
    { name: "reset", action: () => controls.reset(), color: "bg-slate-600" },
    {
      name: "complete",
      action: () => controls.complete(),
      color: "bg-indigo-500",
    },
    { name: "cancel", action: () => controls.cancel(), color: "bg-red-500" },
    { name: "revert", action: () => controls.revert(), color: "bg-red-700" },
    { name: "refresh", action: () => controls.refresh(), color: "bg-cyan-500" },
  ];

  return (
    <DemoSection title="Timeline Playback & Utility Methods">
      <div className="w-full space-y-6">
        <p className="text-sm text-demo-text-secondary">
          These 11 methods control the playback state and engine lifecycle of
          the timeline.
        </p>

        <div className="h-24 bg-slate-900/50 rounded-xl flex items-center px-12 border border-slate-800 relative overflow-hidden">
          <div
            ref={boxRef}
            className="w-12 h-12 bg-linear-to-br from-indigo-400 to-indigo-600 rounded-lg shadow-xl shadow-indigo-500/20"
          />

          <div className="absolute top-2 right-4 text-[10px] font-mono text-demo-text-muted uppercase tracking-widest">
            Last Method:{" "}
            <span className="text-indigo-400 font-bold">{currentMethod}</span>
          </div>

          <div className="absolute bottom-0 left-0 h-1 bg-indigo-500/30 w-full">
            <div
              className="h-full bg-indigo-500 transition-all duration-100 ease-linear"
              style={{ width: `${state.progress * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {methods.map((m) => (
            <button
              key={m.name}
              onClick={() => runMethod(m.name, m.action)}
              className={`px-2 py-2 ${m.color} hover:brightness-110 text-white rounded-md text-[10px] font-bold uppercase tracking-tighter transition-all active:scale-95`}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-demo-text-muted uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Seek &
              Stretch
            </span>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  runMethod("seek(50%)", () => controls.seek("50%"))
                }
                className="flex-1 px-3 py-2 bg-demo-card hover:bg-slate-700 text-slate-300 rounded-md text-[10px] font-bold"
              >
                SEEK 50%
              </button>
              <button
                onClick={() =>
                  runMethod("seek(end)", () => controls.seek("end"))
                }
                className="flex-1 px-3 py-2 bg-demo-card hover:bg-slate-700 text-slate-300 rounded-md text-[10px] font-bold"
              >
                {"SEEK 'END'"}
              </button>
              <button
                onClick={() =>
                  runMethod("stretch(4s)", () => controls.stretch(4000))
                }
                className="flex-1 px-3 py-2 bg-demo-card hover:bg-slate-700 text-slate-300 rounded-md text-[10px] font-bold"
              >
                STRETCH 4s
              </button>
            </div>
          </div>

          <div className="space-y-2 bg-black/40 p-3 rounded-lg border border-slate-800/50">
            <div className="flex justify-between text-[10px]">
              <span className="text-demo-text-muted">Progress:</span>
              <span className="text-indigo-400 font-mono">
                {(state.progress * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-demo-text-muted">Time:</span>
              <span className="text-indigo-400 font-mono">
                {~~state.currentTime}ms
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-demo-text-muted">Paused:</span>
              <span
                className={state.paused ? "text-amber-500" : "text-emerald-500"}
              >
                {state.paused ? "YES" : "NO"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DemoSection>
  );
};

export default TimelinePlaybackMethodsDemo;
