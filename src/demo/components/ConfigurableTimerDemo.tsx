import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimeTimer } from "@/lib/react-animejs";
import { DemoSection } from "./DemoSection";

/**
 * Configurable Timer demonstration
 * Showcases all playback options in one interactive component
 */
export function ConfigurableTimerDemo() {
  // Timer config (changes here recreate the timer)
  const [config, setConfig] = useState({
    duration: 10000,
    loop: true as boolean | number,
    loopDelay: 0,
    alternate: false,
    reversed: false,
    autoplay: false,
    playbackRate: 1,
  });

  // Debug refs
  const currentTimeDebugRef = useRef<HTMLSpanElement>(null);
  const iterationTimeDebugRef = useRef<HTMLSpanElement>(null);
  const iterationProgressDebugRef = useRef<HTMLSpanElement>(null);
  const iterationCurrentTimeDebugRef = useRef<HTMLSpanElement>(null);
  const reversedDebugRef = useRef<HTMLSpanElement>(null);

  // Refs for direct DOM manipulation (bypasses React render cycle for smooth animation)
  const iterationTimeRef = useRef<HTMLSpanElement>(null);
  const currentTimeRef = useRef<HTMLSpanElement>(null);
  const fpsInputRef = useRef<HTMLInputElement>(null);
  const fpsDisplayRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  // Stable callbacks that don't cause timer recreation
  const handleUpdate = useCallback((t: any) => {
    // Show iterationCurrentTime (time within current iteration)
    if (iterationTimeRef.current) {
      // Try multiple properties v4 might expose
      // If reversed, iterationTime goes 0->duration, but iterationCurrentTime goes duration->0 ???
      // Let's rely on what we see in the debug panel
      const val = t.iterationCurrentTime ?? t.iterationTime ?? t.currentTime;
      iterationTimeRef.current.textContent = String(Math.round(val));
    }
    // Show overall currentTime
    if (currentTimeRef.current) {
      currentTimeRef.current.textContent = String(Math.round(t.currentTime));
    }
    if (progressRef.current) {
      progressRef.current.textContent = String(Math.round(t.progress * 100));
    }

    // Update debug values
    if (currentTimeDebugRef.current)
      currentTimeDebugRef.current.textContent = t.currentTime;
    if (iterationTimeDebugRef.current)
      iterationTimeDebugRef.current.textContent = t.iterationTime;
    if (iterationProgressDebugRef.current)
      iterationProgressDebugRef.current.textContent = t.iterationProgress;
    if (iterationCurrentTimeDebugRef.current)
      iterationCurrentTimeDebugRef.current.textContent = t.iterationCurrentTime;
    if (reversedDebugRef.current)
      reversedDebugRef.current.textContent = String(t.reversed);
  }, []);

  const handleLoop = useCallback(() => {
    // Loop callback - could show iteration number here if needed
  }, []);

  // We need state/isRunning for the status bar, even if it causes re-renders.
  // The animation smoothness is handled by refs, so re-renders are OK for status.
  const { controls, timer, state, isRunning } = useAnimeTimer({
    duration: config.duration,
    loop: config.loop,
    loopDelay: config.loopDelay,
    alternate: config.alternate,
    reversed: config.reversed,
    autoplay: config.autoplay,
    playbackRate: config.playbackRate,
    frameRate: 60,
    onUpdate: handleUpdate,
    onLoop: handleLoop,
  });

  // Direct fps update (like MinimalHookTest) - no React state/effect
  const handleFpsChange = useCallback(() => {
    if (fpsInputRef.current && timer) {
      const value = Number(fpsInputRef.current.value);
      (timer as any).fps = value;
      if (fpsDisplayRef.current) {
        fpsDisplayRef.current.textContent = String(value);
      }
    }
  }, [timer]);

  // Debug: Log timer state when it changes
  useEffect(() => {
    if (timer) {
      console.log("[ConfigurableTimerDemo] New timer created:", {
        id: timer.id,
        reversed: timer.reversed,
        duration: timer.duration,
        fps: (timer as any).fps,
      });
      // Ensure fps is set correctly on creation
      if (fpsInputRef.current) {
        (timer as any).fps = Number(fpsInputRef.current.value);
      }
    }
  }, [timer]);

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DemoSection title="Comprehensive Timer Configuration">
      <div className="flex gap-4 w-full mb-6">
        <div className="flex-1 flex flex-col items-center gap-2 p-5 bg-[#050508] border border-[#2a2a3a] rounded-xl shadow-inner">
          <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">
            Iteration Time
          </span>
          <span
            ref={iterationTimeRef}
            className="font-mono text-4xl font-bold text-green-500 [text-shadow:0_0_15px_rgba(34,197,94,0.4)]"
          >
            0
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 p-5 bg-[#050508] border border-[#2a2a3a] rounded-xl shadow-inner">
          <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">
            Current Time
          </span>
          <span
            ref={currentTimeRef}
            className="font-mono text-4xl font-bold text-indigo-400 [text-shadow:0_0_15px_rgba(99,102,241,0.4)]"
          >
            0
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 p-5 bg-[#050508] border border-[#2a2a3a] rounded-xl shadow-inner">
          <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">
            Status
          </span>
          <span
            className={`${state.completed ? "text-green-500" : isRunning ? "text-indigo-400" : "text-[#666]"} font-bold uppercase tracking-widest`}
          >
            {state.completed ? "Done" : isRunning ? "Running" : "Paused"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold">
            Duration (ms)
          </label>
          <input
            type="number"
            className="bg-[#0a0a10] border border-[#2a2a3a] rounded-lg p-2.5 text-sm text-[#e0e0e0] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            value={config.duration}
            onChange={(e) => updateConfig("duration", Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold">
            Loop Count
          </label>
          <input
            type="number"
            className="bg-[#0a0a10] border border-[#2a2a3a] rounded-lg p-2.5 text-sm text-[#e0e0e0] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            defaultValue={0}
            onChange={(e) => {
              const val = Number(e.target.value);
              updateConfig("loop", val === 0 ? true : val);
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold">
            Loop Delay (ms)
          </label>
          <input
            type="number"
            className="bg-[#0a0a10] border border-[#2a2a3a] rounded-lg p-2.5 text-sm text-[#e0e0e0] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            value={config.loopDelay}
            onChange={(e) => updateConfig("loopDelay", Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold">
            Playback Rate
          </label>
          <input
            type="number"
            step="0.1"
            className="bg-[#0a0a10] border border-[#2a2a3a] rounded-lg p-2.5 text-sm text-[#e0e0e0] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            value={config.playbackRate}
            onChange={(e) =>
              updateConfig("playbackRate", Number(e.target.value))
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-[#888] font-bold">
            Frame Rate (fps):{" "}
            <span ref={fpsDisplayRef} className="text-indigo-400">
              60
            </span>
          </label>
          <input
            ref={fpsInputRef}
            type="range"
            min={1}
            max={120}
            defaultValue={60}
            step={1}
            className="w-full accent-indigo-500"
            onInput={handleFpsChange}
          />
        </div>
        <div className="flex flex-col gap-2 pt-1">
          <label className="flex items-center justify-between p-2.5 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg cursor-pointer hover:bg-[#20202e] transition-colors">
            <span className="text-[10px] uppercase tracking-widest text-[#ccc] font-medium">
              Alternate
            </span>
            <input
              type="checkbox"
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
              checked={config.alternate}
              onChange={(e) => updateConfig("alternate", e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between p-2.5 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg cursor-pointer hover:bg-[#20202e] transition-colors">
            <span className="text-[10px] uppercase tracking-widest text-[#ccc] font-medium">
              Reversed
            </span>
            <input
              type="checkbox"
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
              checked={config.reversed}
              onChange={(e) => updateConfig("reversed", e.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between p-2.5 bg-[#1a1a25] border border-[#2a2a3a] rounded-lg cursor-pointer hover:bg-[#20202e] transition-colors">
            <span className="text-[10px] uppercase tracking-widest text-[#ccc] font-medium">
              Autoplay
            </span>
            <input
              type="checkbox"
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
              checked={config.autoplay}
              onChange={(e) => updateConfig("autoplay", e.target.checked)}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mt-8">
        <button
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
          onClick={controls.play}
        >
          Play
        </button>
        <button
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#1e1e2a] border border-[#2a2a3a] hover:bg-[#2a2a3a] text-[#aaa] hover:text-white rounded-lg active:scale-95 transition-all"
          onClick={controls.pause}
        >
          Pause
        </button>
        <button
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#1e1e2a] border border-[#2a2a3a] hover:bg-[#2a2a3a] text-[#aaa] hover:text-white rounded-lg active:scale-95 transition-all"
          onClick={() => controls.restart()}
        >
          Restart
        </button>
        <button
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#1a1a25] border border-red-900/30 hover:bg-red-950/20 text-red-500/70 hover:text-red-400 rounded-lg active:scale-95 transition-all"
          onClick={() => controls.reset()}
        >
          Reset
        </button>
      </div>

      <div className="mt-6 w-full px-4 py-2.5 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] flex justify-between items-center tracking-tighter">
        <span className="text-[#666]">
          Progress:{" "}
          <span ref={progressRef} className="text-indigo-400 font-bold">
            0
          </span>
          %
        </span>
      </div>
    </DemoSection>
  );
}
