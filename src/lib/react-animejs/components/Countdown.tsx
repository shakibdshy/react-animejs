import { useState, useCallback, useRef, useEffect } from "react";
import { Animate } from "./Animate";

export interface CountdownProps {
  /** Starting value (seconds) */
  from: number;
  /** Whether to auto-play on mount */
  autoplay?: boolean;
  /** Callback on each tick */
  onTick?: (remaining: number) => void;
  /** Callback when countdown reaches zero */
  onComplete?: () => void;
  /** Format: seconds, mm:ss, hh:mm:ss */
  format?: "seconds" | "mm:ss" | "hh:mm:ss";
  /** Label displayed below */
  label?: string;
  /** Custom className */
  className?: string;
  /** Font size class */
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "text-3xl",
  md: "text-5xl",
  lg: "text-7xl",
  xl: "text-9xl",
};

function formatTime(seconds: number, format: CountdownProps["format"]): string {
  switch (format) {
    case "hh:mm:ss": {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    case "mm:ss": {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    case "seconds":
    default:
      return String(seconds);
  }
}

export function Countdown({
  from,
  autoplay = false,
  onTick,
  onComplete,
  format = "seconds",
  label,
  className = "",
  size = "md",
}: CountdownProps) {
  const [remaining, setRemaining] = useState(from);
  const [isRunning, setIsRunning] = useState(autoplay);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(from);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const next = remainingRef.current - 1;
    if (next <= 0) {
      remainingRef.current = 0;
      setRemaining(0);
      setIsRunning(false);
      setIsComplete(true);
      stopInterval();
      onTick?.(0);
      onComplete?.();
      return;
    }
    remainingRef.current = next;
    setRemaining(next);
    onTick?.(next);
  }, [onTick, onComplete, stopInterval]);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(tick, 1000);
  }, [tick, stopInterval]);

  useEffect(() => {
    if (isRunning) {
      startInterval();
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [isRunning, startInterval, stopInterval]);

  useEffect(() => {
    if (autoplay) {
      setIsRunning(true);
    }
  }, [autoplay]);

  const handleStart = useCallback(() => {
    remainingRef.current = from;
    setRemaining(from);
    setIsComplete(false);
    setIsRunning(true);
  }, [from]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleResume = useCallback(() => {
    if (remainingRef.current > 0) {
      setIsRunning(true);
    }
  }, []);

  const handleReset = useCallback(() => {
    stopInterval();
    remainingRef.current = from;
    setRemaining(from);
    setIsRunning(false);
    setIsComplete(false);
  }, [from, stopInterval]);

  const displayValue = formatTime(remaining, format);
  const progress = from > 0 ? (from - remaining) / from : 0;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative overflow-hidden">
        <Animate
          autoplay
          key={remaining}
          duration={400}
          ease="outCubic"
          translateY={[-8, 0]}
          opacity={[0, 1]}
        >
          <span
            className={`font-mono font-black text-[#ff4d6a] tabular-nums ${sizeMap[size]}`}
          >
            {displayValue}
          </span>
        </Animate>
      </div>

      {/* Progress ring */}
      <div className="w-full max-w-50 h-1 bg-[#2a2a3a] rounded-full overflow-hidden mt-1">
        <Animate
          autoplay
          duration={300}
          ease="outCubic"
          width={`${progress * 100}%`}
        >
          <div
            className="h-full bg-[#ff4d6a] shadow-[0_0_10px_rgba(255,77,106,0.5)] rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </Animate>
      </div>

      {label && (
        <span className="text-xs text-slate-500 uppercase tracking-widest">
          {label}
        </span>
      )}

      <div className="flex gap-2 mt-2">
        {!isRunning && (remaining === from || isComplete) ? (
          <button
            onClick={handleStart}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ff4d6a] text-white rounded-lg hover:bg-[#ff4d6a]/90 transition-colors"
          >
            {isComplete ? "Restart" : "Start"}
          </button>
        ) : isRunning ? (
          <button
            onClick={handlePause}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-[#e0e0e0] rounded-lg hover:bg-[#3a3a4a] transition-colors"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={handleResume}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ff4d6a] text-white rounded-lg hover:bg-[#ff4d6a]/90 transition-colors"
          >
            Resume
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-slate-400 rounded-lg hover:bg-[#3a3a4a] hover:text-[#e0e0e0] transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Countdown;
