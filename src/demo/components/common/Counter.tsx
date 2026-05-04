import { useState, useCallback, useRef } from 'react';
import { Anime } from '@/lib/react-animejs/components/Anime';
import { useAnimeTimer } from '@/lib/react-animejs/hooks/use-anime-timer';

export interface CounterProps {
  /** Starting value */
  from?: number;
  /** Ending value (inclusive) */
  to?: number;
  /** Duration per step in ms */
  duration?: number;
  /** Whether to auto-play on mount */
  autoplay?: boolean;
  /** Loop the counter */
  loop?: boolean | number;
  /** Callback on each tick */
  onTick?: (value: number) => void;
  /** Callback when counter completes */
  onComplete?: () => void;
  /** Number format: integer, padded, etc. */
  format?: 'integer' | 'padded';
  /** Label displayed below the counter */
  label?: string;
  /** Custom className */
  className?: string;
  /** Font size class */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-7xl',
  xl: 'text-9xl',
};

export function Counter({
  from = 0,
  to = 100,
  duration = 1000,
  autoplay = false,
  loop = false,
  onTick,
  onComplete,
  format = 'integer',
  label,
  className = '',
  size = 'md',
}: CounterProps) {
  const [value, setValue] = useState(from);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const prevValueRef = useRef(from);
  const tickCountRef = useRef(0);

  const totalSteps = Math.abs(to - from);
  const direction = to >= from ? 1 : -1;

  const { controls, state } = useAnimeTimer({
    duration,
    loop: loop === true ? true : loop === false ? totalSteps : loop,
    autoplay,
    trackLoopCount: true,
    onLoop: () => {
      tickCountRef.current += 1;
      const nextValue = from + tickCountRef.current * direction;

      if ((direction > 0 && nextValue > to) || (direction < 0 && nextValue < to)) {
        return;
      }

      prevValueRef.current = value;
      setValue(nextValue);
      onTick?.(nextValue);

      if (nextValue === to) {
        setIsComplete(true);
        onComplete?.();
      }
    },
    onComplete: () => {
      if (loop === false) {
        setIsComplete(true);
        setValue(to);
        onComplete?.();
      }
    },
  });

  const handleStart = useCallback(() => {
    tickCountRef.current = 0;
    setValue(from);
    prevValueRef.current = from;
    setHasStarted(true);
    setIsComplete(false);
    controls.restart();
  }, [controls, from]);

  const handlePause = useCallback(() => {
    controls.pause();
  }, [controls]);

  const handleResume = useCallback(() => {
    controls.resume();
  }, [controls]);

  const handleReset = useCallback(() => {
    tickCountRef.current = 0;
    setValue(from);
    prevValueRef.current = from;
    setHasStarted(false);
    setIsComplete(false);
    controls.reset();
  }, [controls, from]);

  const formatValue = (val: number): string => {
    if (format === 'padded') {
      const maxDigits = String(Math.abs(to)).length;
      return String(val).padStart(maxDigits, '0');
    }
    return String(val);
  };

  const displayValue = formatValue(value);
  const isRunning = !state.paused && state.began && !state.completed;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative overflow-hidden">
        <Anime
          autoplay
          key={value}
          duration={duration * 0.6}
          ease="outCubic"
          translateY={[8, 0]}
          opacity={[0, 1]}
        >
          <span className={`font-mono font-black text-demo-accent tabular-nums ${sizeMap[size]}`}>
            {displayValue}
          </span>
        </Anime>
      </div>

      {label && <span className="text-xs text-demo-text-muted uppercase tracking-widest">{label}</span>}

      <div className="flex gap-2 mt-2">
        {!hasStarted || isComplete ? (
          <button
            onClick={handleStart}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-demo-accent text-demo-bg rounded-lg hover:bg-demo-accent/90 transition-colors"
          >
            {isComplete ? 'Restart' : 'Start'}
          </button>
        ) : isRunning ? (
          <button
            onClick={handlePause}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-demo-border text-demo-text rounded-lg hover:bg-demo-border-hover transition-colors"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={handleResume}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-demo-accent text-demo-bg rounded-lg hover:bg-demo-accent/90 transition-colors"
          >
            Resume
          </button>
        )}
        {hasStarted && (
          <button
            onClick={handleReset}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-demo-border text-demo-text-secondary rounded-lg hover:bg-demo-border-hover hover:text-demo-text transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default Counter;
