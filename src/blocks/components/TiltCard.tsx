/**
 * TiltCard — a card that tilts in 3D based on pointer position.
 *
 * Pointer position over the card maps to `rotateX`/`rotateY` (and a parallax
 * glare that follows the cursor). The animation is driven by `useAnimatable`
 * — the library's cursor-event hook — whose property setters (`rotateX(value)`,
 * `rotateY(value)`) ease toward each new value without per-frame React state
 * churn. On pointer leave, the setters are fed 0 to spring the card level.
 *
 * `perspective` lives on the parent so the child's rotate reads as 3D depth.
 */
import {
  memo,
  type PointerEvent as ReactPointerEvent,
  useCallback,
} from 'react';
import { useAnimatable } from '@/lib/react-animejs';

const MAX_TILT = 12; // max degrees of rotation
const EASE_MS = 300; // how snappy the tilt follows / resets

export const TiltCard = memo(function TiltCard({ className = '' }: { className?: string }) {
  // `useAnimatable` exposes reactive setters for each registered property.
  // Feeding them values on pointermove eases the card toward the target.
  // The ref is attached directly to the card so its rotate is what we see.
  const { ref, animatable } = useAnimatable<HTMLDivElement>({
    rotateX: { to: 0, duration: EASE_MS, ease: 'outQuad' },
    rotateY: { to: 0, duration: EASE_MS, ease: 'outQuad' },
    '--glare-x': { to: 50, unit: '%', duration: EASE_MS, ease: 'outQuad' },
    '--glare-y': { to: 50, unit: '%', duration: EASE_MS, ease: 'outQuad' },
  } as any);

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      const a = animatable.current;
      if (!el || !a) return;
      const rect = el.getBoundingClientRect();
      // Normalize cursor to [-1, 1] across the card.
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const ry = (px - 0.5) * 2 * MAX_TILT; // horizontal move → rotateY
      const rx = -(py - 0.5) * 2 * MAX_TILT; // vertical move → rotateX (inverted: up tilts back)

      const rotateX = a.rotateX as (v: number, d?: number) => void;
      const rotateY = a.rotateY as (v: number, d?: number) => void;
      const glareX = (a as any)['--glare-x'] as ((v: number, d?: number) => void) | undefined;
      const glareY = (a as any)['--glare-y'] as ((v: number, d?: number) => void) | undefined;

      rotateX(rx, EASE_MS);
      rotateY(ry, EASE_MS);
      glareX?.(px * 100, EASE_MS);
      glareY?.(py * 100, EASE_MS);
    },
    [animatable, ref],
  );

  const handleLeave = useCallback(() => {
    const a = animatable.current;
    if (!a) return;
    const rotateX = a.rotateX as (v: number, d?: number) => void;
    const rotateY = a.rotateY as (v: number, d?: number) => void;
    const glareX = (a as any)['--glare-x'] as ((v: number, d?: number) => void) | undefined;
    const glareY = (a as any)['--glare-y'] as ((v: number, d?: number) => void) | undefined;
    rotateX(0, EASE_MS);
    rotateY(0, EASE_MS);
    glareX?.(50, EASE_MS);
    glareY?.(50, EASE_MS);
  }, [animatable]);

  return (
    <div
      className={`relative rounded-2xl border border-landing-border/60 bg-landing-surface/40 p-8 ${className}`}
      style={{ perspective: 900, minHeight: 360 }}
    >
      {/* The card itself is the animatable target — its rotateX/rotateY tilt it. */}
      <div
        ref={ref}
        className="relative mx-auto flex h-72 w-full max-w-sm cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-landing-border bg-linear-to-br from-landing-accent/25 to-landing-accent-dim/20 shadow-2xl shadow-landing-accent/20"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(0deg) rotateY(0deg)' }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handleLeave}
      >
        {/* Content lifted toward the viewer for parallax depth. */}
        <div
          className="relative z-10 flex flex-col items-center gap-3 text-center"
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className="text-5xl">✦</div>
          <p className="landing-font-display text-lg font-bold text-landing-fg">Hover me</p>
          <p className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted">
            rotateX · rotateY · useAnimatable
          </p>
        </div>

        {/* Glare overlay — radial highlight positioned via the animated CSS vars. */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay"
          style={{
            background:
              'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.4), transparent 55%)',
          }}
        />
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          move the cursor · card tilts in 3D
        </span>
      </div>
    </div>
  );
});

export default TiltCard;
