import { useRef, useState } from 'react';
import { useAnimeOnScroll } from '@shakibdshy/react-animejs';
import { DemoCard } from '../DemoCard';
import { ScrollHint } from './ScrollHint';

export function ScrollCallbacksDemo() {
  const [events, setEvents] = useState<string[]>([]);
  const lastUpdateLabelRef = useRef<string>('');

  const pushEvent = (label: string) => {
    setEvents((prev) => [...prev.slice(-4), label]);
  };

  const { ref, containerRef, state, isInView, backward } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: 'center center',
    leave: 'min+=20 max-=20',
    onEnter: () => pushEvent('enter'),
    onLeave: () => pushEvent('leave'),
    onEnterForward: () => pushEvent('enterForward'),
    onEnterBackward: () => pushEvent('enterBackward'),
    onLeaveForward: () => pushEvent('leaveForward'),
    onLeaveBackward: () => pushEvent('leaveBackward'),
    onUpdate: (observer) => {
      if (observer.progress === 0 || observer.progress === 1) return;
      const label = `update ${Math.round(observer.progress * 100)}%`;
      if (lastUpdateLabelRef.current === label) return;
      lastUpdateLabelRef.current = label;
      pushEvent(label);
    },
  });

  return (
    <DemoCard
      title="onscroll callbacks"
      description="Observe direction-aware callbacks without linking an animation. Useful for React state, analytics, and progressive UI changes."
      state={{ progress: state.progress }}
      code={`onEnter / onLeave / onEnterForward / onLeaveBackward`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />

        <div
          ref={containerRef}
          className="relative h-64 overflow-y-auto rounded-2xl border border-demo-border bg-demo-bg"
        >
          <div className="sticky top-0 z-10 border-b border-white/5 bg-black/45 px-4 py-3 backdrop-blur">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
              <span>in view {String(isInView)}</span>
              <span>{backward ? 'backward' : 'forward'}</span>
            </div>
          </div>

          <div className="flex h-140 flex-col items-center justify-between px-5 py-8">
            <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/2 px-4 py-3 text-center text-xs text-demo-text-muted">
              Directional callbacks fire as the observed block crosses the center threshold
            </div>

            <div
              ref={ref}
              className={`flex h-24 w-full max-w-55 items-center justify-center rounded-3xl border text-xs font-black uppercase tracking-[0.3em] transition-colors ${
                isInView
                  ? 'border-emerald-400/40 bg-emerald-400/12 text-emerald-200'
                  : 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200'
              }`}
            >
              target
            </div>

            <div className="w-full rounded-2xl border border-dashed border-white/10 bg-white/2 px-4 py-3 text-center text-xs text-demo-text-muted">
              Scroll back up to trigger backward enter/leave callbacks
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
          <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
            Recent Events
          </div>
          <div className="space-y-2">
            {events.length === 0 ? (
              <div className="text-xs text-slate-600">Scroll to populate callback events</div>
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
