import { useAnimeOnScroll } from '@/lib/react-animejs';
import { DemoCard } from '../DemoCard';
import { ScrollHint, Panel } from './shared';

export function DepthStackDemo() {
  const layers = [
    { label: 'foreground', color: '#ffd11a', drift: -0.42, scale: 1.04 },
    { label: 'midtone', color: '#ff6b8a', drift: -0.12, scale: 1.01 },
    { label: 'signal', color: '#63b3ed', drift: 0.16, scale: 0.98 },
    { label: 'shadow', color: '#68d391', drift: 0.34, scale: 0.95 },
  ];

  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: 'bottom top',
    leave: 'top bottom',
  });

  return (
    <DemoCard
      title="depth stack"
      description="A layered scene where each panel drifts at a different rate as the observed stack crosses the viewport."
      state={{ progress: state.progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })
// each layer derives transform from observer.progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-180 flex-col items-center justify-center px-6 py-10">
            <div className="mb-6 text-center text-xs text-demo-text-muted">
              Foreground layers pull upward while distant layers sink deeper into the scene
            </div>

            <div ref={ref} className="relative flex w-full max-w-sm flex-col gap-6 py-10">
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-36 -translate-y-1/2 rounded-4xl border border-dashed border-white/10 bg-white/3" />

              {layers.map((layer) => {
                const travel = (state.progress - 0.5) * layer.drift * 180;
                const blur = Math.abs(layer.drift) * 1.5;
                const opacity = 0.7 + (1 - Math.abs(layer.drift)) * 0.25;

                return (
                  <div
                    key={layer.label}
                    className="relative rounded-[1.75rem] border px-5 py-5 transition-transform duration-75"
                    style={{
                      transform: `translateY(${travel}px) scale(${layer.scale})`,
                      borderColor: `${layer.color}33`,
                      background: `linear-gradient(135deg, ${layer.color}14, rgba(255,255,255,0.02))`,
                      boxShadow: `0 18px 48px ${layer.color}12`,
                      filter: `blur(${blur * (1 - state.progress * 0.35)}px)`,
                      opacity,
                    }}
                  >
                    <div className="mb-2 text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: layer.color }}>
                      {layer.label}
                    </div>
                    <div className="text-xs text-demo-text-muted">
                      Layer drift {layer.drift.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}
