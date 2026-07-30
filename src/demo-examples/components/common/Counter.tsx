import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnime } from '@shakibdshy/react-animejs';

export interface CounterProps {
  /** Starting value */
  from?: number;
  /** Ending value (inclusive) */
  to?: number;
  /** Total duration of the count in ms */
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

/**
 * Counter — smoothly tweens from `from` to `to` using a single continuous
 * anime.js animation over a plain object, writing the interpolated value to the
 * DOM via a ref on each frame. This avoids the per-integer React remounts that
 * make stepped counters choppy, and produces a clean odometer-style roll.
 */
export function Counter({
  from = 0,
  to = 100,
  duration = 1500,
  autoplay = false,
  loop = false,
  onTick,
  onComplete,
  format = 'integer',
  label,
  className = '',
  size = 'md',
}: CounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  });

  // The animated value lives on a stable plain object so anime.js mutates it
  // in place every frame; we read it back in onUpdate.
  const target = useMemo(() => ({ val: from }), [from]);

  const maxDigits = String(Math.abs(to)).length;
  const writeValue = useCallback(
    (val: number) => {
      const text =
        format === 'padded' ? String(Math.round(val)).padStart(maxDigits, '0') : String(Math.round(val));
      if (spanRef.current) spanRef.current.textContent = text;
    },
    [format, maxDigits]
  );

  const { controls, state } = useAnime({
    targets: target,
    val: to,
    duration,
    round: 1,
    loop: loop === true ? true : loop === false ? false : loop,
    ease: 'outExpo',
    autoplay,
    onUpdate: () => {
      writeValue(target.val);
      onTickRef.current?.(Math.round(target.val));
    },
    onComplete: () => {
      writeValue(to);
      onCompleteRef.current?.();
    },
  });

  // Keep the displayed value in sync if `from`/`to` change without a restart.
  useEffect(() => {
    writeValue(from);
  }, [from, writeValue]);

  const [hasStarted, setHasStarted] = useState(autoplay);
  const isRunning = state.began && !state.paused && !state.completed;
  const isComplete = !loop && state.completed;

  const handleStart = useCallback(() => {
    setHasStarted(true);
    controls.restart();
  }, [controls]);

  const handlePause = useCallback(() => controls.pause(), [controls]);
  const handleResume = useCallback(() => controls.play(), [controls]);

  const handleReset = useCallback(() => {
    controls.reset();
    writeValue(from);
    setHasStarted(false);
  }, [controls, from, writeValue]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <span
        ref={spanRef}
        className={`landing-font-mono font-black text-landing-accent tabular-nums ${sizeMap[size]}`}
        style={{ textShadow: '0 0 18px color-mix(in oklch, var(--landing-accent) 30%, transparent)' }}
      >
        {format === 'padded' ? String(from).padStart(maxDigits, '0') : from}
      </span>

      {label && (
        <span className="landing-font-mono text-[9px] text-landing-muted uppercase tracking-[0.2em]">
          {label}
        </span>
      )}

      <div className="flex gap-2 mt-1">
        {!hasStarted || isComplete ? (
          <button
            onClick={handleStart}
            className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-accent text-landing-bg rounded-lg hover:brightness-110 transition-all"
          >
            {isComplete ? 'Restart' : 'Start'}
          </button>
        ) : isRunning ? (
          <button
            onClick={handlePause}
            className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-surface border border-landing-border text-landing-fg rounded-lg hover:border-landing-accent/40 hover:text-landing-accent transition-all"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={handleResume}
            className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-accent text-landing-bg rounded-lg hover:brightness-110 transition-all"
          >
            Resume
          </button>
        )}
        {hasStarted && (
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-surface border border-landing-border text-landing-muted rounded-lg hover:text-landing-fg transition-all"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default Counter;
