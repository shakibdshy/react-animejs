import { Waves } from 'lucide-react';
import { useAnimeOnScroll } from '@/lib/react-animejs';
import { DemoCard } from '../DemoCard';
import { ScrollHint, Panel, MetricPill } from './shared';

export function WaveBarDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: 'bottom top',
    leave: 'top bottom',
  });

  const bars = Array.from({ length: 10 }, (_, index) => index);

  return (
    <DemoCard
      title="wave bars"
      description="A reactive equalizer where each bar samples the same observer progress with a slightly shifted phase."
      actions={
        <div className="rounded-lg bg-white/5 p-2 text-demo-text-secondary">
          <Waves className="h-4 w-4" />
        </div>
      }
      state={{ progress: state.progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-150 flex-col items-center justify-center gap-8 px-6 py-10">
            <div
              ref={ref}
              className="flex w-full max-w-sm items-end justify-center gap-3"
            >
              {bars.map((bar) => {
                const phased = Math.max(0, Math.min(1, state.progress * 1.15 - bar * 0.06));
                const height = 22 + phased * (28 + bar * 4);

                return (
                  <div
                    key={bar}
                    className="w-5 rounded-full transition-[height,background] duration-75"
                    style={{
                      height,
                      background: bar % 2 === 0
                        ? 'linear-gradient(180deg, rgba(255,209,26,0.95), rgba(255,140,55,0.28))'
                        : 'linear-gradient(180deg, rgba(99,179,237,0.95), rgba(104,211,145,0.28))',
                      boxShadow: '0 0 20px rgba(255,255,255,0.06)',
                    }}
                  />
                );
              })}
            </div>

            <div className="grid w-full max-w-sm grid-cols-2 gap-3">
              <MetricPill label="offset start" value={`${Math.round(state.offsetStart)}`} tone="text-demo-accent" />
              <MetricPill label="offset end" value={`${Math.round(state.offsetEnd)}`} tone="text-cyan-400" />
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}
