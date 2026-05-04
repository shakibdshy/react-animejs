import { useCallback, useRef, useState } from "react";
import { useAnimeTimer } from "@/lib/react-animejs";
import { DemoSection } from "./DemoSection";

export function PlaybackRateDemo() {
  const currentTimeRef = useRef<HTMLSpanElement>(null);
  const playbackRateDisplayRef = useRef<HTMLSpanElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  const handleUpdate = useCallback((t: any) => {
    if (currentTimeRef.current) {
      currentTimeRef.current.textContent = String(Math.round(t.currentTime));
    }
  }, []);

  const { controls, isRunning } = useAnimeTimer({
    duration: 10000,
    playbackRate: 0.1,
    onUpdate: handleUpdate,
  });

  const handlePlaybackRateChange = useCallback((value: number) => {
    setPlaybackRate(value);
    controls.setPlaybackRate(value);
    if (playbackRateDisplayRef.current) {
      playbackRateDisplayRef.current.textContent = `${value.toFixed(1)}x`;
    }
  }, [controls]);

  const presetRates = [0.5, 1, 2];

  return (
    <DemoSection title="Playback Rate Control">
      <div className="flex gap-12 w-full justify-center">
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

        <div className="flex flex-col items-center gap-2 p-6 bg-demo-bg border border-demo-border rounded-lg">
          <span className="text-xs uppercase tracking-widest text-demo-text-secondary font-bold">
            playback rate
          </span>
          <span
            ref={playbackRateDisplayRef}
            className="text-6xl font-bold text-green-500"
          >
            1.0x
          </span>
        </div>
      </div>

      <div className="mt-8 w-full">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs uppercase tracking-widest text-demo-text-secondary font-bold whitespace-nowrap">
            Speed Control
          </span>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={playbackRate}
            onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
            className="flex-1 h-2 bg-demo-card rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-sm font-mono text-indigo-400 font-bold min-w-[60px] text-right">
            {playbackRate.toFixed(1)}x
          </span>
        </div>

        <div className="flex gap-2 justify-center mb-4">
          {presetRates.map((rate) => (
            <button
              key={rate}
              onClick={() => handlePlaybackRateChange(rate)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                playbackRate === rate
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-demo-card border border-demo-border text-demo-text-muted hover:text-white"
              }`}
            >
              {rate}x
            </button>
          ))}
          <button
            onClick={() => handlePlaybackRateChange(1)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-demo-card border border-demo-border text-demo-text-muted hover:text-white rounded-lg transition-all"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transition-all"
            onClick={controls.play}
            disabled={isRunning || playbackRate === 0}
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
      </div>
    </DemoSection>
  );
}
