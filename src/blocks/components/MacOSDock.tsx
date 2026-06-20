/**
 * MacOSDock — the macOS-style dock with cursor-driven fisheye magnification.
 *
 * As the cursor travels across the dock, each icon scales up toward a peak the
 * closer the pointer gets to that icon's center, and lifts slightly. The
 * falloff is a smooth inverted-parabola so neighbors magnify a little too — the
 * signature "genie" wave.
 *
 * Driven entirely by react-animejs: every icon owns a `useAnimatable` for
 * `scale` and `translateY` (the library's cursor-event hook). On the dock's
 * `pointermove`, the parent computes each icon's target from the cursor distance
 * and feeds the setters — the hook eases toward each target, no per-frame React
 * state and smooth even on fast moves. Leaving the dock springs every icon back
 * to rest.
 *
 * Decoupling: icons register their setter into a parent-held ref map on mount,
 * so a single pointermove listener on the dock drives all icons (rather than N
 * listeners). Same pattern as the PointerCollisionGrid cells.
 */
import {
  memo,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useAnimatable } from '@/lib/react-animejs';

interface DockApp {
  id: string;
  /** emoji glyph standing in for the app icon. */
  icon: string;
  label: string;
}

const APPS: DockApp[] = [
  { id: 'finder', icon: '🧭', label: 'Finder' },
  { id: 'mail', icon: '✉️', label: 'Mail' },
  { id: 'music', icon: '🎵', label: 'Music' },
  { id: 'photos', icon: '🌅', label: 'Photos' },
  { id: 'messages', icon: '💬', label: 'Messages' },
  { id: 'browser', icon: '🌐', label: 'Browser' },
  { id: 'terminal', icon: '⌨️', label: 'Terminal' },
  { id: 'trash', icon: '🗑️', label: 'Trash' },
];

const BASE_SIZE = 52; // px — resting icon size
const MAX_SCALE = 1.9; // peak magnification directly under the cursor
const RANGE = 130; // px — how far the fisheye reaches from the cursor
const EASE_MS = 140; // snappy follow so magnification tracks the cursor tightly
const REST_MS = 320; // gentler ease back to rest when the cursor leaves

/** What an icon exposes to the parent: feed it the cursor's clientX (or a
 *  negative sentinel to signal "rest"). */
type IconSetter = (cursorX: number, ms: number) => void;

export const MacOSDock = memo(function MacOSDock({ className = '' }: { className?: string }) {
  // Live icon setters, keyed by id. A ref (not state) so pointermove mutates it
  // without re-rendering.
  const settersRef = useRef<Map<string, IconSetter>>(new Map());

  const register = useCallback((id: string, fn: IconSetter) => {
    settersRef.current.set(id, fn);
  }, []);
  const unregister = useCallback((id: string) => {
    settersRef.current.delete(id);
  }, []);

  const handleMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const x = e.clientX;
    settersRef.current.forEach((fn) => fn(x, EASE_MS));
  }, []);

  // Leaving the dock: spring every icon back to rest with a gentler ease.
  const handleLeave = useCallback(() => {
    settersRef.current.forEach((fn) => fn(-1, REST_MS));
  }, []);

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl border border-landing-border/60 bg-landing-surface/40 ${className}`}
      style={{ minHeight: 360 }}
    >
      {/* The dock shelf. overflow-visible so magnified icons rise above it;
          bottom-aligned items so they "grow upward" as they scale. */}
      <div
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="flex items-end gap-2 overflow-visible rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
        style={{ marginBottom: 24 }}
      >
        {APPS.map((app) => (
          <DockIcon key={app.id} app={app} register={register} unregister={unregister} />
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          move the cursor across the dock · fisheye magnification
        </span>
      </div>
    </div>
  );
});

/**
 * A single dock icon. Owns a `useAnimatable` for `scale` + `translateY`. The
 * parent calls its registered setter on pointermove with the cursor's clientX;
 * this computes the fisheye target from the icon's distance to the cursor and
 * feeds the animatable setters. A negative cursorX is the "rest" sentinel.
 *
 * The icon uses `transform` for scale/lift (so layout is unaffected — neighbors
 * don't shuffle when one grows) inside a fixed-size slot.
 */
const DockIcon = memo(function DockIcon({
  app,
  register,
  unregister,
}: {
  app: DockApp;
  register: (id: string, fn: IconSetter) => void;
  unregister: (id: string) => void;
}) {
  const { ref, animatable } = useAnimatable<HTMLDivElement>({
    scale: { to: 1, duration: REST_MS, ease: 'outQuad' },
    translateY: { to: 0, duration: REST_MS, ease: 'outQuad' },
  });

  // The setter the parent drives on pointermove.
  const update = useCallback(
    (cursorX: number, ms: number) => {
      const el = ref.current;
      const a = animatable.current;
      if (!el || !a) return;

      let target = 1;
      let lift = 0;
      if (cursorX >= 0) {
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const dist = Math.abs(cursorX - center);
        if (dist < RANGE) {
          // Smooth inverted-parabola falloff: peak at center, →1 at the edge.
          const t = 1 - (dist / RANGE) ** 2;
          target = 1 + (MAX_SCALE - 1) * t;
          lift = -((MAX_SCALE - 1) * BASE_SIZE * 0.35) * t; // grow upward
        }
      }

      const scale = a.scale as (v: number, d?: number) => void;
      const translateY = a.translateY as (v: number, d?: number) => void;
      scale(target, ms);
      translateY(lift, ms);
    },
    [animatable, ref],
  );

  // Register on mount, unregister on unmount.
  useEffect(() => {
    register(app.id, update);
    return () => unregister(app.id);
  }, [app.id, register, unregister, update]);

  return (
    <div className="relative flex items-end" style={{ height: BASE_SIZE * MAX_SCALE + 8 }}>
      {/* The icon. transform handles scale + lift (no layout shift). */}
      <div
        ref={ref}
        className="flex items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg shadow-black/30"
        style={{ width: BASE_SIZE, height: BASE_SIZE, willChange: 'transform' }}
        aria-label={app.label}
        role="img"
      >
        <span style={{ fontSize: BASE_SIZE * 0.5 }}>{app.icon}</span>
      </div>
    </div>
  );
});

export default MacOSDock;
