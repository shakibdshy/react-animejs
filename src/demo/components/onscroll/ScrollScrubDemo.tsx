import { useEffect, useMemo, useRef, useState } from 'react';
import type { ScrollObserver } from 'animejs';
import { Waves } from 'lucide-react';
import { useAnime } from '@/lib/react-animejs';
import { DemoCard } from '../DemoCard';
import { ScrollHint } from './ScrollHint';
import { toObserverSnapshot, DEFAULT_SCROLL_OBSERVER_SNAPSHOT, type DemoScrollObserverSnapshot } from './utils';

export function ScrollScrubDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [observerState, setObserverState] = useState<DemoScrollObserverSnapshot>(
    DEFAULT_SCROLL_OBSERVER_SNAPSHOT,
  );

  const { ref, scrollObserver, isReady } = useAnime<HTMLDivElement>({
    scale: [0.72, 1.18],
    rotate: ['-15deg', '15deg'],
    borderRadius: ['24px', '40px'],
    duration: 1800,
    ease: 'linear',
    autoplay: {
      container: containerRef,
      sync: true,
      enter: 'bottom top',
      leave: 'top bottom',
      onEnter: (observer: ScrollObserver) => setObserverState(toObserverSnapshot(observer)),
      onLeave: (observer: ScrollObserver) => setObserverState(toObserverSnapshot(observer)),
      onUpdate: (observer: ScrollObserver) => setObserverState(toObserverSnapshot(observer)),
    },
  });

  useEffect(() => {
    if (!isReady || !scrollObserver.current) return;
    setObserverState(toObserverSnapshot(scrollObserver.current));
  }, [isReady, scrollObserver]);

  const glow = useMemo(() => {
    const progress = Math.max(0, Math.min(1, observerState.progress));
    return `rgba(34, 211, 238, ${0.12 + progress * 0.35})`;
  }, [observerState.progress]);

  return (
    <DemoCard
      title="onscroll scrub"
      description="Use the official autoplay ScrollObserver path for exact playback-progress sync, so scroll distance scrubs frame by frame."
      actions={
        <button
          onClick={() => scrollObserver.current?.refresh()}
          className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
          title="Refresh observer"
        >
          <Waves size={16} />
        </button>
      }
      state={{ progress: observerState.progress }}
      code={`useAnime({
  autoplay: {
    sync: true,
    enter: "bottom top",
    leave: "top bottom",
  },
})`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-demo-border bg-demo-bg"
        >
          <div className="pointer-events-none sticky top-4 z-10 mx-4 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.22em] text-demo-text-muted backdrop-blur">
            observer progress {Math.round(observerState.progress * 100)}%
          </div>

          <div className="flex h-155 flex-col items-center justify-between px-6 py-10">
            <div className="text-center text-xs text-demo-text-muted">
              Start outside the container viewport
            </div>

            <div
              ref={ref}
              className="relative flex h-40 w-40 items-center justify-center overflow-hidden border border-cyan-400/20 bg-linear-to-br from-cyan-500/20 via-sky-400/10 to-indigo-500/20 text-center text-xs font-bold uppercase tracking-[0.2em] text-cyan-100"
              style={{ boxShadow: `0 0 50px ${glow}` }}
            >
              <div className="absolute inset-3 rounded-[inherit] border border-white/10" />
              scrubbed
            </div>

            <div className="w-full max-w-60 space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-demo-card/70">
                <div
                  className="h-full bg-linear-to-r from-cyan-400 via-sky-400 to-indigo-400 transition-[width] duration-75"
                  style={{ width: `${observerState.progress * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
                <span>offset start {Math.round(observerState.offsetStart)}</span>
                <span>offset end {Math.round(observerState.offsetEnd)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoCard>
  );
}
