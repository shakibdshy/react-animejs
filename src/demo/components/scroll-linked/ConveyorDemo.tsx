import { useAnimeOnScroll } from '@/lib/react-animejs';
import { DemoCard } from '../DemoCard';
import { ScrollHint, Panel, MetricPill } from './shared';

export function ConveyorDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: 'bottom top',
    leave: 'top bottom',
  });

  const labels = ['signal', 'ribbon', 'vector', 'motion'];

  return (
    <DemoCard
      title="conveyor strip"
      description="A horizontal ribbon that slides across the viewport according to vertical scroll progress."
      state={{ progress: state.progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })
// translateX is mapped from observer.progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-155 flex-col items-center justify-center gap-6 px-6 py-10">
            <div
              ref={ref}
              className="w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-demo-border bg-demo-bg"
            >
              <div
                className="flex w-[400%] transition-transform duration-75"
                style={{ transform: `translateX(-${state.progress * 75}%)` }}
              >
                {labels.map((label, index) => (
                  <div
                    key={label}
                    className="flex min-h-32 w-full shrink-0 items-center justify-center"
                    style={{
                      background:
                        index % 2 === 0
                          ? 'linear-gradient(135deg, rgba(255,209,26,0.16), rgba(255,140,55,0.08))'
                          : 'linear-gradient(135deg, rgba(99,179,237,0.16), rgba(104,211,145,0.08))',
                    }}
                  >
                    <div className="text-center">
                      <div className="text-[10px] font-mono uppercase tracking-[0.34em] text-demo-text-muted">
                        panel {index + 1}
                      </div>
                      <div className="mt-2 text-2xl font-black uppercase tracking-[0.28em] text-white">
                        {label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              <MetricPill label="progress" value={`${Math.round(state.progress * 100)}%`} tone="text-demo-accent" />
              <MetricPill label="velocity" value={state.velocity.toFixed(2)} tone="text-cyan-400" />
              <MetricPill label="scroll" value={`${Math.round(state.scroll)}`} tone="text-fuchsia-400" />
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}
