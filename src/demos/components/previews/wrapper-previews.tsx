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

export const UtilitiesPreview = memo(function UtilitiesPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="Utilities" description="Math, random, string, DOM">
      <div className="flex flex-col gap-2 w-full landing-font-mono text-[11px] text-landing-muted">
        <div className="flex justify-between">
          <span>roundPad(3.7, 2)</span>
          <span className="text-landing-accent">03.70</span>
        </div>
        <div className="flex justify-between">
          <span>padStart(&apos;42&apos;, 5, &apos;0&apos;)</span>
          <span className="text-landing-accent">00042</span>
        </div>
        <div className="flex justify-between">
          <span>degToRad(180)</span>
          <span className="text-landing-accent">3.14159</span>
        </div>
        <div className="flex justify-between">
          <span>random(10, 100)</span>
          <span className="text-landing-accent">{Math.floor(Math.random() * 90 + 10)}</span>
        </div>
      </div>
    </PreviewCard>
  );
});

export const ToggleSwitchPreview = memo(function ToggleSwitchPreview(_props: PreviewProps) {
  const [checked, setChecked] = useState(false);

  return (
    <PreviewCard
      title="Toggle Switch"
      description="Animated toggle"
      controls={
        <DemoButton onClick={() => setChecked((c) => !c)} variant="accent" small>
          {checked ? 'ON' : 'OFF'}
        </DemoButton>
      }
    >
      <ToggleSwitch checked={checked} onChange={setChecked} label="Enable feature" />
    </PreviewCard>
  );
});

export const CounterCountdownPreview = memo(function CounterCountdownPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="Counter & Countdown" description="Animated numbers">
      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-1">
          <Counter from={0} to={10} duration={500} size="lg" />
          <span className="landing-font-mono text-[9px] text-landing-muted uppercase tracking-widest">
            Counter
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Countdown from={30} format="seconds" size="lg" />
          <span className="landing-font-mono text-[9px] text-landing-muted uppercase tracking-widest">
            Countdown
          </span>
        </div>
      </div>
    </PreviewCard>
  );
});

export const SpinningCubePreview = memo(function SpinningCubePreview(_props: PreviewProps) {
  return (
    <PreviewCard title="Spinning 3D Cube" description="CSS 3D rotation">
      <SpinningCube size={80} duration={3000} axis="both" />
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
