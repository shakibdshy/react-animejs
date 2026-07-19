import { DemoSection } from '../DemoSection';
import { MetricPill } from './shared';
import { DepthStackDemo } from './DepthStackDemo';
import { RevealColumnsDemo } from './RevealColumnsDemo';
import { ConveyorDemo } from './ConveyorDemo';
import { MorphTileDemo } from './MorphTileDemo';
import { SpectrumMeterDemo } from './SpectrumMeterDemo';
import { CopyRevealDemo } from './CopyRevealDemo';
import { WaveBarDemo } from './WaveBarDemo';

function ScrollLinkedIntro() {
  return (
    <div className="xl:col-span-2 rounded-[2rem] border border-demo-border bg-linear-to-br from-[#11111a] via-[#0e1018] to-[#0a0a10] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.34em] text-demo-accent">
            Observer-Driven Motion Studies
          </div>
          <h3 className="text-2xl font-black uppercase tracking-[0.12em] text-white">
            Derive Styles Directly From ScrollObserver Progress
          </h3>
          <p className="max-w-xl text-sm leading-6 text-demo-text-secondary">
            These examples intentionally stay on <code className="text-demo-accent">useAnimeOnScroll()</code>
            because the observer is the source of truth. Each card maps raw
            progress into transforms, blur, opacity, clip-path, and color instead
            of just triggering one animation instance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricPill label="preferred api" value="useAnimeOnScroll" tone="text-demo-accent" />
          <MetricPill label="best for" value="reactive styles" tone="text-cyan-400" />
          <MetricPill label="alternative" value="useAnime autoplay" tone="text-fuchsia-400" />
        </div>
      </div>
    </div>
  );
}

export const ScrollLinkedAnimationsGroup: React.FC = () => {
  return (
    <DemoSection title="Scroll-Linked Animations" frameChildren={false}>
      <ScrollLinkedIntro />
      <DepthStackDemo />
      <RevealColumnsDemo />
      <ConveyorDemo />
      <MorphTileDemo />
      <SpectrumMeterDemo />
      <CopyRevealDemo />
      <WaveBarDemo />
    </DemoSection>
  );
};
