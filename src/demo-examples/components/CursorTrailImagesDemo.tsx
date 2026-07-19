/**
 * CursorTrailImagesDemo — a spawn-and-fade image particle trail.
 *
 * On each pointermove a new <img> (picked from a predefined set) is spawned at
 * the cursor position, then animated with react-animejs: a quick zoom-in, a
 * zoom-out, and an opacity fade. After ~1s the element removes itself from the
 * DOM.
 *
 *   1. New image spawned at the cursor on each move.
 *   2. Zoom-in then zoom-out (scale), combined with opacity fade.
 *   3. Each image lives a short duration, then fades out and is removed.
 *   4. Fast cursor movement leaves many images visible at once → trail.
 *   5. Spawn is throttled + capped; elements self-clean on animation complete.
 *   6. CSS for absolute / pointer-events-none positioning; react-animejs for the
 *      scale + opacity transitions.
 *   7. Natural, realistic zooming-image trail.
 *
 * Every particle is driven by the library's declarative `<Anime>` component.
 * The trick to making `<Anime>` work on a hot spawn path is that
 * `useAnime` only re-initializes when its serialized props change
 * (`safeJsonStringify`) — and that serializer renders functions as the stable
 * string `[Function]`, so callback identity is irrelevant. Therefore all the
 * *numeric* keyframe values (scale peaks, rotation target, etc.) are computed
 * ONCE at spawn time and frozen on the particle object. Every render then
 * produces an identical serialized string, so `<Anime>` initializes exactly
 * once and the animation fires the instant the particle mounts — no starvation.
 */
import {
  memo,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Anime } from '@/lib/react-animejs';

/** Predefined set of images cycled through as the cursor moves. */
const IMAGES = [
  '/tanstack-circle-logo.png',
  '/logo512.png',
  '/logo192.png',
  '/tanstack-word-logo-white.svg',
];

const MAX_ACTIVE = 30; // cap concurrent particles for smooth performance
const SPAWN_INTERVAL_MS = 35; // min ms between spawns (throttle)
const LIFETIME_MS = 1000; // how long each image stays before fading out
const BASE_SIZE = 40; // px

interface Particle {
  id: number;
  src: string;
  x: number;
  y: number;
  // All numeric animation targets, frozen at spawn so `<Anime>`'s serialized
  // props never change between renders (no re-init / no starvation).
  /** peak scale during the zoom-in phase. */
  scalePeak: number;
  /** end scale during the zoom-out phase. */
  scaleEnd: number;
  /** starting rotation (deg). */
  rotateFrom: number;
  /** ending rotation (deg). */
  rotateTo: number;
}

export interface CursorTrailImagesDemoProps {
  /** Override the predefined image set (URLs or /public paths). */
  images?: string[];
  /** Extra class on the interactive area. */
  className?: string;
}

export const CursorTrailImagesDemo = memo(function CursorTrailImagesDemo({
  images = IMAGES,
  className = '',
}: CursorTrailImagesDemoProps) {
  // Live particle list. Kept in a ref for fast mutation on the pointer path,
  // mirrored to state only to trigger re-renders.
  const idRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const [, setTick] = useState(0);

  const removeParticle = useCallback((id: number) => {
    const arr = particlesRef.current;
    const idx = arr.findIndex((p) => p.id === id);
    if (idx === -1) return;
    arr.splice(idx, 1);
    setTick((n) => n + 1);
  }, []);

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const now =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
      // Throttle: skip if we spawned too recently.
      if (now - lastSpawnRef.current < SPAWN_INTERVAL_MS) return;
      lastSpawnRef.current = now;

      const rect = e.currentTarget.getBoundingClientRect();
      const s = 0.75 + Math.random() * 0.35;
      const rotateFrom = (Math.random() - 0.5) * 30;
      const particle: Particle = {
        id: ++idRef.current,
        src: images[(idRef.current - 1) % images.length],
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        scalePeak: s * 1.15,
        scaleEnd: s * 0.2,
        rotateFrom,
        rotateTo: rotateFrom + (Math.random() - 0.5) * 40,
      };

      const arr = particlesRef.current;
      arr.push(particle);
      // Cap: if over the limit, drop the oldest.
      if (arr.length > MAX_ACTIVE) arr.shift();
      setTick((n) => n + 1);
    },
    [images],
  );

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`relative overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-surface/40 cursor-crosshair ${className}`}
      style={{ minHeight: 360 }}
    >
      {/* Hint */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
        <span className="landing-font-display text-sm text-landing-fg/80">Move your cursor</span>
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          spawn · zoom-in / zoom-out · fade
        </span>
      </div>

      {/* Particle layer — one absolutely-positioned <img> per active particle.
          Each Particle animates itself and self-removes on completion. */}
      <div className="absolute inset-0 pointer-events-none">
        {particlesRef.current.map((p) => (
          <Particle key={p.id} particle={p} onDone={() => removeParticle(p.id)} />
        ))}
      </div>
    </div>
  );
});

/**
 * A single spawned image, animated entirely with the library's `<Anime>`
 * component. Because every numeric keyframe value is frozen on the particle at
 * spawn time, `<Anime>`'s prop-serialization dependency is stable across the
 * parent's re-renders — so the animation initializes exactly once and fires
 * immediately on mount.
 */
const Particle = memo(function Particle({
  particle,
  onDone,
}: {
  particle: Particle;
  onDone: () => void;
}) {
  // Backstop: guarantee removal even if the animation stalls.
  const doneRef = useRef(false);
  const handleComplete = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  return (
    <div
      className="absolute select-none"
      style={{
        left: particle.x,
        top: particle.y,
        width: BASE_SIZE,
        height: BASE_SIZE,
        marginLeft: -BASE_SIZE / 2,
        marginTop: -BASE_SIZE / 2,
        pointerEvents: 'none',
      }}
    >
      <Anime
        autoplay
        duration={LIFETIME_MS}
        ease="outQuad"
        onComplete={handleComplete}
        scale={[
          { to: 0, duration: 0 },
          { to: particle.scalePeak, duration: LIFETIME_MS * 0.35, ease: 'outQuad' },
          { to: particle.scaleEnd, duration: LIFETIME_MS * 0.65, ease: 'inQuad' },
        ]}
        opacity={[
          { to: 1, duration: LIFETIME_MS * 0.25 },
          { to: 0, duration: LIFETIME_MS * 0.75, ease: 'inQuad' },
        ]}
        rotate={[particle.rotateFrom, particle.rotateTo]}
      >
        <img
          src={particle.src}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            // Start invisible + scale 0; `<Anime>`'s leading {to:0,duration:0}
            // keyframe makes the first frame deterministic.
            opacity: 0,
            transform: 'scale(0)',
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}
        />
      </Anime>
    </div>
  );
});

export default CursorTrailImagesDemo;
