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
        <div className="flex-1 flex flex-col items-center gap-2 p-5 bg-[#050508] border border-[#2a2a3a] rounded-xl">
          <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">
            Current Time
          </span>
          <span className="font-mono text-3xl font-bold text-green-500 [text-shadow:0_0_15px_rgba(34,197,94,0.4)]">
            {Math.round(state.currentTime)}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 p-5 bg-[#050508] border border-[#2a2a3a] rounded-xl">
          <span className="text-[10px] uppercase tracking-widest text-[#888] font-semibold">
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
      </div>

      <div className="mt-4 px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#666]">
        Frame Rate: 30fps | Progress: {Math.round(state.progress * 100)}%
      </div>
    </DemoSection>
  );
}
