import { Sparkles } from 'lucide-react';
import { useAnimeOnScroll } from '@/lib/react-animejs';
import { DemoCard } from '../DemoCard';
import { ScrollHint, Panel } from './shared';

export function SpectrumMeterDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: 'bottom top',
    leave: 'top bottom',
  });

  const progress = state.progress;
  const hue = 24 + progress * 160;
  const arc = 30 + progress * 270;

  return (
    <DemoCard
      title="spectrum meter"
      description="A color-reactive gauge where the observed block shifts hue and fills a circular arc as it moves through the viewport."
      state={{ progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })
// hue + gauge arc are derived from progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-160 flex-col items-center justify-center gap-6 px-6 py-10">
            <div
              ref={ref}
              className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/10"
              style={{
                background: `radial-gradient(circle at 50% 35%, hsla(${hue}, 88%, 62%, 0.28), rgba(9,9,14,0.96) 62%)`,
                boxShadow: `0 25px 90px hsla(${hue}, 88%, 62%, 0.18)`,
              }}
            >
              <div
                className="absolute inset-2 rounded-full"
                style={{
                  background: `conic-gradient(hsla(${hue}, 92%, 62%, 1) ${arc}deg, rgba(255,255,255,0.06) ${arc}deg)`,
                  WebkitMask: 'radial-gradient(circle, transparent 58%, black 60%)',
                  mask: 'radial-gradient(circle, transparent 58%, black 60%)',
                }}
              />
              <div className="relative text-center">
                <Sparkles className="mx-auto h-5 w-5 text-white/75" />
                <div className="mt-3 text-2xl font-black text-white">{Math.round(progress * 100)}%</div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.3em] text-demo-text-secondary">chroma</div>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-demo-text-muted">
                <span>hue {Math.round(hue)}</span>
                <span>arc {Math.round(arc)}deg</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-demo-card/60">
                <div
                  className="h-full transition-[width] duration-75"
                  style={{
                    width: `${progress * 100}%`,
                    background: `linear-gradient(90deg, hsl(${hue} 92% 62%), hsl(${Math.min(hue + 55, 360)} 92% 62%))`,
                  }}
                />
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}
