import { useAnimeTimer } from "@/lib/react-animejs";
import { DemoSection } from "./DemoSection";

/**
 * Advanced Timer demonstration with LCD display
 * Based on Anime.js createTimer example
 */
export function AdvancedTimerDemo() {
  const { controls, state, isRunning } = useAnimeTimer({
    duration: 1000,
    loop: true,
    frameRate: 30, // Custom frame rate as requested
    autoplay: true,
  });

  return (
    <DemoSection title="Advanced Timer (Full Features)">
      <div className="flex gap-4 w-full">
        <div className="flex-1 flex flex-col items-center gap-2 p-5 bg-demo-bg border border-demo-border rounded-xl">
          <span className="text-[10px] uppercase tracking-widest text-demo-text-secondary font-semibold">
            Current Time
          </span>
          <span className="font-mono text-3xl font-bold text-green-500 [text-shadow:0_0_15px_rgba(34,197,94,0.4)]">
            {Math.round(state.currentTime)}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 p-5 bg-demo-bg border border-demo-border rounded-xl">
          <span className="text-[10px] uppercase tracking-widest text-demo-text-secondary font-semibold">
            Callback Fired
          </span>
          <span className="font-mono text-3xl font-bold text-green-500 [text-shadow:0_0_15px_rgba(34,197,94,0.4)]">
            {state.currentIteration}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <button
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transition-all"
          onClick={controls.play}
          disabled={isRunning}
        >
          Play
        </button>
        <button
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-demo-card border border-demo-border hover:bg-demo-border text-demo-text-muted hover:text-white rounded-lg active:scale-95 transition-all"
          onClick={controls.pause}
        >
          Pause
        </button>
        <button
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-demo-card border border-demo-border hover:bg-demo-border text-demo-text-muted hover:text-white rounded-lg active:scale-95 transition-all"
          onClick={() => controls.restart()}
        >
          Restart
        </button>
      </div>

      <div className="mt-4 px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-[#666]">
        Frame Rate: 30fps | Progress: {Math.round(state.progress * 100)}%
      </div>
    </DemoSection>
  );
}
