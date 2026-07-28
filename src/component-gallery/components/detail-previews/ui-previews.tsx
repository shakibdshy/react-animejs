import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, Anime, AnimePresence, AnimePresenceChild } from '@/lib/react-animejs';
import { DemoButton, PreviewCard } from './shared';
import { cn } from './utils';
import type { PreviewProps } from './types';

export const TooltipPreview = memo(function TooltipPreview(_props: PreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <PreviewCard
      title="Tooltip"
      description="Hover or tap the target"
      controls={
        <DemoButton onClick={() => setOpen((o) => !o)} variant="accent" small>
          {open ? 'Hide' : 'Reveal'}
        </DemoButton>
      }
    >
      <div className="relative flex items-center justify-center py-10">
        <button
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={() => setOpen((o) => !o)}
          className="px-4 py-2 rounded-lg border border-landing-border bg-landing-surface text-sm text-landing-fg hover:border-landing-accent/40 transition-colors"
        >
          Hover or tap me
        </button>
        <Anime
          opacity={open ? [0, 1] : [1, 0]}
          translateY={open ? [8, 0] : [0, 8]}
          scale={open ? [0.9, 1] : [1, 0.9]}
          duration={220}
          ease="outBack"
          deps={[open]}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none"
        >
          <div className="landing-font-mono text-[11px] text-landing-bg bg-landing-accent px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
            Helpful tip
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-landing-accent rotate-45" />
          </div>
        </Anime>
      </div>
    </PreviewCard>
  );
});

export const DropdownMenuPreview = memo(function DropdownMenuPreview(_props: PreviewProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const items = ['Profile', 'Settings', 'Theme', 'Sign out'];

  return (
    <PreviewCard
      title="Dropdown Menu"
      description="Click the trigger"
      controls={
        <DemoButton onClick={() => setOpen((o) => !o)} variant="accent" small>
          {open ? 'Close' : 'Open'}
        </DemoButton>
      }
    >
      <div ref={containerRef} className="relative flex items-center justify-center py-6">
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-4 py-2 rounded-lg border border-landing-border bg-landing-surface text-sm text-landing-fg hover:border-landing-accent/40 transition-colors flex items-center gap-2"
        >
          Menu
          <span className="text-landing-muted text-xs">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <div className="absolute top-full mt-2 w-40 rounded-lg border border-landing-border bg-landing-surface shadow-xl overflow-hidden z-10">
            {items.map((item, i) => (
              <Anime
                key={item}
                opacity={[0, 1]}
                translateY={[-8, 0]}
                delay={i * 40}
                duration={200}
                ease="outQuad"
              >
                <button
                  className="w-full text-left px-3 py-2 text-sm text-landing-fg hover:bg-landing-accent/10 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item}
                </button>
              </Anime>
            ))}
          </div>
        )}
      </div>
    </PreviewCard>
  );
});

/** A single accordion item.
 *
 *  Smooth height animation via animate() from react-animejs. anime.js cannot
 *  interpolate height:'auto', so we measure the panel's real pixel height
 *  (scrollHeight) and tween to that number. useLayoutEffect runs before paint,
 *  freezing the current height then animating — no flash. Panels animate in
 *  parallel when switching (one closes while another opens). */
const AccordionItem = memo(function AccordionItem({
  title,
  body,
  isOpen,
  onToggle,
}: {
  title: string;
  body: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  // useLayoutEffect bridges React's DOM commit and the browser paint: freeze
  // the current pixel height, then animate to the target. Running here means
  // the user never sees an intermediate snap.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;

    // First render: just sync to the resting state without animating.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      panel.style.height = isOpen ? 'auto' : '0px';
      panel.style.opacity = isOpen ? '1' : '0';
      return;
    }

    // Freeze at the current rendered pixel height so the tween has a real
    // starting value (avoiding a flash from auto -> 0 or auto -> auto).
    const currentHeight = panel.getBoundingClientRect().height;
    panel.style.height = `${currentHeight}px`;

    // Tween to the target. When opening, the target is the natural content
    // height (scrollHeight); when closing, it's 0.
    const targetHeight = isOpen ? content.scrollHeight : 0;
    animate(panel, {
      height: targetHeight,
      opacity: isOpen ? 1 : 0,
      duration: 320,
      ease: 'outExpo',
      // On complete, release the inline height so layout stays correct if the
      // viewport/content resizes later (open panels return to 'auto').
      onComplete: () => {
        if (isOpen) panel.style.height = 'auto';
      },
    });
  }, [isOpen]);

  return (
    <div className="rounded-lg border border-landing-border bg-landing-surface/40 overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
      >
        <span className="text-sm text-landing-fg">{title}</span>
        <span
          className={cn(
            'landing-font-mono text-xs text-landing-muted transition-transform duration-300',
            isOpen && 'rotate-180 text-landing-accent',
          )}
        >
          ▼
        </span>
      </button>
      <div ref={panelRef} style={{ height: 0 }} className="overflow-hidden">
        <div ref={contentRef}>
          <p className="px-3.5 pb-3 text-xs text-landing-muted leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
});

export const AccordionPreview = memo(function AccordionPreview(_props: PreviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    {
      title: 'What is react-animejs?',
      body: 'A React wrapper around anime.js v4 — hooks-first, with declarative components where they help.',
    },
    {
      title: 'Do I need anime.js installed?',
      body: 'Yes. Install animejs separately; this package wraps its primitives.',
    },
    {
      title: 'Is it SSR-safe?',
      body: 'Hooks access browser APIs inside effects, so they render safely on the server.',
    },
  ];

  return (
    <PreviewCard title="Accordion" description="Click a header to toggle">
      <div className="w-full max-w-80 flex flex-col gap-2">
        {items.map((item, i) => (
          <AccordionItem
            key={item.title}
            title={item.title}
            body={item.body}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </PreviewCard>
  );
});

interface ToastItem {
  id: number;
  message: string;
}

export const ToastPreview = memo(function ToastPreview(_props: PreviewProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const pushToast = () => {
    const messages = ['Saved successfully', 'Settings updated', 'Welcome back ✦', 'Item copied'];
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message: messages[id % messages.length] }]);
    window.setTimeout(() => {
      setToasts((arr) => arr.filter((x) => x.id !== id));
    }, 3000);
  };

  const dismiss = (id: number) => setToasts((arr) => arr.filter((x) => x.id !== id));

  return (
    <PreviewCard
      title="Toast"
      description="Click to push a notification"
      controls={
        <DemoButton onClick={pushToast} variant="accent" small>
          Push toast
        </DemoButton>
      }
    >
      <div className="relative w-full min-h-40 flex items-center justify-center">
        {toasts.length === 0 && (
          <span className="landing-font-mono text-[11px] text-landing-muted/60">
            No notifications
          </span>
        )}
        <div className="absolute bottom-0 right-0 flex flex-col gap-2 items-end w-44">
          <AnimePresence mode="popLayout">
            {toasts.map((t) => (
              <AnimePresenceChild
                key={t.id}
                enter={{ opacity: [0, 1], translateX: [40, 0], scale: [0.9, 1] }}
                exit={{ opacity: [1, 0], translateX: [0, 40], scale: [1, 0.9] }}
                duration={300}
                ease="outExpo"
              >
                <div className="w-full flex items-center justify-between gap-2 rounded-lg border border-landing-border bg-landing-surface px-3 py-2 shadow-lg">
                  <span className="text-xs text-landing-fg">{t.message}</span>
                  <button
                    onClick={() => dismiss(t.id)}
                    className="text-landing-muted hover:text-landing-accent text-xs"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </AnimePresenceChild>
            ))}
          </AnimePresence>
        </div>
      </div>
    </PreviewCard>
  );
});

export const TabsPreview = memo(function TabsPreview(_props: PreviewProps) {
  const [active, setActive] = useState(0);

  const tabs = [
    {
      label: 'Overview',
      body: 'A hooks-first React wrapper for anime.js v4. Declarative components where they help.',
    },
    {
      label: 'Install',
      body: 'pnpm add animejs — then import from @/lib/react-animejs. React 19+ and anime.js v4.',
    },
    {
      label: 'Learn',
      body: 'Start with useAnime for tweens, useAnimeTimeline for sequences, AnimePresence for exits.',
    },
  ];

  return (
    <PreviewCard title="Tabs" description="Click a tab to switch">
      <div className="w-full max-w-80">
        <div className="relative flex border-b border-landing-border">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              className={cn(
                'px-3 py-2 text-sm transition-colors w-16 text-center',
                active === i ? 'text-landing-accent' : 'text-landing-muted hover:text-landing-fg',
              )}
            >
              {tab.label}
            </button>
          ))}
          <Anime
            translateX={active * 64}
            duration={300}
            ease="outExpo"
            deps={[active]}
            className="absolute -bottom-px left-0 w-16 h-0.5 bg-landing-accent rounded-full"
          >
            <div className="w-full h-full bg-landing-accent rounded-full" />
          </Anime>
        </div>
        {/* Active panel mounts/unmounts as `active` changes; AnimePresence
            drives the cross-fade. mode="wait" gives a clean out-then-in swap
            so two panels never overlap. */}
        <div className="relative min-h-20 mt-3">
          <AnimePresence mode="wait" initial={false}>
            <AnimePresenceChild
              key={tabs[active].label}
              enter={{ opacity: [0, 1], translateY: [6, 0] }}
              exit={{ opacity: [1, 0], translateY: [0, -6] }}
              duration={220}
              ease="outQuad"
            >
              <p className="text-xs text-landing-muted leading-relaxed">{tabs[active].body}</p>
            </AnimePresenceChild>
          </AnimePresence>
        </div>
      </div>
    </PreviewCard>
  );
});
