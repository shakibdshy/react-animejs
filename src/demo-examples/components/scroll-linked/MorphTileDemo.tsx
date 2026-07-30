import { useAnimeOnScroll } from '@shakibdshy/react-animejs';
import { DemoCard } from '../DemoCard';
import { MetricPill, Panel, ScrollHint } from './shared';

export function MorphTileDemo() {
  const { ref, containerRef, state } = useAnimeOnScroll<
    HTMLDivElement,
    HTMLDivElement
  >({
    enter: 'bottom top',
    leave: 'top bottom',
  });

  const progress = state.progress;
  const scale = 0.58 + progress * 0.62;
  const rotate = -50 + progress * 100;
  const radius = 14 + progress * 64;
  const glow = 0.1 + progress * 0.25;

  return (
    <DemoCard
      title="morph tile"
      description="A single observed tile morphs its geometry, scale, and glow in one continuous scroll-linked gesture."
      state={{ progress }}
      code={`useAnimeOnScroll({ enter: "bottom top", leave: "top bottom" })
// scale + rotate + radius all map from progress`}
    >
      <div className="flex w-full flex-col gap-4">
        <ScrollHint />
        <Panel containerRef={containerRef}>
          <div className="flex h-160 flex-col items-center justify-center gap-5 px-6 py-10">
            <div className="text-center text-xs text-demo-text-muted">
              The object tightens into a rounded capsule as it crosses the center band
            </div>

            <div
              ref={ref}
              className="relative flex h-36 w-36 items-center justify-center border border-[#b794f4]/35"
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                borderRadius: `${radius}px`,
                background: `linear-gradient(135deg, rgba(183,148,244,${0.16 + progress * 0.24}), rgba(99,179,237,${0.06 + progress * 0.12}))`,
                boxShadow: `0 20px 70px rgba(183,148,244,${glow})`,
                transition: 'transform 75ms linear, border-radius 75ms linear, background 75ms linear, box-shadow 75ms linear',
              }}
            >
              <div className="absolute inset-3 rounded-[inherit] border border-white/10" />
              <div className="text-center">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#d9c3ff]">geometry</div>
                <div className="mt-2 text-lg font-black text-white">{Math.round(progress * 100)}%</div>
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-3 gap-3">
              <MetricPill label="scale" value={scale.toFixed(2)} tone="text-demo-accent" />
              <MetricPill label="rotate" value={`${Math.round(rotate)}deg`} tone="text-cyan-400" />
              <MetricPill label="radius" value={`${Math.round(radius)}px`} tone="text-fuchsia-400" />
            </div>
          </div>
        </Panel>
      </div>
    </DemoCard>
  );
}
