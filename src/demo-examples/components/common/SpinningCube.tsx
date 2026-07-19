import { useCallback, useRef, useState } from 'react';
import { Anime } from '@/lib/react-animejs/components/Anime';
import type { AnimationState, PlaybackControls } from '@/lib/react-animejs/types';

export interface SpinningCubeProps {
  /** Cube size in px */
  size?: number;
  /** Spin duration in ms */
  duration?: number;
  /** Rotation axis: x, y, or both */
  axis?: 'x' | 'y' | 'both';
  /** Whether to auto-play on mount */
  autoplay?: boolean;
  /** Loop the rotation */
  loop?: boolean;
  /** Easing function */
  ease?: string;
  /** Callback on each loop */
  onLoop?: () => void;
  /** Show the Pause/Restart/Reverse controls (default true) */
  showControls?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Monochrome gold per-face lightness. A 3D cube reads depth from the
 * brightness gradient across faces, so we grade the accent opacity from the
 * front (brightest) to the back/receding faces (dimmest) rather than using
 * six unrelated hues.
 */
const FACE_SHADES = [
  { label: 'Front', alpha: 0.22 },
  { label: 'Right', alpha: 0.14 },
  { label: 'Top', alpha: 0.18 },
  { label: 'Left', alpha: 0.1 },
  { label: 'Bottom', alpha: 0.08 },
  { label: 'Back', alpha: 0.06 },
] as const;

const accentAlpha = (alpha: number) =>
  `color-mix(in oklch, var(--landing-accent) ${Math.round(alpha * 100)}%, transparent)`;

export function SpinningCube({
  size = 120,
  duration = 3000,
  axis = 'both',
  autoplay = false,
  loop = true,
  ease = 'inOutQuad',
  onLoop,
  showControls = true,
  className = '',
}: SpinningCubeProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const controlsRef = useRef<PlaybackControls | null>(null);

  const handleControlsReady = useCallback((controls: PlaybackControls) => {
    controlsRef.current = controls;
  }, []);

  const handlePause = useCallback(() => {
    controlsRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const handleResume = useCallback(() => {
    controlsRef.current?.resume();
    setIsPlaying(true);
  }, []);

  const handleRestart = useCallback(() => {
    controlsRef.current?.restart();
    setIsPlaying(true);
  }, []);

  const handleReverse = useCallback(() => {
    controlsRef.current?.reverse();
  }, []);

  const half = size / 2;

  const faceBase: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.14,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    backfaceVisibility: 'hidden',
    border: '1px solid color-mix(in oklch, var(--landing-accent) 35%, transparent)',
    color: 'var(--landing-accent)',
    boxShadow: 'inset 0 0 24px color-mix(in oklch, var(--landing-accent) 18%, transparent)',
    borderRadius: Math.max(4, size * 0.06),
  };

  const faces = [
    { ...FACE_SHADES[0], transform: `translateZ(${half}px)` },
    { ...FACE_SHADES[1], transform: `rotateY(90deg) translateZ(${half}px)` },
    { ...FACE_SHADES[2], transform: `rotateX(90deg) translateZ(${half}px)` },
    { ...FACE_SHADES[3], transform: `rotateY(-90deg) translateZ(${half}px)` },
    { ...FACE_SHADES[4], transform: `rotateX(-90deg) translateZ(${half}px)` },
    { ...FACE_SHADES[5], transform: `rotateY(180deg) translateZ(${half}px)` },
  ];

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {/* 3D Scene */}
      <div
        style={{
          perspective: size * 3,
          perspectiveOrigin: '50% 50%',
        }}
      >
        <Anime
          autoplay={autoplay}
          duration={duration}
          loop={loop}
          ease={ease}
          rotateX={axis === 'y' ? '-20deg' : '1turn'}
          rotateY={axis === 'x' ? '-30deg' : '1turn'}
          onControlsReady={handleControlsReady}
          onLoop={onLoop}
          onStateChange={(state: AnimationState) => {
            const running = !state.paused && state.began && !state.completed;
            setIsPlaying(running);
            if (state.completed && loop !== true) setIsPlaying(false);
          }}
        >
          <div
            style={{
              width: size,
              height: size,
              position: 'relative',
              transformStyle: 'preserve-3d',
            }}
          >
            {faces.map((face) => (
              <div
                key={face.label}
                style={{
                  ...faceBase,
                  transform: face.transform,
                  backgroundColor: accentAlpha(face.alpha),
                }}
              >
                {face.label}
              </div>
            ))}
          </div>
        </Anime>
      </div>

      {/* Controls */}
      {showControls && (
      <div className="flex gap-2">
        {isPlaying ? (
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
        <button
          onClick={handleRestart}
          className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-surface border border-landing-border text-landing-muted rounded-lg hover:text-landing-fg transition-all"
        >
          Restart
        </button>
        <button
          onClick={handleReverse}
          className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-surface border border-landing-border text-landing-muted rounded-lg hover:text-landing-fg transition-all"
        >
          Reverse
        </button>
      </div>
      )}
    </div>
  );
}

export default SpinningCube;
