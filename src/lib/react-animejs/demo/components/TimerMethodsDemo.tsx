import { useRef, useCallback, useState } from "react";
import { useAnimeTimer } from "@/lib/react-animejs";
import { DemoSection } from "./DemoSection";

export function TimerMethodsDemo() {
  const currentTimeRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isReverted, setIsReverted] = useState(false);

  const handleUpdate = useCallback((t: any) => {
    if (currentTimeRef.current) {
      currentTimeRef.current.textContent = String(Math.round(t.iterationCurrentTime ?? t.currentTime));
    }
    if (progressRef.current) {
      progressRef.current.style.width = `${(t.iterationProgress ?? t.progress) * 100}%`;
    }
  }, []);

  const { controls, isRunning, isReady, state } = useAnimeTimer({
    duration: 5000,
    loop: true,
    autoplay: false,
    frameRate: 60,
    onUpdate: handleUpdate,
  });

  const handleRevert = () => {
    controls.revert();
    setIsReverted(true);
    updateUI(0, 0);
  };

  const handleReset = () => {
    controls.reset();
    updateUI(0, 0);
  };

  const handleCancel = () => {
    controls.cancel();
    updateUI(0, 0);
  };

  const handleComplete = () => {
    controls.complete();
    updateUI(5000, 1);
  };

  const handleSeek = (val: string) => {
    controls.seek(val);
    if (val === '50%') updateUI(2500, 0.5);
  };

  const handleRestart = () => {
    setIsReverted(false);
    controls.restart();
  };

  const updateUI = (time: number, progress: number) => {
    if (currentTimeRef.current) currentTimeRef.current.textContent = String(Math.round(time));
    if (progressRef.current) progressRef.current.style.width = `${progress * 100}%`;
  };

  return (
    <DemoSection title="Timer Control Methods">
      <div className="flex flex-col gap-6 w-full">
        {/* Progress and Time Display */}
        <div className="flex flex-col gap-4 p-6 bg-[#0a0a10] border border-[#2a2a3a] rounded-xl shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            <span className="text-xs uppercase tracking-widest text-[#888] font-bold">
              progression
            </span>
            <span className="font-mono text-2xl font-bold text-indigo-400">
              <span ref={currentTimeRef}>0</span>
              <span className="text-sm text-[#444] ml-1">/ 5000ms</span>
            </span>
          </div>
          
          <div className="h-2 w-full bg-[#1a1a25] rounded-full overflow-hidden relative z-10">
            <div 
              ref={progressRef}
              className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-[width] duration-75 ease-linear"
              style={{ width: '0%' }}
            />
          </div>

          {isReverted && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20 animate-in fade-in duration-300">
              <span className="text-red-500 font-bold uppercase tracking-tighter text-sm">Timer Reverted (Instance Removed)</span>
            </div>
          )}
        </div>

        {/* Method Controls Grid */}
        <div className="grid grid-cols-3 gap-2">
          <ControlButton onClick={controls.play} label="play()" disabled={isRunning || isReverted} primary />
          <ControlButton onClick={controls.pause} label="pause()" disabled={!isRunning || isReverted} />
          <ControlButton onClick={controls.resume} label="resume()" disabled={isRunning || isReverted} />
          
          <ControlButton onClick={handleRestart} label="restart()" />
          <ControlButton onClick={controls.reverse} label="reverse()" disabled={isReverted} />
          <ControlButton onClick={controls.alternate} label="alternate()" disabled={isReverted} />
          
          <ControlButton onClick={handleComplete} label="complete()" disabled={isReverted} />
          <ControlButton onClick={handleReset} label="reset()" disabled={isReverted} />
          <ControlButton onClick={handleCancel} label="cancel()" disabled={isReverted} />
          
          <ControlButton onClick={handleRevert} label="revert()" disabled={isReverted} danger />
          <ControlButton onClick={() => handleSeek('50%')} label="seek('50%')" disabled={isReverted} />
          <ControlButton onClick={() => controls.stretch(10000)} label="stretch(10s)" disabled={isReverted} />
        </div>

        <div className="mt-2 px-4 py-2 bg-[#050508] border border-[#2a2a3a] rounded-lg font-mono text-[10px] text-[#555] flex justify-between">
           <span>Status: {isReverted ? "REVERTED" : isReady ? (isRunning ? "PLAYING" : "PAUSED") : "NOT READY"} {state.reversed ? "(REVERSED)" : ""}</span>
           <span>Duration: 5s</span>
        </div>
      </div>
    </DemoSection>
  );
}

function ControlButton({ 
  onClick, 
  label, 
  disabled = false, 
  primary = false,
  danger = false
}: { 
  onClick: () => void; 
  label: string; 
  disabled?: boolean;
  primary?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      className={`px-2 py-2 text-[10px] font-mono font-bold uppercase tracking-tighter rounded border transition-all active:scale-95 disabled:opacity-20 disabled:pointer-events-none ${
        primary 
          ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500" 
          : danger
            ? "bg-red-950/20 border-red-900/50 text-red-500 hover:bg-red-900/40"
            : "bg-[#1e1e2a] border-[#2a2a3a] text-[#aaa] hover:text-white hover:bg-[#2a2a3a]"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
