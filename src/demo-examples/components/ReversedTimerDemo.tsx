import { useCallback, useRef } from "react";
import { useAnimeTimer } from "@shakibdshy/react-animejs";
import { DemoSection } from "./DemoSection";

export function ReversedTimerDemo() {
  const iterationTimeRef = useRef<HTMLSpanElement>(null);
  const currentTimeRef = useRef<HTMLSpanElement>(null);

  const handleUpdate = useCallback((t: any) => {
    if (iterationTimeRef.current) {
      iterationTimeRef.current.textContent = String(Math.round(t.iterationCurrentTime));
    }
    if (currentTimeRef.current) {
      currentTimeRef.current.textContent = String(Math.round(t.currentTime));
    }
  }, []);

  const { controls, isRunning } = useAnimeTimer({
    duration: 10000,
    loop: false,
    reversed: true,
    autoplay: true,
    onUpdate: handleUpdate,
  });

  return (
    <DemoSection title="Reversed Timer">
      <div className="flex gap-12 w-full justify-center">
        <div className="flex flex-col items-center gap-2 p-6 bg-demo-bg border border-demo-border rounded-lg">
          <span className="text-xs uppercase tracking-widest text-demo-text-secondary font-bold">
            iteration time
          </span>
          <span
            ref={iterationTimeRef}
            className="text-6xl font-bold text-green-500"
          >
            0
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 p-6 bg-demo-bg border border-demo-border rounded-lg">
          <span className="text-xs uppercase tracking-widest text-demo-text-secondary font-bold">
            current time
          </span>
          <span
            ref={currentTimeRef}
            className="text-6xl font-bold text-indigo-400"
          >
            0
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mt-8">
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
    </DemoSection>
  );
}
