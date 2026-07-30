import { useCallback, useRef, useState } from 'react';
import { Anime } from '@shakibdshy/react-animejs';
import type { PlaybackControls } from '@shakibdshy/react-animejs';

export type ClipPathShape = 'circle' | 'diamond' | 'horizontal' | 'vertical' | 'star';

export interface ClipPathRevealProps {
  /** Clip-path shape for the reveal */
  shape?: ClipPathShape;
  /** Animation duration in ms */
  duration?: number;
  /** Easing function */
  ease?: string;
  /** Whether to auto-play on mount */
  autoplay?: boolean;
  /** Loop the animation */
  loop?: boolean;
  /** Alternate direction on loop */
  alternate?: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Show the Play/Reverse/Restart controls (default true) */
  showControls?: boolean;
  /** Custom className for the wrapper */
  className?: string;
  /** Content to reveal */
  children: React.ReactNode;
}

function getClipPathValues(shape: ClipPathShape): { from: string; to: string } {
  switch (shape) {
    case 'circle':
      return {
        from: 'circle(0% at 50% 50%)',
        // 150% of closest-side reliably covers the corners of rectangular
        // content (75% left gaps on wide boxes). Overshooting is safe —
        // clip-path beyond the element bounds just reveals fully.
        to: 'circle(150% at 50% 50%)',
      };
    case 'diamond':
      return {
        from: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
        to: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      };
    case 'horizontal':
      return {
        from: 'inset(0% 50% 0% 50%)',
        to: 'inset(0% 0% 0% 0%)',
      };
    case 'vertical':
      return {
        from: 'inset(50% 0% 50% 0%)',
        to: 'inset(0% 0% 0% 0%)',
      };
    case 'star':
      return {
        from: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
        to: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      };
  }
}

export function ClipPathReveal({
  shape = 'circle',
  duration = 1200,
  ease = 'outCubic',
  autoplay = false,
  loop = false,
  alternate = false,
  onComplete,
  showControls = true,
  className = '',
  children,
}: ClipPathRevealProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const controlsRef = useRef<PlaybackControls | null>(null);
  const { from, to } = getClipPathValues(shape);

  const handleControlsReady = useCallback((controls: PlaybackControls) => {
    controlsRef.current = controls;
  }, []);

  const handlePlay = useCallback(() => {
    controlsRef.current?.restart();
    setIsPlaying(true);
  }, []);

  const handleReverse = useCallback(() => {
    controlsRef.current?.reverse();
    setIsPlaying(true);
  }, []);

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <Anime
        autoplay={autoplay}
        duration={duration}
        ease={ease}
        loop={loop}
        alternate={alternate}
        clipPath={[from, to]}
        onControlsReady={handleControlsReady}
        onComplete={() => {
          setIsPlaying(false);
          onComplete?.();
        }}
      >
        <div className="relative overflow-hidden w-full h-full">{children}</div>
      </Anime>

      {showControls && (
      <div className="flex gap-2">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-accent text-landing-bg rounded-lg hover:brightness-110 transition-all"
          >
            Play
          </button>
        ) : (
          <button
            onClick={handleReverse}
            className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-surface border border-landing-border text-landing-fg rounded-lg hover:border-landing-accent/40 hover:text-landing-accent transition-all"
          >
            Reverse
          </button>
        )}
        <button
          onClick={handlePlay}
          className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-landing-surface border border-landing-border text-landing-muted rounded-lg hover:text-landing-fg transition-all"
        >
          Restart
        </button>
      </div>
      )}
    </div>
  );
}

export default ClipPathReveal;
