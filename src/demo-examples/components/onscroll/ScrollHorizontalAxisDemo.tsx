import { ArrowDown, Waves } from 'lucide-react';
import { useAnimeOnScroll } from '@shakibdshy/react-animejs';
import { DemoCard } from '../DemoCard';

export function ScrollHorizontalAxisDemo() {
  const { ref, containerRef, state, controls } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    axis: 'x',
    enter: 0.1,
    leave: 0.9,
  });

  return (
    <DemoCard
      title="onscroll horizontal axis"
      description="Track horizontal container scrolling with axis-specific observer progress and live scroll metrics."
      actions={
        <button
          onClick={() => controls.refresh()}
          className="p-2 bg-white/5 text-demo-text-secondary hover:bg-white/10 hover:text-cyan-400 rounded-lg transition-all"
          title="Refresh observer"
        >
          <Waves size={16} />
        </button>
      }
      state={{ progress: state.progress }}
      code={`useAnimeOnScroll({
  axis: "x",
  enter: 0.1,
  leave: 0.9,
})`}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-demo-text-muted">
          <ArrowDown className="h-3.5 w-3.5 rotate-[-90deg] text-demo-accent" />
          Scroll sideways inside the panel
        </div>

        <div
          ref={containerRef}
          className="relative overflow-x-auto overflow-y-hidden rounded-2xl border border-demo-border bg-demo-bg"
        >
          <div className="w-[56rem] px-6 py-6">
            <div className="mb-4 flex gap-3">
              {['axis', 'x', 'observer', 'progress', 'scroll', 'metrics'].map(
                (label, index) => (
                  <div
                    key={label}
                    className="flex h-20 min-w-40 items-center justify-center rounded-2xl border text-xs font-black uppercase tracking-[0.3em]"
                    style={{
                      borderColor: index === 2 ? 'rgba(255, 209, 26, 0.35)' : 'rgba(255,255,255,0.08)',
                      background: index === 2
                        ? 'linear-gradient(135deg, rgba(255,209,26,0.12), rgba(255,140,55,0.10))'
                        : 'rgba(255,255,255,0.02)',
                      color: index === 2 ? '#ffe680' : '#cbd5e1',
                    }}
                  >
                    {label}
                  </div>
                ),
              )}
            </div>

            <div
              ref={ref}
              className="relative h-28 rounded-[1.75rem] border border-cyan-400/25 bg-linear-to-r from-cyan-500/18 via-sky-400/8 to-indigo-500/18"
            >
              <div className="absolute inset-3 rounded-[inherit] border border-white/10" />
              <div className="absolute inset-y-0 left-[10%] w-px bg-cyan-400/25" />
              <div className="absolute inset-y-0 right-[10%] w-px bg-cyan-400/25" />
              <div className="flex h-full items-center justify-center text-[10px] font-black uppercase tracking-[0.35em] text-cyan-100">
                horizontal target
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-demo-text-muted">
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            progress <span className="text-demo-accent">{Math.round(state.progress * 100)}%</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            scroll <span className="text-cyan-400">{Math.round(state.scroll)}</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
            distance <span className="text-fuchsia-400">{Math.round(state.distance)}</span>
          </div>
        </div>
      </div>
    </DemoCard>
  );
}
