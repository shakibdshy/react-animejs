import { useAnimeTimer } from "@/lib/react-animejs";
import { DemoSection } from "./DemoSection";

/**
 * Delay Timer demonstration
 * Shows how a timer starts after an initial delay
 */
export function DelayTimerDemo() {
  const { controls, state, isRunning } = useAnimeTimer({
    duration: 2000,
    delay: 1000,
    loop: true,
    autoplay: true,
  });

  return (
    <DemoSection title="Timer with Delay (1000ms delay)">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 p-6 bg-demo-bg border border-demo-border rounded-xl shadow-inner">
          <span className="text-[10px] uppercase tracking-widest text-demo-text-secondary font-semibold">
            Current Time
          </span>
          <span className="font-mono text-5xl font-bold text-indigo-400 [text-shadow:0_0_20px_rgba(129,140,248,0.4)]">
            {Math.round(state.currentTime)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
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

      <div className="mt-2 w-full px-4 py-2 bg-demo-bg border border-demo-border rounded-lg font-mono text-[10px] text-center">
        {state.currentTime === 0 && !state.paused && !state.began ? (
          <span className="text-amber-500 font-bold uppercase animate-pulse">
            ⏳ Delaying (1s)...
          </span>
        ) : (
          <span className="text-[#666]">
            {state.completed
              ? "✅ Finished"
              : `Progress: ${Math.round(state.progress * 100)}%`}
          </span>
        )}
      </div>
    </DemoSection>
  );
}
