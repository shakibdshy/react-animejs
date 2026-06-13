import { memo, useState } from 'react';
import { ToggleSwitch } from '@/demo/components/common/ToggleSwitch';
import { SpinningCube } from '@/demo/components/common/SpinningCube';
import { Counter } from '@/demo/components/common/Counter';
import { Countdown } from '@/demo/components/common/Countdown';
import { ClipPathReveal } from '@/demo/components/common/ClipPathReveal';
import { AnimatedSlider } from '@/demo/components/common/AnimatedSlider';
import { DemoButton, PreviewCard } from './shared';
import { cn } from './utils';
import type { PreviewProps } from './types';

export const ToggleSwitchPreview = memo(function ToggleSwitchPreview(_props: PreviewProps) {
  const [primary, setPrimary] = useState(true);
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: false,
    analytics: true,
  });

  const update = (key: keyof typeof settings) => (val: boolean) =>
    setSettings((s) => ({ ...s, [key]: val }));

  return (
    <PreviewCard
      title="Toggle Switch"
      description="Springy toggle + ripple"
      controls={
        <DemoButton onClick={() => setPrimary((c) => !c)} variant="accent" small>
          {primary ? 'ON' : 'OFF'}
        </DemoButton>
      }
    >
      <div className="flex flex-col gap-4 w-full max-w-65">
        {/* Focal toggle with state readout */}
        <div className="flex items-center justify-between rounded-lg border border-landing-border/50 bg-landing-surface/40 px-3.5 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="landing-font-display text-sm text-landing-fg">Primary</span>
            <span
              className={cn(
                'landing-font-mono text-[9px] tracking-[0.2em] uppercase transition-colors',
                primary ? 'text-landing-accent' : 'text-landing-muted/60'
              )}
            >
              {primary ? 'enabled' : 'disabled'}
            </span>
          </div>
          <ToggleSwitch checked={primary} onChange={setPrimary} size="lg" />
        </div>

        {/* Size row */}
        <div className="flex items-center justify-around rounded-lg border border-landing-border/50 bg-landing-surface/40 px-3.5 py-3">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5">
              <ToggleSwitch
                size={s}
                checked={primary}
                onChange={setPrimary}
              />
              <span className="landing-font-mono text-[8px] tracking-[0.15em] uppercase text-landing-muted/60">
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Settings panel */}
        <div className="flex flex-col rounded-lg border border-landing-border/50 bg-landing-surface/40 overflow-hidden">
          {(['notifications', 'autoSave', 'analytics'] as const).map((key, i) => (
            <div
              key={key}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5',
                i > 0 && 'border-t border-landing-border/40'
              )}
            >
              <span className="text-xs text-landing-fg capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <ToggleSwitch
                size="sm"
                checked={settings[key]}
                onChange={update(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </PreviewCard>
  );
});

export const CounterCountdownPreview = memo(function CounterCountdownPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="Counter & Countdown" description="Smooth number tweens">
      <div className="flex items-stretch gap-3 w-full">
        {/* Focal looping counter */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl border border-landing-border/50 bg-landing-surface/40 px-4 py-5">
          <Counter from={0} to={100} duration={2500} loop autoplay size="lg" />
        </div>

        {/* Countdown + progress */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl border border-landing-border/50 bg-landing-surface/40 px-4 py-5">
          <Countdown from={15} format="seconds" autoplay size="lg" />
        </div>
      </div>
    </PreviewCard>
  );
});

export const SpinningCubePreview = memo(function SpinningCubePreview(_props: PreviewProps) {
  return (
    <PreviewCard title="Spinning 3D Cube" description="Dual-axis rotation">
      <div className="flex flex-col items-center gap-3 py-2">
        <SpinningCube size={84} duration={4000} axis="both" autoplay showControls={false} />
        <span className="landing-font-mono text-[8px] tracking-[0.15em] uppercase text-landing-muted/60">
          dual-axis · loop
        </span>
      </div>
    </PreviewCard>
  );
});

export const ClipPathRevealPreview = memo(function ClipPathRevealPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="ClipPath Reveal" description="Circle, diamond, wipe">
      <ClipPathReveal shape="circle" duration={1200}>
        <div className="w-full h-32 rounded-xl bg-linear-to-br from-landing-accent to-landing-accent/40 flex items-center justify-center">
          <span className="landing-font-display text-lg text-landing-bg font-bold">Revealed</span>
        </div>
      </ClipPathReveal>
    </PreviewCard>
  );
});

export const AnimatedSliderPreview = memo(function AnimatedSliderPreview(_props: PreviewProps) {
  const slides = [
    { title: 'Animate', gradient: 'from-landing-accent to-landing-accent/50', icon: 'A' },
    { title: 'Timeline', gradient: 'from-landing-accent/80 to-landing-accent/30', icon: 'T' },
    { title: 'Draggable', gradient: 'from-landing-accent/60 to-landing-accent/20', icon: 'D' },
  ];

  return (
    <PreviewCard title="Animated Slider" description="Slide transitions">
      <AnimatedSlider items={slides} loop dots arrows={false}>
        {(item) => (
          <div
            className={cn(
              'w-full h-32 rounded-xl bg-linear-to-br flex items-center justify-center',
              item.gradient
            )}
          >
            <span className="landing-font-display text-2xl text-landing-bg font-bold">
              {item.icon}
            </span>
          </div>
        )}
      </AnimatedSlider>
    </PreviewCard>
  );
});
