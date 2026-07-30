/**
 * MacOSDock — a refined macOS-style dock with cursor-driven fisheye motion.
 *
 * Each icon owns a useAnimatable instance. The dock has one pointer listener
 * that calculates a smooth distance falloff, while every icon eases its scale
 * and lift independently without React state updates on every pointer frame.
 */
import {
  Compass,
  Globe2,
  Image as ImageIcon,
  type LucideIcon,
  Mail,
  MessageCircle,
  Music2,
  TerminalSquare,
  Trash2,
} from 'lucide-react';
import {
  memo,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useAnimatable } from '@shakibdshy/react-animejs';

interface DockApp {
  id: string;
  icon: LucideIcon;
  label: string;
  tint: string;
  isOpen?: boolean;
}

const APPS: DockApp[] = [
  { id: 'finder', icon: Compass, label: 'Finder', tint: '#73b8ff', isOpen: true },
  { id: 'mail', icon: Mail, label: 'Mail', tint: '#72a9ff', isOpen: true },
  { id: 'music', icon: Music2, label: 'Music', tint: '#ff72a8' },
  { id: 'photos', icon: ImageIcon, label: 'Photos', tint: '#ffb56f', isOpen: true },
  { id: 'messages', icon: MessageCircle, label: 'Messages', tint: '#71e39c', isOpen: true },
  { id: 'browser', icon: Globe2, label: 'Browser', tint: '#8a9dff' },
  { id: 'terminal', icon: TerminalSquare, label: 'Terminal', tint: '#b3becd' },
  { id: 'trash', icon: Trash2, label: 'Trash', tint: '#a9b3c2' },
];

const MAX_SCALE = 1.65;
const RANGE = 150;
const FOLLOW_MS = 120;
const REST_MS = 300;

type IconSetter = (cursorX: number, duration: number) => void;

export const MacOSDock = memo(function MacOSDock({ className = '' }: { className?: string }) {
  const settersRef = useRef<Map<string, IconSetter>>(new Map());

  const register = useCallback((id: string, setter: IconSetter) => {
    settersRef.current.set(id, setter);
  }, []);

  const unregister = useCallback((id: string) => {
    settersRef.current.delete(id);
  }, []);

  const handleMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    settersRef.current.forEach((setter) => setter(event.clientX, FOLLOW_MS));
  }, []);

  const handleLeave = useCallback(() => {
    settersRef.current.forEach((setter) => setter(-1, REST_MS));
  }, []);

  return (
    <div
      className={`relative isolate flex min-h-82.5 items-end justify-center overflow-visible rounded-2xl border border-landing-border/60 bg-[#090b10] px-4 pb-12 pt-10 ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 36%, rgba(94,124,190,.16), transparent 40%), linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 28px 28px, 28px 28px',
      }}
    >
      <div className="pointer-events-none absolute inset-x-6 top-6 flex items-center justify-between">
        <span className="landing-font-mono text-[9px] uppercase tracking-[0.28em] text-white/45">
          interactive dock
        </span>
        <span className="landing-font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">
          useAnimatable / 08 apps
        </span>
      </div>

      <div
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        role="toolbar"
        aria-label="Application dock"
        className="group relative flex items-end gap-1.5 rounded-[1.35rem] border border-white/15 bg-white/7.5 px-3 pb-3 pt-4 shadow-[0_24px_70px_rgba(0,0,0,.46),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-2xl sm:gap-2 sm:px-4"
      >
        <div className="pointer-events-none absolute inset-x-5 bottom-1.5 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
        {APPS.map((app) => (
          <DockIcon key={app.id} app={app} register={register} unregister={unregister} />
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="landing-font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
          move across icons · magnify with intention
        </span>
      </div>
    </div>
  );
});

const DockIcon = memo(function DockIcon({
  app,
  register,
  unregister,
}: {
  app: DockApp;
  register: (id: string, setter: IconSetter) => void;
  unregister: (id: string) => void;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const { ref, animatable } = useAnimatable<HTMLButtonElement>({
    scale: { to: 1, duration: REST_MS, ease: 'outQuad' },
    translateY: { to: 0, duration: REST_MS, ease: 'outQuad' },
  });

  const update = useCallback(
    (cursorX: number, duration: number) => {
      const slot = slotRef.current;
      const instance = animatable.current;
      if (!slot || !instance) return;

      let scaleTarget = 1;
      let liftTarget = 0;
      if (cursorX >= 0) {
        const rect = slot.getBoundingClientRect();
        const distance = Math.abs(cursorX - (rect.left + rect.width / 2));
        const normalized = Math.max(0, 1 - distance / RANGE);
        const influence = normalized * normalized * (3 - 2 * normalized);
        scaleTarget = 1 + (MAX_SCALE - 1) * influence;
        liftTarget = -18 * influence;
      }

      const scale = instance.scale as (value: number, ms?: number) => void;
      const translateY = instance.translateY as (value: number, ms?: number) => void;
      scale(scaleTarget, duration);
      translateY(liftTarget, duration);
    },
    [animatable]
  );

  useEffect(() => {
    register(app.id, update);
    return () => unregister(app.id);
  }, [app.id, register, unregister, update]);

  const Icon = app.icon;

  return (
    <div
      ref={slotRef}
      className="group/icon relative flex h-20.5 w-13.5 items-end justify-center sm:w-14.5"
    >
      <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-white/10 bg-[#11151d]/95 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/80 opacity-0 shadow-xl transition-[opacity,transform] duration-150 group-hover/icon:translate-y-0 group-hover/icon:opacity-100">
        {app.label}
      </span>
      <button
        ref={ref}
        type="button"
        aria-label={app.label}
        className="relative flex h-12.5 w-12.5 items-center justify-center rounded-[0.95rem] border border-white/20 bg-linear-to-br from-white/22 to-white/6 text-white shadow-[0_8px_18px_rgba(0,0,0,.3),inset_0_1px_0_rgba(255,255,255,.2)] outline-none transition-[border-color,box-shadow] duration-150 hover:border-white/40 focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/45"
        style={{
          transformOrigin: 'center bottom',
          willChange: 'transform',
        }}
      >
        <span
          className="pointer-events-none absolute inset-0.5 rounded-[0.8rem] opacity-70"
          style={{
            background: `radial-gradient(circle at 35% 20%, ${app.tint}55, transparent 65%)`,
          }}
        />
        <Icon className="relative z-10 h-5.75 w-5.75" strokeWidth={1.65} />
      </button>
      {app.isOpen && (
        <span
          className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          style={{ backgroundColor: app.tint, boxShadow: `0 0 10px ${app.tint}` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
});

export default MacOSDock;
