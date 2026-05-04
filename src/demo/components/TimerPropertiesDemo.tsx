import { useAnimeTimer } from "@/lib/react-animejs";
import { DemoSection } from "./DemoSection";

export function TimerPropertiesDemo() {
  const { controls, state, isRunning } = useAnimeTimer({
    duration: 5000,
    loop: true,
    autoplay: true,
    frameRate: 60,
  });

  return (
    <DemoSection title="Timer Reactive Properties">
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Core Progression */}
        <PropertyCard label="currentTime" value={`${Math.round(state.currentTime)}ms`} color="text-indigo-400" />
        <PropertyCard label="progress" value={state.progress.toFixed(3)} color="text-indigo-400" />
        
        {/* Iteration Details */}
        <PropertyCard label="iterationCurrentTime" value={`${Math.round(state.iterationCurrentTime)}ms`} color="text-green-400" />
        <PropertyCard label="iterationProgress" value={state.iterationProgress.toFixed(3)} color="text-green-400" />
        
        {/* Engine State */}
        <PropertyCard label="deltaTime" value={`${state.deltaTime.toFixed(2)}ms`} color="text-yellow-400" />
        <PropertyCard label="fps" value={state.fps} color="text-yellow-400" />
        
        {/* Playback Settings */}
        <PropertyCard label="speed" value={`${state.speed}x`} color="text-purple-400" />
        <PropertyCard label="currentIteration" value={state.currentIteration} color="text-purple-400" />
        
        {/* Booleans */}
        <div className="col-span-2 grid grid-cols-4 gap-2 mt-2">
          <BooleanIndicator label="paused" active={state.paused} />
          <BooleanIndicator label="began" active={state.began} />
          <BooleanIndicator label="completed" active={state.completed} />
          <BooleanIndicator label="backwards" active={state.backwards} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mt-6">
        <button
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all"
          onClick={controls.play}
          disabled={isRunning}
        >
          Play
        </button>
        <button
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-demo-card border border-demo-border text-demo-text-muted hover:text-white rounded-lg transition-all"
          onClick={controls.pause}
        >
          Pause
        </button>
        <button
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-demo-card border border-demo-border text-demo-text-muted hover:text-white rounded-lg transition-all"
          onClick={controls.reverse}
        >
          Reverse
        </button>
        <button
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-demo-card border border-demo-border text-demo-text-muted hover:text-white rounded-lg transition-all"
          onClick={() => controls.setPlaybackRate(state.speed === 1 ? 2 : 1)}
        >
          Toggle Speed
        </button>
      </div>
    </DemoSection>
  );
}

function PropertyCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-demo-bg border border-demo-border rounded-lg">
      <span className="text-[9px] uppercase tracking-widest text-[#666] font-bold">{label}</span>
      <span className={`font-mono text-xl font-bold ${color}`}>{value}</span>
    </div>
  );
}

function BooleanIndicator({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 p-2 rounded border transition-colors ${active ? "bg-indigo-500/10 border-indigo-500/50" : "bg-demo-bg border-demo-border"}`}>
      <span className={`text-[8px] uppercase font-bold ${active ? "text-indigo-400" : "text-[#444]"}`}>{label}</span>
      <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]" : "bg-[#222]"}`} />
    </div>
  );
}
