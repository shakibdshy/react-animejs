import { memo, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Anime, AnimeLayout, AnimeLayoutItem, AnimePresence, AnimePresenceChild } from '@/lib/react-animejs';
import type { AnimeLayoutRef } from '@/lib/react-animejs';
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
      <div ref={containerRef} className="flex flex-col items-center justify-center py-6 gap-2">
        <AnimePresence mode="sync">
          {open && (
            <AnimePresenceChild
              key="dropdown"
              enter={{ opacity: [0, 1], height: [0, 'auto'] }}
              exit={{ opacity: [1, 0], height: ['auto', 0] }}
              duration={220}
              ease="outExpo"
            >
              <div className="w-40 rounded-lg border border-landing-border bg-landing-surface shadow-xl overflow-hidden">
                {items.map((item, i) => (
                  <Anime
                    key={item}
                    opacity={[0, 1]}
                    translateY={[-6, 0]}
                    delay={i * 40}
                    duration={200}
                    ease="outQuad"
                    autoplay
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
            </AnimePresenceChild>
          )}
        </AnimePresence>
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-4 py-2 rounded-lg border border-landing-border bg-landing-surface text-sm text-landing-fg hover:border-landing-accent/40 transition-colors flex items-center gap-2"
        >
          Menu
          <span className="text-landing-muted text-xs">{open ? '▲' : '▼'}</span>
        </button>
      </div>
    </PreviewCard>
  );
});

/** A single accordion item.
 *
 *  Uses <AnimeLayout> (mode="manual") + controls.update() to FLIP-animate
 *  the panel height. On toggle, update() commits the new state via flushSync,
 *  then anime.js's layout engine measures the before/after height delta and
 *  tweens it. This is the same pattern used by the AnimateCssGridFlip block —
 *  the declarative component built for layout animations. */
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
  const layoutRef = useRef<AnimeLayoutRef>(null);

  const handleToggle = () => {
    const layout = layoutRef.current;
    if (!layout) {
      onToggle();
      return;
    }
    // update() records the current layout, runs the callback (which commits
    // the new DOM state via flushSync), measures the new layout, and animates
    // the delta — including height.
    layout.update(
      () => {
        flushSync(() => onToggle());
      },
      {
        duration: 320,
        ease: 'outExpo',
      },
    );
  };

  return (
    <div className="rounded-lg border border-landing-border bg-landing-surface/40 overflow-hidden">
      <button
        onClick={handleToggle}
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
      <AnimeLayout
        ref={layoutRef}
        mode="manual"
        duration={500}
        ease="outExpo"
        enterFrom={{ opacity: 0 }}
        leaveTo={{ opacity: 0 }}
        className="overflow-hidden"
      >
        {isOpen && (
          <AnimeLayoutItem key="panel" layoutId="panel">
            <p className="px-3.5 pb-3 text-xs text-landing-muted leading-relaxed">{body}</p>
          </AnimeLayoutItem>
        )}
      </AnimeLayout>
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

/** A presence-driven accordion item that animates real height — same smooth
 *  expand/collapse as the AnimeLayout version, but via <AnimePresence>.
 *
 *  Just pass height: 'auto' — AnimePresenceChild measures the content's real
 *  pixel height internally and animates to it, then releases to 'auto' on
 *  completion. No manual measurement needed. mode="sync" = parallel switching. */
const AccordionPresenceItem = memo(function AccordionPresenceItem({
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
      <AnimePresence mode="sync" initial={false}>
        {isOpen && (
          <AnimePresenceChild
            key="panel"
            enter={{ height: [0, 'auto'], opacity: [0, 1] }}
            exit={{ height: ['auto', 0], opacity: [1, 0] }}
            duration={320}
            ease="outExpo"
          >
            <div className="overflow-hidden">
              <p className="px-3.5 pb-3 text-xs text-landing-muted leading-relaxed">{body}</p>
            </div>
          </AnimePresenceChild>
        )}
      </AnimePresence>
    </div>
  );
});

export const AccordionPresencePreview = memo(function AccordionPresencePreview(
  _props: PreviewProps,
) {
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
    <PreviewCard title="Accordion (Presence)" description="Click a header to toggle">
      <div className="w-full max-w-80 flex flex-col gap-2">
        {items.map((item, i) => (
          <AccordionPresenceItem
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
