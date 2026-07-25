import { memo, useCallback, useState } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { useAnime } from '@/lib/react-animejs/hooks';
import { LandingContainer } from '@/landing/components/ui/landing-container';
import { SectionHeader } from '@/landing/components/ui/section-header';
import { Btn } from '@/landing/components/ui/btn';
import { DemoCard } from '@/landing/components/base/demo-card';
import { DemoBox } from '@/landing/components/base/demo-box';
import { DemoBtn } from '@/landing/components/base/demo-btn';
import { MagneticArea } from '@/landing/components/base/magnetic-area';

const EASINGS = ['outQuad', 'inOutQuad', 'outBounce', 'outBack', 'outElastic'] as const;

const EASING_LABELS: Record<string, string> = {
  outQuad: 'ease-out',
  inOutQuad: 'ease-in-out',
  outBounce: 'bounce',
  outBack: 'back',
  outElastic: 'elastic',
};

interface DemosSectionProps {
  className?: string;
}

/**
 * "The Lab" — the interactive playground, framed with the editorial header and
 * a footer CTA into the full gallery. Functionally identical controls to the
 * prior version; only the framing changes.
 */
export const DemosSection = memo(function DemosSection({ className }: DemosSectionProps) {
  const [fadeDuration, setFadeDuration] = useState(600);
  const [fadeEasing, setFadeEasing] = useState<string>('outQuad');
  const [staggerDelay, setStaggerDelay] = useState(60);
  const [magneticStrength, setMagneticStrength] = useState(0.4);

  const { controls: fadeControls } = useAnime({
    selector: '.landing-fade-demo-box',
    opacity: [0, 1],
    translateY: [24, 0],
    duration: fadeDuration,
    ease: fadeEasing as never,
    autoplay: false,
    deps: [fadeDuration, fadeEasing],
  });

  const { controls: staggerControls } = useAnime({
    selector: '.landing-stagger-demo-box',
    opacity: [0, 1],
    translateY: [20, 0],
    stagger: staggerDelay,
    duration: 400,
    ease: 'outQuad' as never,
    autoplay: false,
    deps: [staggerDelay],
  });

  const triggerFade = useCallback(() => fadeControls.restart(), [fadeControls]);
  const triggerStagger = useCallback(() => staggerControls.restart(), [staggerControls]);

  return (
    <LandingContainer as="section" id="demos" className={cn('py-30', className)}>
      <div className="flex items-end justify-between flex-wrap gap-6">
        <SectionHeader
          index="Chapter II"
          numeral="02"
          label="The Lab"
          heading="Try the primitives."
          intro="Real, running animations. Tweak duration, easing, and stagger — the controls are the docs."
        />
        <span className="landing-font-mono text-[11px] tracking-[0.25em] uppercase text-landing-muted pb-2">
          04 specimens
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
        <DemoCard
          title="<FadeIn>"
          description="Enter animation with configurable duration & easing"
          footer={
            <>
              <label className="text-xs text-landing-muted landing-font-mono">Duration</label>
              <input
                type="range"
                min={200}
                max={2000}
                value={fadeDuration}
                step={50}
                onChange={(e) => setFadeDuration(Number(e.target.value))}
                className="w-20 h-1 rounded bg-landing-border appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-landing-accent [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-[11px] text-landing-muted landing-font-mono">
                {fadeDuration}ms
              </span>
              <label className="text-xs text-landing-muted landing-font-mono">Easing</label>
              <select
                value={fadeEasing}
                onChange={(e) => setFadeEasing(e.target.value)}
                className="bg-landing-bg text-landing-fg border border-landing-border rounded px-2 py-1 text-xs landing-font-mono"
              >
                {EASINGS.map((e) => (
                  <option key={e} value={e}>
                    {EASING_LABELS[e]}
                  </option>
                ))}
              </select>
            </>
          }
        >
          <DemoBox className="landing-fade-demo-box">F</DemoBox>
          <DemoBtn onClick={triggerFade}>Animate</DemoBtn>
        </DemoCard>

        <DemoCard
          title="<Stagger>"
          description="Sequenced children with stagger timing"
          footer={
            <>
              <label className="text-xs text-landing-muted landing-font-mono">Delay</label>
              <input
                type="range"
                min={20}
                max={200}
                value={staggerDelay}
                step={10}
                onChange={(e) => setStaggerDelay(Number(e.target.value))}
                className="w-20 h-1 rounded bg-landing-border appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-landing-accent [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-[11px] text-landing-muted landing-font-mono">
                {staggerDelay}ms
              </span>
            </>
          }
        >
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <DemoBox key={n} size="sm" className="landing-stagger-demo-box">
                {n}
              </DemoBox>
            ))}
          </div>
          <DemoBtn onClick={triggerStagger}>Stagger</DemoBtn>
        </DemoCard>

        <DemoCard
          title="<Magnetic>"
          description="Magnetic hover effect — attracts cursor"
          footer={
            <>
              <label className="text-xs text-landing-muted landing-font-mono">Strength</label>
              <input
                type="range"
                min={0.1}
                max={1}
                value={magneticStrength}
                step={0.05}
                onChange={(e) => setMagneticStrength(Number(e.target.value))}
                className="w-20 h-1 rounded bg-landing-border appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-landing-accent [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-[11px] text-landing-muted landing-font-mono">
                {magneticStrength.toFixed(2)}
              </span>
            </>
          }
        >
          <MagneticArea strength={magneticStrength} />
        </DemoCard>

        <DemoCard title="<Reveal>" description="Scroll-triggered reveal sections">
          {[
            'Section One — enter from below',
            'Section Two — fade and slide',
            'Section Three — staggered',
          ].map((text, i) => (
            <RevealItem key={i} text={'\u2726 '.concat(text)} delay={i * 150} />
          ))}
        </DemoCard>
      </div>

      <div className="mt-14 flex flex-col items-center gap-2">
        <Btn variant="secondary" href="/demos">
          Browse the full gallery {'\u2192'}
        </Btn>
        <span className="landing-font-mono text-[11px] tracking-[0.2em] uppercase text-landing-muted">
          25+ components
        </span>
      </div>
    </LandingContainer>
  );
});

const RevealItem = memo(function RevealItem({ text, delay }: { text: string; delay: number }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn(
        'px-6 py-4 rounded-[10px] border-l-[3px] border-landing-accent text-sm w-full max-w-[320px]',
        'transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      )}
      style={{
        background: 'color-mix(in oklch, var(--landing-accent) 8%, transparent)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {text}
    </div>
  );
});
