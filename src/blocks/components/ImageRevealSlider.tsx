/**
 * ImageRevealSlider — a before/after image reveal slider.
 *
 * A draggable handle splits two stacked images: the "before" layer is the full
 * bottom layer, the "after" layer is an overlay clipped by the handle position.
 * The reveal position is driven by `useAnimatable` (the library's cursor-event
 * hook): pointer input feeds a single 0–100% value into two animatable setters
 * — the overlay's `width` and the handle's `left` — so both ease in lockstep
 * without any per-frame React state, staying smooth even on fast drags.
 *
 * Pointer capture keeps the drag attached through fast flicks.
 */
import {
  memo,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
} from 'react';
import { useAnimatable } from '@/lib/react-animejs';

const EASE_MS = 90; // near-instant follow so drag feels direct, not laggy

export interface ImageRevealSliderProps {
  /** "Before" image (bottom layer, full width). */
  before?: string;
  /** "After" image (overlay layer, clipped by the handle). */
  after?: string;
  className?: string;
}

const DEFAULT_BEFORE = '/logo192.png';
const DEFAULT_AFTER = '/logo512.png';

export const ImageRevealSlider = memo(function ImageRevealSlider({
  before = DEFAULT_BEFORE,
  after = DEFAULT_AFTER,
  className = '',
}: ImageRevealSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const revealRef = useRef(50);

  // Two animatable targets share one logical value (the reveal %):
  //   - overlay.width clips the after image
  //   - handle.left  positions the divider + grip
  const { ref: overlayRef, animatable: overlayAnim } = useAnimatable<HTMLDivElement>({
    width: { to: 50, unit: '%', duration: EASE_MS, ease: 'outQuad' },
  });
  const { ref: handleRef, animatable: handleAnim } = useAnimatable<HTMLDivElement>({
    left: { to: 50, unit: '%', duration: EASE_MS, ease: 'outQuad' },
  });

  const setRevealPercent = useCallback(
    (percent: number) => {
      const ov = overlayAnim.current;
      const hd = handleAnim.current;
      if (!ov || !hd) return;
      const pct = Math.min(100, Math.max(0, percent));
      revealRef.current = pct;
      containerRef.current?.setAttribute('aria-valuenow', String(Math.round(pct)));
      containerRef.current?.setAttribute('aria-valuetext', `${Math.round(pct)}% after image revealed`);
      const width = ov.width as (v: number, d?: number) => void;
      const left = hd.left as (v: number, d?: number) => void;
      width(pct, EASE_MS);
      left(pct, EASE_MS);
    },
    [overlayAnim, handleAnim],
  );

  const setRevealFromPointer = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setRevealPercent(((clientX - rect.left) / rect.width) * 100);
    },
    [setRevealPercent],
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setRevealFromPointer(e.clientX);
    },
    [setRevealFromPointer],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      setRevealFromPointer(e.clientX);
    },
    [setRevealFromPointer],
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 10 : 1;
      let next: number | null = null;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = revealRef.current - step;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = revealRef.current + step;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = 100;
      if (next === null) return;
      e.preventDefault();
      setRevealPercent(next);
    },
    [setRevealPercent],
  );

  const handlePointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  }, []);

  return (
    <div
      className={`relative rounded-2xl border border-landing-border/60 bg-landing-surface/40 p-4 ${className}`}
      style={{ minHeight: 360 }}
    >
      <div
        ref={containerRef}
        className="relative mx-auto h-72 w-full max-w-xl cursor-ew-resize select-none overflow-hidden rounded-xl border border-landing-border bg-landing-bg touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent"
        role="slider"
        aria-label="Image comparison reveal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        aria-valuetext="50% after image revealed"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        {/* Before — full-width bottom layer. */}
        <div className="absolute inset-0 flex items-center justify-center bg-landing-surface">
          <img src={before} alt="Before" draggable={false} className="h-full w-full object-contain p-6" />
          <span className="absolute top-3 left-3 rounded-full bg-landing-bg/80 px-2.5 py-1 landing-font-mono text-[9px] tracking-widest uppercase text-landing-muted">
            Before
          </span>
        </div>

        {/* After — clipped overlay whose width is animated by useAnimatable.
            The inner image is sized to the container (not the narrowing
            overlay) so it doesn't squish as the handle drags. */}
        <div
          ref={overlayRef}
          className="absolute inset-y-0 left-0 overflow-hidden bg-landing-bg"
          style={{ width: '50%' }}
        >
          <div className="relative h-full w-screen max-w-xl">
            <img src={after} alt="After" draggable={false} className="h-full w-full object-contain p-6" />
            <span className="absolute top-3 right-3 rounded-full bg-landing-bg/80 px-2.5 py-1 landing-font-mono text-[9px] tracking-widest uppercase text-landing-accent">
              After
            </span>
          </div>
        </div>

        {/* Handle — its `left` is animated by a second useAnimatable, fed the
            same value as the overlay so they move together. */}
        <div
          ref={handleRef}
          className="pointer-events-none absolute top-0 bottom-0 z-20 flex items-center"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-landing-accent shadow-[0_0_12px_var(--landing-accent)]" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-landing-accent bg-landing-bg text-landing-accent shadow-lg">
            <span className="text-lg leading-none">⇆</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          drag the handle · reveal before / after
        </span>
      </div>
    </div>
  );
});

export default ImageRevealSlider;
