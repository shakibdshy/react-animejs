import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAnime } from '@shakibdshy/react-animejs';

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
  format?: 'seconds' | 'mm:ss' | 'hh:mm:ss';
  /** Label displayed below */
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

/** ms the reel takes to slide one digit. Tune for the "mechanical" feel. */
const REEL_SLIDE_MS = 450;

function formatParts(seconds: number, format: CountdownProps['format']): string {
  const s = Math.max(0, Math.round(seconds));
  switch (format) {
    case 'hh:mm:ss': {
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }
    case 'mm:ss': {
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    case 'seconds':
    default:
      return String(s);
  }
}

/**
 * A single digit column that slides like a mechanical odometer reel. Renders a
 * vertical strip of 0-9 and translates it so the active digit shows in the
 * window. CSS transitions handle the slide, so it stays cheap and in sync.
 */
function DigitReel({
  digit,
  sizeClass,
}: {
  digit: number;
  sizeClass: string;
}) {
  const clamped = Math.max(0, Math.min(9, digit));
  return (
    <span
      className={`inline-block overflow-hidden align-bottom ${sizeClass}`}
      style={{ lineHeight: 1, height: '1em', width: '0.62em' }}
      aria-hidden
    >
      <span
        className="flex flex-col will-change-transform"
        style={{
          transform: `translateY(-${clamped}em)`,
          transition: `transform ${REEL_SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d} style={{ lineHeight: 1, height: '1em' }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Splits a formatted time string into reels: numeric digits become
 * `<DigitReel>`s, separators (`:`) render as static spans.
 */
function OdometerTime({ parts, sizeClass }: { parts: string; sizeClass: string }): ReactNode {
  return (
    <span className="inline-flex items-baseline tabular-nums">
      {parts.split('').map((ch, i) =>
        /[0-9]/.test(ch) ? (
          <DigitReel key={i} digit={Number(ch)} sizeClass={sizeClass} />
        ) : (
          <span key={i} className={sizeClass} style={{ lineHeight: 1 }}>
            {ch}
          </span>
        )
      )}
    </span>
  );
}

/**
 * Countdown — counts down per second with a mechanical odometer reel display:
 * each digit slides vertically into place. A single continuous anime.js tween
 * remains the time engine (driving the progress bar and onTick); the reels
 * re-render only when the rounded second changes, so the slide is crisp.
 */
export function Countdown({
  from,
  autoplay = false,
  onTick,
  onComplete,
  format = 'seconds',
  label,
  className = '',
  size = 'md',
}: CountdownProps) {
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  });

  const target = useMemo(() => ({ val: from }), [from]);

  // The displayed integer second — updated only when it actually changes so
  // React re-renders ~once per second, not per animation frame.
  const [displaySecond, setDisplaySecond] = useState(from);

  const { controls, state } = useAnime({
    targets: target,
    val: 0,
    duration: from * 1000,
    round: 1,
    ease: 'linear',
    autoplay,
    onUpdate: () => {
      const sec = Math.round(target.val);
      setDisplaySecond((prev) => (prev !== sec ? sec : prev));
      onTickRef.current?.(sec);
    },
    onComplete: () => {
      setDisplaySecond(0);
      onCompleteRef.current?.();
    },
  });

  useEffect(() => {
    setDisplaySecond(from);
  }, [from]);

  const [hasStarted, setHasStarted] = useState(autoplay);
  const isRunning = state.began && !state.paused && !state.completed;
  const isComplete = state.completed;
  const progress = from > 0 ? state.progress : 0;

  const handleStart = useCallback(() => {
    setHasStarted(true);
    controls.restart();
  }, [controls]);

  const handlePause = useCallback(() => controls.pause(), [controls]);
  const handleResume = useCallback(() => controls.play(), [controls]);

  const handleReset = useCallback(() => {
    controls.reset();
    setDisplaySecond(from);
    setHasStarted(false);
  }, [controls, from]);

  const sizeClass = sizeMap[size];
  const parts = formatParts(displaySecond, format);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`landing-font-mono font-black text-landing-accent-dim ${sizeClass}`}
        style={{
          lineHeight: 1,
          textShadow: '0 0 18px color-mix(in oklch, var(--landing-accent-dim) 35%, transparent)',
        }}
      >
        <OdometerTime parts={parts} sizeClass={sizeClass} />
      </div>

      {/* Progress bar — driven by the animation's own progress (smooth per-frame) */}
      <div className="w-full max-w-50 h-1 bg-landing-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full will-change-[width]"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: 'var(--landing-accent-dim)',
            boxShadow: '0 0 8px color-mix(in oklch, var(--landing-accent-dim) 55%, transparent)',
          }}
        />
      </div>

      {label && (
        <span className="landing-font-mono text-[9px] text-landing-muted uppercase tracking-[0.2em]">
          {label}
        </span>
      )}

      <div className="flex gap-2 mt-1">
        {!hasStarted || isComplete ? (
          <button
            onClick={handleStart}
            className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-accent-dim text-landing-bg rounded-lg hover:brightness-110 transition-all"
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
            className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-accent-dim text-landing-bg rounded-lg hover:brightness-110 transition-all"
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

export default Countdown;
