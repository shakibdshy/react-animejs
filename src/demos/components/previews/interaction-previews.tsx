import { memo, useCallback, useRef, useState } from 'react';
import { useAnime, useAnimeDraggable, useAnimeOnScroll } from '@/lib/react-animejs/hooks';
import { DemoButton, PreviewCard } from './shared';
import { cn } from './utils';
import type { PreviewProps } from './types';

export const DraggablePreview = memo(function DraggablePreview(_props: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<string[]>([]);

  const {
    ref,
    isDragging,
    isGrabbed,
    isReleasing,
    position,
    velocity,
    setX,
    setY,
    reset,
    enable,
    disable,
    isDisabled,
  } = useAnimeDraggable<HTMLDivElement>({
    container: containerRef.current ?? undefined,
    containerPadding: 12,
    snap: 50,
    releaseStiffness: 120,
    releaseDamping: 20,
    onGrab: () => setEvents((e) => [...e.slice(-4), 'onGrab']),
    onRelease: () => setEvents((e) => [...e.slice(-4), 'onRelease']),
    onSnap: () => setEvents((e) => [...e.slice(-4), 'onSnap']),
    onSettle: () => setEvents((e) => [...e.slice(-4), 'onSettle']),
  });

  const stateLabel = isDisabled
    ? 'Disabled'
    : isDragging
      ? 'Dragging'
      : isGrabbed
        ? 'Grabbed'
        : isReleasing
          ? 'Releasing'
          : 'Idle';

  const gridLines = [];
  for (let i = 0; i <= 6; i++) {
    gridLines.push(
      <div
        key={`v-${i}`}
        className="absolute top-0 bottom-0 w-px bg-landing-border/30"
        style={{ left: `${(i / 6) * 100}%` }}
      />,
    );
    gridLines.push(
      <div
        key={`h-${i}`}
        className="absolute left-0 right-0 h-px bg-landing-border/30"
        style={{ top: `${(i / 4) * 100}%` }}
      />,
    );
  }

  return (
    <PreviewCard
      title="Draggable"
      description="Snap · Spring · Controls"
      controls={
        <span className="landing-font-mono text-[10px] text-landing-muted">
          {stateLabel}
        </span>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        <div
          ref={containerRef}
          className="w-full h-32 rounded-xl border border-landing-border border-dashed bg-landing-bg/40 flex items-center justify-center relative overflow-hidden"
        >
          {gridLines}
          <div
            ref={ref}
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center landing-font-mono text-[10px] font-bold text-landing-bg shadow-lg select-none z-10',
              'bg-linear-to-br from-landing-accent to-landing-accent/60',
              'cursor-grab active:cursor-grabbing',
              isDragging && 'shadow-2xl brightness-110 scale-110',
              isDisabled && 'opacity-40 cursor-not-allowed',
            )}
          >
            Drag
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <DemoButton onClick={() => setX(-50)} variant="ghost" small>← X</DemoButton>
          <DemoButton onClick={() => setX(50)} variant="ghost" small>X →</DemoButton>
          <DemoButton onClick={() => setY(-30)} variant="ghost" small>↑ Y</DemoButton>
          <DemoButton onClick={() => setY(30)} variant="ghost" small>Y ↓</DemoButton>
          <DemoButton onClick={() => reset()} variant="surface" small>Reset</DemoButton>
          <DemoButton onClick={isDisabled ? enable : disable} variant="accent" small>
            {isDisabled ? 'Enable' : 'Disable'}
          </DemoButton>
        </div>

        <div className="flex gap-3 landing-font-mono text-[10px] text-landing-muted">
          <span>x:{Math.round(position.x)} y:{Math.round(position.y)}</span>
          <span>vx:{velocity.x.toFixed(0)} vy:{velocity.y.toFixed(0)}</span>
        </div>

        {events.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {events.map((msg, i) => (
              <span
                key={i}
                className="landing-font-mono text-[10px] px-2 py-0.5 rounded bg-landing-accent/10 text-landing-accent border border-landing-accent/20"
              >
                {msg}
              </span>
            ))}
          </div>
        )}
      </div>
    </PreviewCard>
  );
});

export const OnScrollPreview = memo(function OnScrollPreview(_props: PreviewProps) {
  const slides = [
    { label: 'Anim', bg: 'linear-gradient(135deg, #22c55e, #15803d)' },
    { label: 'Timer', bg: 'linear-gradient(135deg, #a855f7, #7e22ce)' },
    { label: 'SVG', bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { label: 'Scope', bg: 'linear-gradient(135deg, #f97316, #c2410c)' },
    { label: 'Drag', bg: 'linear-gradient(135deg, #0ea5e9, #0369a1)' },
    { label: 'Text', bg: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
  ];

  const DELAY = 0.5;
  const DUR = 1;
  const STEP = DELAY + DUR;
  const TOTAL = (slides.length - 1) * STEP + DELAY;

  const { ref, containerRef, controls, state, isReady, isInView, progress } =
    useAnimeOnScroll<HTMLDivElement, HTMLDivElement>({
      enter: 'bottom top',
      leave: 'top bottom',
    });

  const p = Math.max(0, Math.min(1, progress));
  const t = p * TOTAL;

  function getRotationX(i: number): number {
    const outStart = i * STEP + DELAY;
    const outEnd = outStart + DUR;
    const inStart = (i - 1) * STEP + DELAY;
    const inEnd = inStart + DUR;

    if (i === 0) {
      if (t <= outStart) return 0;
      if (t >= outEnd) return 90;
      return ((t - outStart) / DUR) * 90;
    }

    if (i === slides.length - 1) {
      if (t <= inStart) return -90;
      if (t >= inEnd) return 0;
      return -90 + ((t - inStart) / DUR) * 90;
    }

    if (t <= inStart) return -90;
    if (t <= inEnd) return -90 + ((t - inStart) / DUR) * 90;
    if (t <= outStart) return 0;
    if (t >= outEnd) return 90;
    return ((t - outStart) / DUR) * 90;
  }

  const activeIndex = Math.round(p * (slides.length - 1));

  return (
    <PreviewCard
      title="On Scroll"
      description="Inner scroller · Scrubbed vertical rolodex"
      controls={
        <>
          <DemoButton onClick={() => controls.refresh()} variant="surface" small>
            Refresh
          </DemoButton>
          <span className={cn(
            'landing-font-mono text-[10px]',
            isInView ? 'text-landing-accent' : 'text-landing-muted',
          )}>
            {isReady ? (isInView ? 'Active' : 'Scroll ↓') : 'Init…'}
          </span>
        </>
      }
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="landing-font-mono text-[9px] tracking-[0.22em] uppercase text-landing-muted/70">
          Scroll inside the panel to scrub the rolodex
        </div>
        <div
          ref={containerRef}
          className="w-full h-52 rounded-xl border border-landing-border border-dashed bg-landing-bg/40 overflow-y-auto overscroll-contain relative"
        >
          <div className="h-16" />
          <div ref={ref} className="relative h-900">
            <div className="sticky top-0 h-52 flex items-center justify-center">
              <div
                className="relative w-full max-w-xs overflow-hidden rounded-xl"
                style={{ perspective: '800px', aspectRatio: '16 / 10' }}
              >
                {slides.map((slide, i) => (
                  <div
                    key={slide.label}
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
                    style={{
                      background: slide.bg,
                      transform: `rotateX(${getRotationX(i)}deg)`,
                      transformOrigin: 'center center -80px',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <span className="landing-font-mono text-[9px] tracking-[0.3em] uppercase text-white/60">
                      slide {i + 1}
                    </span>
                    <span className="landing-font-display text-lg mt-1 text-white font-bold">
                      {slide.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="h-16" />
        </div>

        <div className="flex items-center gap-1.5 justify-center">
          {slides.map((slide, i) => (
            <div
              key={slide.label}
              className={cn(
                'w-2 h-2 rounded-full transition-colors duration-150',
                i === activeIndex ? 'bg-landing-accent' : 'bg-landing-border/40',
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 landing-font-mono text-[9px]">
          <div className="text-center">
            <div className="text-landing-muted/60 mb-0.5">Progress</div>
            <div className="text-landing-fg font-medium">{Math.round(p * 100)}%</div>
          </div>
          <div className="text-center">
            <div className="text-landing-muted/60 mb-0.5">Scroll</div>
            <div className="text-landing-fg font-medium">{Math.round(state.scroll)}</div>
          </div>
          <div className="text-center">
            <div className="text-landing-muted/60 mb-0.5">Velocity</div>
            <div className="text-landing-fg font-medium">{state.velocity.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-landing-muted/60 mb-0.5">Dir</div>
            <div className={cn('font-medium', state.backward ? 'text-landing-fg' : 'text-landing-accent')}>
              {state.backward ? '← Back' : 'Fwd →'}
            </div>
          </div>
        </div>

        <div className="h-1.5 rounded-full bg-landing-border/30 overflow-hidden">
          <div className="h-full bg-landing-accent transition-none"
            style={{ width: `${p * 100}%` }}
          />
        </div>
      </div>
    </PreviewCard>
  );
});

export const ReorderListPreview = memo(function ReorderListPreview(_props: PreviewProps) {
  const [items, setItems] = useState([1, 2, 3, 4, 5]);
  const { controls } = useAnime({
    selector: '.reorder-item',
    translateY: [12, 0],
    opacity: [0, 1],
    duration: 300,
    ease: 'outQuad',
    delay: 50,
    autoplay: false,
  });

  const handleShuffle = useCallback(() => {
    setItems((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
    setTimeout(() => controls.restart(), 20);
  }, [controls]);

  return (
    <PreviewCard
      title="Reorder List"
      description="FLIP list reorder"
      controls={
        <DemoButton onClick={handleShuffle} variant="accent" small>
          Shuffle
        </DemoButton>
      }
    >
      <div className="flex flex-col gap-1.5 w-24">
        {items.map((n) => (
          <div
            key={n}
            className="reorder-item h-5 rounded flex items-center justify-center text-[10px] font-mono"
            style={{
              backgroundColor: `var(--color-landing-card, rgba(255,255,255,0.08))`,
              color: 'var(--color-landing-text, #e2e0d9)',
            }}
          >
            Item {n}
          </div>
        ))}
      </div>
    </PreviewCard>
  );
});

export const ScrollLinkedAnimationsPreview = memo(function ScrollLinkedAnimationsPreview(
  _props: PreviewProps
) {
  const box1Ref = useRef<HTMLDivElement>(null);
  const box2Ref = useRef<HTMLDivElement>(null);

  const { controls: ctrl1 } = useAnime({
    targets: box1Ref,
    translateX: [
      { to: 80, duration: 500 },
      { to: 0, duration: 400 },
    ],
    opacity: [
      { to: 1, duration: 300 },
      { to: 0, duration: 300 },
    ],
    autoplay: false,
  });
  const { controls: ctrl2 } = useAnime({
    targets: box2Ref,
    translateX: [
      { to: 120, duration: 600 },
      { to: 0, duration: 500 },
    ],
    opacity: [
      { to: 1, duration: 400 },
      { to: 0, duration: 300 },
    ],
    autoplay: false,
  });

  const handlePlay = useCallback(() => {
    ctrl1.restart();
    setTimeout(() => ctrl2.restart(), 200);
  }, [ctrl1, ctrl2]);

  return (
    <PreviewCard
      title="Scroll-Linked Animations"
      description="Parallax, fade-in, scrub"
      controls={
        <DemoButton onClick={handlePlay} variant="accent" small>
          Play
        </DemoButton>
      }
    >
      <div className="w-full h-40 rounded-xl border border-landing-border bg-landing-bg/40 p-4 space-y-4">
        <div className="h-10" />
        <div ref={box1Ref} className="w-10 h-10 rounded-lg bg-landing-accent" />
        <div className="h-10" />
        <div ref={box2Ref} className="w-10 h-10 rounded-lg bg-landing-accent/60" />
        <div className="h-10" />
      </div>
    </PreviewCard>
  );
});
