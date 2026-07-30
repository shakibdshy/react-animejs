import { memo, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { useMagnetic } from '@/landing/hooks/use-magnetic';
import { useAnime } from '@shakibdshy/react-animejs';
import { stagger } from '@shakibdshy/react-animejs';
import { LandingContainer } from '@/landing/components/ui/landing-container';
import { SectionHeader } from '@/landing/components/ui/section-header';
import { Btn } from '@/landing/components/ui/btn';

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
 * "The Lab" — four interactive specimens. Each shares one editorial card
 * shell but has a purpose-built stage that visually expresses what it
 * animates. All animation wiring (useAnime selectors, useMagnetic,
 * useScrollReveal) and all controls remain fully functional.
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
    delay: stagger(staggerDelay),
    duration: 400,
    ease: 'outQuad' as never,
    autoplay: false,
    deps: [staggerDelay],
  });

  const triggerFade = useCallback(() => {
    fadeControls.restart();
    document
      .querySelector<HTMLElement>('[data-phase-trigger]')
      ?.dispatchEvent(new CustomEvent('fadeInRun'));
  }, [fadeControls]);
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
        {/* 01 ── FadeIn ─────────────────────────────────────────────── */}
        <SpecimenCard
          index="01"
          title="<FadeIn>"
          description="Enter animation with configurable duration & easing"
          footer={
            <>
              <Field label="Duration">
                <Slider
                  min={200}
                  max={2000}
                  value={fadeDuration}
                  step={50}
                  onChange={setFadeDuration}
                />
                <Value>{fadeDuration}ms</Value>
              </Field>
              <Field label="Easing">
                <Select
                  value={fadeEasing}
                  options={EASINGS.map((e) => ({ value: e, label: EASING_LABELS[e] }))}
                  onChange={setFadeEasing}
                />
              </Field>
              <RunBtn onClick={triggerFade}>Run</RunBtn>
            </>
          }
        >
          <FadeInStage duration={fadeDuration} />
        </SpecimenCard>

        {/* 02 ── Stagger ────────────────────────────────────────────── */}
        <SpecimenCard
          index="02"
          title="<Stagger>"
          description="Sequenced children with stagger timing"
          footer={
            <>
              <Field label="Stagger">
                <Slider
                  min={20}
                  max={200}
                  value={staggerDelay}
                  step={10}
                  onChange={setStaggerDelay}
                />
                <Value>{staggerDelay}ms</Value>
              </Field>
              <RunBtn onClick={triggerStagger}>Run</RunBtn>
            </>
          }
        >
          <StaggerStage />
        </SpecimenCard>

        {/* 03 ── Magnetic ───────────────────────────────────────────── */}
        <SpecimenCard
          index="03"
          title="<Magnetic>"
          description="Cursor-driven attraction — hover the field"
          footer={
            <>
              <Field label="Strength">
                <Slider
                  min={0.1}
                  max={1}
                  value={magneticStrength}
                  step={0.05}
                  onChange={(v) => setMagneticStrength(v)}
                />
                <Value>{magneticStrength.toFixed(2)}</Value>
              </Field>
              <span className="landing-font-mono text-[10px] uppercase tracking-[0.18em] text-landing-muted/70">
                hover to move
              </span>
            </>
          }
        >
          <MagneticStage strength={magneticStrength} />
        </SpecimenCard>

        {/* 04 ── Reveal ─────────────────────────────────────────────── */}
        <SpecimenCard
          index="04"
          title="<Reveal>"
          description="Scroll-triggered reveal — enters from below"
          footer={
            <span className="landing-font-mono text-[10px] uppercase tracking-[0.18em] text-landing-muted/70">
              ↓ scrolls into view
            </span>
          }
        >
          <RevealStage />
        </SpecimenCard>
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

/* ────────────────────────────────────────────────────────────────────────────
 * Shared card shell
 * ──────────────────────────────────────────────────────────────────────── */

interface SpecimenCardProps {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

const SpecimenCard = memo(function SpecimenCard({
  index,
  title,
  description,
  children,
  footer,
}: SpecimenCardProps) {
  const [ref, visible] = useScrollReveal({ threshold: 0.15 });

  return (
    <article
      ref={ref}
      className={cn(
        'flex flex-col rounded-2xl border border-landing-border bg-landing-surface overflow-hidden',
        'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-4 px-5 py-4 border-b border-landing-border">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="landing-font-mono text-[10px] tracking-[0.2em] uppercase text-landing-muted">
              №{index}
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full bg-landing-accent animate-pulse"
              aria-hidden="true"
            />
          </div>
          <h3 className="landing-font-mono text-[15px] text-landing-fg truncate">{title}</h3>
          <p className="text-[12px] text-landing-muted mt-0.5 leading-snug">{description}</p>
        </div>
      </header>

      {/* Stage */}
      <div className="relative flex-1 flex items-center justify-center min-h-[200px] p-8">
        {/* faint stage grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(color-mix(in oklch, var(--landing-border) 60%, transparent) 1px, transparent 1px)',
            backgroundSize: '100% 50%',
            maskImage: 'linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col items-center gap-4 w-full">{children}</div>
      </div>

      {/* Footer / controls */}
      {footer ? (
        <footer className="px-5 py-3.5 border-t border-landing-border flex items-center gap-3 flex-wrap bg-landing-bg/40">
          {footer}
        </footer>
      ) : null}
    </article>
  );
});

/* ────────────────────────────────────────────────────────────────────────────
 * Controls
 * ──────────────────────────────────────────────────────────────────────── */

const sliderThumb =
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-landing-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-landing-accent [&::-moz-range-thumb]:cursor-pointer';

const Field = memo(function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <span className="landing-font-mono text-[10px] uppercase tracking-[0.15em] text-landing-muted">
        {label}
      </span>
      {children}
    </label>
  );
});

const Slider = memo(function Slider({
  value,
  onChange,
  ...props
}: {
  value: number;
  onChange: (v: number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'>) {
  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn(
        'w-24 h-1 rounded-full bg-landing-border appearance-none outline-none cursor-pointer',
        sliderThumb
      )}
      {...props}
    />
  );
});

const Value = memo(function Value({ children }: { children: ReactNode }) {
  return (
    <span className="landing-font-mono text-[11px] text-landing-muted tabular-nums min-w-[42px]">
      {children}
    </span>
  );
});

const Select = memo(function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-landing-bg text-landing-fg border border-landing-border rounded-md px-2 py-1 text-[11px] landing-font-mono cursor-pointer outline-none focus:border-landing-accent transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
});

const RunBtn = memo(function RunBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-landing-accent text-landing-bg text-[12px] font-semibold cursor-pointer border-none transition-transform duration-200 hover:scale-105 active:scale-95"
    >
      <span
        className="inline-block w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-landing-bg"
        aria-hidden="true"
      />
      {children}
    </button>
  );
});

/* ────────────────────────────────────────────────────────────────────────────
 * Specimen 01 — FadeIn "orbital letter"
 * ──────────────────────────────────────────────────────────────────────── */

const FadeInStage = memo(function FadeInStage({ duration }: { duration: number }) {
  const [phase, setPhase] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Drive the phase readout with a rAF loop scaled to the configured duration.
  const runPhase = useCallback(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setPhase(Math.round(p * 100));
      if (p < 1) requestAnimationFrame(tick);
    };
    setPhase(0);
    requestAnimationFrame(tick);
  }, [duration]);

  // The actual fade is driven by useAnime in the section; this stage only
  // reports progress. A CustomEvent from the Run button kicks off the readout,
  // keeping the two decoupled without prop-drilling controls.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.addEventListener('fadeInRun', runPhase);
    return () => el.removeEventListener('fadeInRun', runPhase);
  }, [runPhase]);

  return (
    <div ref={rootRef} className="relative w-full flex flex-col items-center gap-5" data-phase-trigger>
      <div className="relative w-32 h-32 rounded-xl flex items-center justify-center">
        {/* baseline rule */}
        <span
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-px bg-landing-border"
          aria-hidden="true"
        />
        {/* corner ticks */}
        {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
          <span
            key={corner}
            className={cn(
              'absolute w-2.5 h-2.5 border-landing-muted/40',
              corner === 'tl' && 'top-2 left-2 border-t border-l',
              corner === 'tr' && 'top-2 right-2 border-t border-r',
              corner === 'bl' && 'bottom-2 left-2 border-b border-l',
              corner === 'br' && 'bottom-2 right-2 border-b border-r'
            )}
            aria-hidden="true"
          />
        ))}
        <span
          className="landing-fade-demo-box landing-font-display font-bold text-landing-accent leading-none select-none"
          style={{ fontSize: 'clamp(64px, 8vw, 84px)' }}
        >
          F
        </span>
      </div>

      <div className="flex items-center gap-2 landing-font-mono text-[11px] text-landing-muted tabular-nums">
        <span className={cn(phase > 0 ? 'text-landing-accent' : 'text-landing-muted/50')}>
          {String(phase).padStart(3, '0')}%
        </span>
        <span className="text-landing-muted/40">/</span>
        <span>100</span>
      </div>
    </div>
  );
});

/* ────────────────────────────────────────────────────────────────────────────
 * Specimen 02 — Stagger "spectrum bars"
 * ──────────────────────────────────────────────────────────────────────── */

const StaggerStage = memo(function StaggerStage() {
  return (
    <div className="flex items-end justify-center gap-2 w-full h-32">
      {[1, 2, 3, 4, 5, 6].map((n, i) => (
        <div
          key={n}
          className="landing-stagger-demo-box rounded-md flex items-end justify-center pb-1.5 landing-font-mono text-[11px] text-landing-bg"
          style={{
            width: 'clamp(22px, 18%, 34px)',
            height: `${44 + i * 14}px`,
            background: 'var(--landing-accent)',
          }}
        >
          {n}
        </div>
      ))}
    </div>
  );
});

/* ────────────────────────────────────────────────────────────────────────────
 * Specimen 03 — Magnetic "attractor field"
 * ──────────────────────────────────────────────────────────────────────── */

const MagneticStage = memo(function MagneticStage({ strength }: { strength: number }) {
  const { areaRef, dotRef, onMouseMove, onMouseLeave } = useMagnetic({ strength });

  return (
    <div
      ref={areaRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        'relative w-40 h-40 rounded-xl',
        'flex items-center justify-center cursor-crosshair',
        'border border-dashed border-landing-border',
        'overflow-hidden'
      )}
      role="button"
      aria-label="Magnetic interaction field"
      tabIndex={0}
    >
      {/* concentric field rings */}
      {[1, 0.66, 0.33].map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full border border-landing-border pointer-events-none"
          style={{
            width: `${s * 100}%`,
            height: `${s * 100}%`,
            opacity: 0.5 - i * 0.1,
          }}
          aria-hidden="true"
        />
      ))}
      {/* crosshair guides */}
      <span
        className="absolute left-1/2 top-2 bottom-2 w-px bg-landing-border/60 pointer-events-none"
        aria-hidden="true"
      />
      <span
        className="absolute top-1/2 left-2 right-2 h-px bg-landing-border/60 pointer-events-none"
        aria-hidden="true"
      />
      {/* the dot */}
      <div
        ref={dotRef}
        className="relative w-5 h-5 rounded-full bg-landing-accent shadow-[0_0_20px_color-mix(in_oklch,var(--landing-accent)_60%,transparent)] z-10"
      />
    </div>
  );
});

/* ────────────────────────────────────────────────────────────────────────────
 * Specimen 04 — Reveal "index reveal"
 * ──────────────────────────────────────────────────────────────────────── */

const REVEAL_ROWS = [
  { n: '01', title: 'Enter from below' },
  { n: '02', title: 'Fade and slide' },
  { n: '03', title: 'Staggered sequence' },
];

const RevealStage = memo(function RevealStage() {
  return (
    <div className="w-full flex flex-col">
      {REVEAL_ROWS.map((row, i) => (
        <RevealItem key={row.n} {...row} delay={i * 150} />
      ))}
    </div>
  );
});

const RevealItem = memo(function RevealItem({
  n,
  title,
  delay,
}: {
  n: string;
  title: string;
  delay: number;
}) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn(
        'group flex items-center gap-4 py-3 border-b border-landing-border/60 last:border-b-0',
        'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="landing-font-mono text-[12px] tracking-[0.15em] text-landing-muted w-6">
        {n}
      </span>
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full transition-colors duration-300',
          isVisible ? 'bg-landing-accent' : 'bg-landing-muted/30'
        )}
        aria-hidden="true"
      />
      <span className="text-[13px] text-landing-fg">{title}</span>
    </div>
  );
});
