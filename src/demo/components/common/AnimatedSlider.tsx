import { useState, useCallback, useRef } from 'react';
import {
  AnimePresence,
  AnimePresenceChild,
} from '@/lib/react-animejs/components/AnimePresence';

export type SlideDirection = 'left' | 'right';

export type SlideTransition = 'slide' | 'fade' | 'scale' | 'fade-slide' | 'flip';

export interface AnimatedSliderProps<T> {
  /** Array of slide data */
  items: T[];
  /** Render function for each slide */
  children: (item: T, index: number) => React.ReactNode;
  /** Transition style */
  transition?: SlideTransition;
  /** Animation duration in ms */
  duration?: number;
  /** Easing function */
  ease?: string;
  /** Whether to loop around at edges */
  loop?: boolean;
  /** Show navigation dots */
  dots?: boolean;
  /** Show left/right arrow buttons */
  arrows?: boolean;
  /** Custom className */
  className?: string;
}

const TRANSITIONS: Record<
  SlideTransition,
  { enter: Record<string, unknown>; exit: Record<string, unknown> }
> = {
  slide: {
    enter: { opacity: [0, 1], translateX: [80, 0] },
    exit: { opacity: [1, 0], translateX: [0, -80] },
  },
  fade: {
    enter: { opacity: [0, 1] },
    exit: { opacity: [1, 0] },
  },
  scale: {
    enter: { opacity: [0, 1], scale: [0.85, 1] },
    exit: { opacity: [1, 0], scale: [1, 0.85] },
  },
  'fade-slide': {
    enter: { opacity: [0, 1], translateY: [24, 0] },
    exit: { opacity: [1, 0], translateY: [0, -24] },
  },
  flip: {
    enter: { opacity: [0, 1], rotateY: [90, 0] },
    exit: { opacity: [1, 0], rotateY: [0, -90] },
  },
};

export function AnimatedSlider<T>({
  items,
  children,
  transition = 'slide',
  duration = 500,
  ease = 'outCubic',
  loop = true,
  dots = true,
  arrows = true,
  className = '',
}: AnimatedSliderProps<T>) {
  const [current, setCurrent] = useState(0);
  const directionRef = useRef<SlideDirection>('right');
  const count = items.length;
  if (count === 0) return null;

  const canGoLeft = loop || current > 0;
  const canGoRight = loop || current < count - 1;

  const goLeft = useCallback(() => {
    if (!canGoLeft) return;
    directionRef.current = 'left';
    setCurrent((c) => (c - 1 + count) % count);
  }, [canGoLeft, count]);

  const goRight = useCallback(() => {
    if (!canGoRight) return;
    directionRef.current = 'right';
    setCurrent((c) => (c + 1) % count);
  }, [canGoRight, count]);

  const goTo = useCallback(
    (index: number) => {
      directionRef.current = index > current ? 'right' : 'left';
      setCurrent(index);
    },
    [current]
  );

  const dir = directionRef.current;
  const config = TRANSITIONS[transition];

  // Adjust enter/exit directions based on navigation direction
  const enter = dir === 'right' ? config.enter : swapDirection(config.enter);
  const exit = dir === 'right' ? config.exit : swapDirection(config.exit);

  return (
    <div className={`flex flex-col items-center gap-6 w-full ${className}`}>
      {/* Slide viewport */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-[#2a2a3a] bg-[#12121a]">
        <div className="relative w-full min-h-60 flex items-center justify-center">
          <AnimePresence mode="sync">
            <AnimePresenceChild
              key={current}
              enter={enter}
              exit={exit}
              duration={duration}
              ease={ease}
            >
              <div className="w-full">{children(items[current], current)}</div>
            </AnimePresenceChild>
          </AnimePresence>
        </div>

        {/* Arrow buttons */}
        {arrows && (
          <>
            <button
              onClick={goLeft}
              disabled={!canGoLeft}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={goRight}
              disabled={!canGoRight}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {dots && count > 1 && (
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-[#ffd11a] shadow-[0_0_8px_rgba(255,209,26,0.5)] scale-125'
                  : 'bg-[#2a2a3a] hover:bg-[#3a3a4a]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Swap translateX / translateY / rotateY directions for reverse navigation */
function swapDirection(props: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (Array.isArray(value) && value.length === 2) {
      const negate = (v: number) => -v;
      if (key === 'translateX' || key === 'translateY') {
        result[key] = [
          typeof value[1] === 'number' ? negate(value[1] as number) : value[1],
          typeof value[0] === 'number' ? negate(value[0] as number) : value[0],
        ];
      } else if (key === 'rotateY') {
        result[key] = [
          typeof value[0] === 'number' ? negate(value[0] as number) : value[0],
          typeof value[1] === 'number' ? negate(value[1] as number) : value[1],
        ];
      } else {
        result[key] = value;
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}

export default AnimatedSlider;
