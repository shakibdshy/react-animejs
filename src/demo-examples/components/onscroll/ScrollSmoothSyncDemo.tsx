import { useEffect, useRef, useState } from 'react';
import type { ScrollObserver } from 'animejs';
import { RefreshCw } from 'lucide-react';
import { useAnime } from '@shakibdshy/react-animejs';
import { DemoCard } from '../DemoCard';
import { ScrollHint } from './ScrollHint';
import { DEFAULT_SCROLL_OBSERVER_SNAPSHOT, type DemoScrollObserverSnapshot, toObserverSnapshot } from './utils';

export function ScrollSmoothSyncDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [observerState, setObserverState] = useState<DemoScrollObserverSnapshot>(
    DEFAULT_SCROLL_OBSERVER_SNAPSHOT,
  );

  const pushEvent = (label: string) => {
    setEvents((prev) => [...prev.slice(-4), label]);
  };

  const syncObserverState = (observer: ScrollObserver) => {
    setObserverState(toObserverSnapshot(observer));
  };

  const { ref, scrollObserver, isReady } = useAnime<HTMLDivElement>({
    scale: [0.82, 1.18],
    rotate: ['-10deg', '10deg'],
    filter: ['saturate(0.7)', 'saturate(1.25)'],
    duration: 1400,
    ease: 'linear',
    autoplay: {
      container: containerRef,
      sync: 0.18,
      enter: { target: 'center', container: 'center' },
      leave: { target: 'max-=24', container: 'min+=24' },
      onEnter: syncObserverState,
      onLeave: syncObserverState,
      onUpdate: syncObserverState,
      onSyncEnter: (observer) => {
        syncObserverState(observer);
        pushEvent('sync enter');
      },
      onSyncLeave: (observer) => {
        syncObserverState(observer);
        pushEvent('sync leave');
      },
      onSyncComplete: (observer) => {
        syncObserverState(observer);
        pushEvent('sync complete');
      },
      onResize: (observer) => {
        syncObserverState(observer);
        pushEvent('resize');
      },
    },
  });

  useEffect(() => {
    if (!isReady || !scrollObserver.current) return;
    setObserverState(toObserverSnapshot(scrollObserver.current));
  }, [isReady, scrollObserver]);

  return (
    <DemoCard
      title="onscroll smooth sync"
      description="Use numeric sync smoothing through autoplay to create less rigid, more physical scroll-linked playback."
      actions={
        <button
          onClick={() => scrollObserver.current?.refresh()}
          className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
          title="Refresh observer"
        >
          <RefreshCw size={16} />
        </button>
      }
      state={{ progress: observerState.progress }}
      code={`useAnime({
  autoplay: {
    sync: 0.18,
    enter: { target: "center", container: "center" },
    leave: { target: "max-=24", container: "min+=24" },
  },
})`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-demo-border bg-linear-to-b from-[#09090e] via-[#0f1420] to-[#09090e]"
        >
          <div className="pointer-events-none absolute inset-x-4 top-1/2 h-18 -translate-y-1/2 rounded-3xl border border-dashed border-cyan-400/25 bg-cyan-400/6" />

          <div className="flex h-155 flex-col items-center justify-between px-6 py-10">
            <div className="text-center text-xs text-demo-text-muted">
              Smooth sync eases the scrub instead of matching scroll instantly
            </div>

            <div
              ref={ref}
              className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-linear-to-br from-cyan-400/20 via-sky-400/10 to-emerald-400/20 text-center shadow-[0_20px_80px_rgba(34,211,238,0.12)]"
            >
              <div className="absolute inset-3 rounded-[inherit] border border-white/10" />
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-100">smooth</div>
            </div>

            <div className="w-full max-w-64 space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
                <span>progress {Math.round(observerState.progress * 100)}%</span>
                <span>velocity {observerState.velocity.toFixed(2)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-demo-card/80">
                <div
                  className="h-full bg-linear-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-[width] duration-100"
                  style={{ width: `${observerState.progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
          <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
            Sync Events
          </div>
          <div className="space-y-2">
            {events.length === 0 ? (
              <div className="text-xs text-slate-600">Scroll through the band to trigger sync lifecycle callbacks</div>
            ) : (
              events
                .slice()
                .reverse()
                .map((event, index) => (
                  <div
                    key={`${event}-${index}`}
                    className="rounded-xl border border-white/5 bg-white/3 px-3 py-2 text-[11px] font-mono text-slate-300"
                  >
                    {event}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </DemoCard>
  );
}
