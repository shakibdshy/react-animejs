import { useState, useCallback, useRef } from 'react';
import { Animate } from '../lib/react-animejs/components/Animate';
import type { PlaybackControls } from '../lib/react-animejs/types';

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
        to: 'circle(75% at 50% 50%)',
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
      <Animate
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
        <div className="relative overflow-hidden">{children}</div>
      </Animate>

      <div className="flex gap-2">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#ffd11a] text-[#12121a] rounded-lg hover:bg-[#ffd11a]/90 transition-colors"
          >
            Play
          </button>
        ) : (
          <button
            onClick={handleReverse}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-[#e0e0e0] rounded-lg hover:bg-[#3a3a4a] transition-colors"
          >
            Reverse
          </button>
        )}
        <button
          onClick={handlePlay}
          className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#2a2a3a] text-slate-400 rounded-lg hover:bg-[#3a3a4a] hover:text-[#e0e0e0] transition-colors"
        >
          Restart
        </button>
      </div>
    </div>
  );
}

export default ClipPathReveal;
