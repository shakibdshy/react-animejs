import { useEffect, useRef, useState } from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import { useAnime } from '@/lib/react-animejs';
import { DemoCard } from '../DemoCard';
import { ScrollHint } from './ScrollHint';
import { DEFAULT_SCROLL_OBSERVER_SNAPSHOT, type DemoScrollObserverSnapshot, toObserverSnapshot } from './utils';

export function ScrollPlaybackDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [observerState, setObserverState] = useState<DemoScrollObserverSnapshot>(
    DEFAULT_SCROLL_OBSERVER_SNAPSHOT,
  );

  const {
    ref,
    scrollObserver,
    controls: animationControls,
    isPlaying,
    isReady,
    state,
  } = useAnime<HTMLDivElement>({
    translateX: [0, 180],
    rotate: ['0deg', '1turn'],
    scale: [1, 1.12, 1],
    duration: 1600,
    ease: 'inOutExpo',
    autoplay: {
      container: containerRef,
      sync: 'play pause reverse reset',
      enter: 'bottom center',
      leave: 'top center',
      onEnter: (observer) => setObserverState(toObserverSnapshot(observer)),
      onLeave: (observer) => setObserverState(toObserverSnapshot(observer)),
      onUpdate: (observer) => setObserverState(toObserverSnapshot(observer)),
    },
  });

  useEffect(() => {
    if (!isReady || !scrollObserver.current) return;
    setObserverState(toObserverSnapshot(scrollObserver.current));
  }, [isReady, scrollObserver]);

  return (
    <DemoCard
      title="onscroll play / pause"
      description="Drive a regular useAnime animation with native ScrollObserver method sync through the autoplay parameter."
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => scrollObserver.current?.refresh()}
            className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
            title="Refresh observer"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => animationControls.restart()}
            className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-demo-accent rounded-lg transition-all"
            title="Restart animation"
          >
            <Zap size={16} />
          </button>
        </div>
      }
      controls={{
        play: () => animationControls.play(),
        pause: () => animationControls.pause(),
        restart: () => animationControls.restart(),
      }}
      state={{ progress: observerState.progress }}
      isPlaying={isPlaying}
      code={`useAnime({
  autoplay: {
    sync: "play pause reverse reset",
    enter: "bottom center",
    leave: "top center",
  },
})`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-demo-border bg-linear-to-b from-[#09090e] via-[#101019] to-[#09090e]"
        >
          <div className="flex h-120 flex-col items-center justify-between px-5 py-6">
            <div className="text-center text-xs text-demo-text-muted">
              Scroll until the yellow chip reaches the middle band
            </div>

            <div className="relative flex w-full items-center justify-center">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 rounded-2xl border border-dashed border-demo-accent/35 bg-demo-accent/5" />
              <div
                ref={ref}
                className="relative z-10 flex h-18 w-18 items-center justify-center rounded-3xl bg-linear-to-br from-demo-accent to-[#ff8c37] text-xs font-black uppercase tracking-[0.2em] text-demo-bg shadow-[0_12px_40px_rgba(255,209,26,0.25)]"
              >
                Spin
              </div>
            </div>

            <div className="text-center text-xs text-demo-text-muted">
              Leaving the zone pauses or reverses based on scroll direction
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            in view:{' '}
            <span className={observerState.isInView ? 'text-emerald-400' : 'text-slate-300'}>
              {String(observerState.isInView)}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            direction:{' '}
            <span className="text-cyan-400">
              {observerState.backward ? 'backward' : 'forward'}
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            observer:{' '}
            <span className="text-demo-accent">
              {Math.round(observerState.progress * 100)}%
            </span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            velocity:{' '}
            <span className="text-fuchsia-400">
              {observerState.velocity.toFixed(2)}
            </span>
          </div>
          <div className="col-span-2 rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            animation:{' '}
            <span className="text-slate-300">
              {Math.round(state.progress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </DemoCard>
  );
}
