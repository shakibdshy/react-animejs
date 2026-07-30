/**
 * CursorTrackingPreview — an image preview that tracks the cursor.
 *
 * A row of thumbnails. Hovering one shows a large preview window that follows
 * the pointer with spring-eased movement (it chases the cursor with a slight
 * lag, the premium-feeling "tracking" effect), and swaps its image to the
 * hovered thumbnail. Moving between thumbnails cross-fades the image.
 *
 * Driven entirely by react-animejs:
 *   - `useAnimatable` powers the preview's `translateX`/`translateY` (the
 *     library's cursor-event hook — each pointermove feeds the setters a new
 *     target and the hook eases toward it, no per-frame React state).
 *   - `<Anime>` cross-fades the image swap (opacity + tiny scale) so the
 *     preview never hard-cuts when you move between thumbnails.
 */
import { memo, type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from 'react';
import { Anime, useAnimatable } from '@shakibdshy/react-animejs';

interface Thumb {
  id: number;
  src: string;
  /** gradient class for a colored frame behind the logo (visual variety). */
  frame: string;
  label: string;
}

const THUMBS: Thumb[] = [
  {
    id: 1,
    src: '/tanstack-circle-logo.png',
    frame: 'from-orange-500/40 to-amber-400/30',
    label: 'Circle',
  },
  { id: 2, src: '/logo512.png', frame: 'from-sky-500/40 to-cyan-400/30', label: 'Logo 512' },
  { id: 3, src: '/logo192.png', frame: 'from-violet-500/40 to-fuchsia-400/30', label: 'Logo 192' },
  {
    id: 4,
    src: '/tanstack-word-logo-white.svg',
    frame: 'from-emerald-500/40 to-teal-400/30',
    label: 'Wordmark',
  },
];

const PREVIEW_SIZE = 280; // px
const FOLLOW_MS = 180; // ease duration for the chase — a touch of lag

export const CursorTrackingPreview = memo(function CursorTrackingPreview({
  className = '',
}: {
  className?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [shownId, setShownId] = useState<number | null>(null);

  // The preview window chases the cursor via useAnimatable translate setters.
  const { ref: previewRef, animatable } = useAnimatable<HTMLDivElement>({
    translateX: { to: 0, duration: FOLLOW_MS, ease: 'outExpo' },
    translateY: { to: 0, duration: FOLLOW_MS, ease: 'outExpo' },
  });

  const moveTo = useCallback(
    (clientX: number, clientY: number) => {
      const stage = stageRef.current;
      const a = animatable.current;
      if (!stage || !a) return;
      const rect = stage.getBoundingClientRect();
      // Center the preview on the cursor, in stage-relative coords.
      const x = clientX - rect.left - PREVIEW_SIZE / 2;
      const y = clientY - rect.top - PREVIEW_SIZE / 2;
      const tx = a.translateX as (v: number, d?: number) => void;
      const ty = a.translateY as (v: number, d?: number) => void;
      tx(x, FOLLOW_MS);
      ty(y, FOLLOW_MS);
    },
    [animatable]
  );

  const handleStageMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      // Only chase while a thumbnail is hovered.
      if (activeId !== null) moveTo(e.clientX, e.clientY);
    },
    [activeId, moveTo]
  );

  const handleThumbEnter = useCallback(
    (thumb: Thumb, e: ReactPointerEvent<HTMLButtonElement>) => {
      setActiveId(thumb.id);
      setShownId(thumb.id);
      moveTo(e.clientX, e.clientY);
    },
    [moveTo]
  );

  const handleStageLeave = useCallback(() => {
    setActiveId(null);
  }, []);

  const shown = THUMBS.find((t) => t.id === shownId) ?? null;
  const isVisible = activeId !== null;

  return (
    <div
      ref={stageRef}
      onPointerMove={handleStageMove}
      onPointerLeave={handleStageLeave}
      className={`relative flex flex-col items-center gap-6 rounded-2xl border border-landing-border/60 bg-landing-surface/40 p-8 ${className}`}
      style={{ minHeight: 360 }}
    >
      {/* Thumbnails */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {THUMBS.map((t) => (
          <button
            key={t.id}
            onPointerEnter={(e) => handleThumbEnter(t, e)}
            onPointerMove={(e) => moveTo(e.clientX, e.clientY)}
            onFocus={() => {
              setActiveId(t.id);
              setShownId(t.id);
            }}
            onBlur={() => setActiveId(null)}
            className={`relative flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br ${t.frame} border transition-all duration-200 ${
              activeId === t.id
                ? 'border-landing-accent scale-105 shadow-lg shadow-landing-accent/20'
                : 'border-landing-border hover:border-landing-muted'
            }`}
            aria-label={`Preview ${t.label}`}
          >
            <img src={t.src} alt={t.label} draggable={false} className="h-9 w-9 object-contain" />
          </button>
        ))}
      </div>

      <p className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted/70">
        hover a thumbnail · preview tracks the cursor
      </p>

      {/* Tracking preview — sits under the cursor and chases it via useAnimatable
          (its ref is the animatable target). Visibility is toggled with a CSS
          opacity transition so show/hide is smooth; the image swap cross-fades
          with <Anime>. */}
      <div
        ref={previewRef}
        className="pointer-events-none absolute left-0 top-0 z-30 overflow-hidden rounded-2xl border border-landing-border bg-landing-bg shadow-2xl shadow-landing-accent/20"
        style={{
          width: PREVIEW_SIZE,
          height: PREVIEW_SIZE,
          opacity: isVisible ? 1 : 0,
          transition: isVisible ? 'opacity 220ms ease-out' : 'opacity 180ms ease-in 80ms',
        }}
      >
        {shown && (
          <Anime
            key={shown.id}
            autoplay
            duration={260}
            ease="outQuad"
            opacity={[
              { to: 0, duration: 0 },
              { to: 1, duration: 260 },
            ]}
            scale={[
              { to: 0.96, duration: 0 },
              { to: 1, duration: 260 },
            ]}
          >
            <div
              className={`relative flex h-full w-full items-center justify-center bg-linear-to-br ${shown.frame}`}
            >
              <img
                src={shown.src}
                alt={shown.label}
                draggable={false}
                className="h-2/3 w-2/3 object-contain drop-shadow-xl"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-landing-bg/80 px-2.5 py-1 landing-font-mono text-[9px] tracking-widest uppercase text-landing-muted">
                {shown.label}
              </span>
            </div>
          </Anime>
        )}
      </div>
    </div>
  );
});

export default CursorTrackingPreview;
