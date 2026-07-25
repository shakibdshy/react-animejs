import { memo, useMemo } from 'react';
import { cn } from '@/landing/utils/cn';
import { Anime, fadeIn } from '@/lib/react-animejs';
import { Btn } from '@/landing/components/ui/btn';
import type { HeroProps } from '@/landing/types';

interface HeroSectionProps extends HeroProps {
  className?: string;
}

/**
 * Editorial "cover" hero. Instead of a centered column, the cover uses a
 * 12-col grid: the serif masthead wordmark runs across the top, the giant
 * display headline anchors the left, and a live "motion specimen" panel sits
 * on the right — a looping sample of the very library the page documents.
 */
export const HeroSection = memo(function HeroSection({
  eyebrow,
  words,
  description,
  primaryCta,
  secondaryCta,
  className,
}: HeroSectionProps) {
  const headline = words.join(' ');
  const chars = useMemo(
    () => [...headline].map((char, i) => ({ key: i, char })),
    [headline]
  );

  return (
    <section
      className={cn(
        'relative min-h-screen flex flex-col overflow-hidden pt-16',
        className
      )}
      aria-label="Hero"
    >
      {/* Atmospheric washes — same accent, restrained */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(80% 60% at 85% 0%, color-mix(in oklch, var(--landing-accent) 7%, transparent) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      {/* Hairline column rules for editorial structure */}
      <Rules aria-hidden="true" />

      <div className="relative z-10 flex-1 grid grid-cols-12 gap-x-6 px-6 max-w-300 mx-auto w-full pt-14 pb-20">
        {/* ── Masthead row ─────────────────────────────── */}
        <div className="col-span-12 flex items-baseline justify-between border-b border-landing-border pb-4 mb-14">
          <Anime {...fadeIn} autoplay>
            <span className="landing-font-mono text-[11px] tracking-[0.3em] uppercase text-landing-muted">
              {eyebrow}
            </span>
          </Anime>
          <span className="landing-font-mono text-[11px] tracking-[0.2em] uppercase text-landing-muted hidden sm:block">
            Issue №02 · MMXXVI
          </span>
        </div>

        {/* ── Display headline (left, 7 cols) ─────────── */}
        <div className="col-span-12 lg:col-span-7">
          <h1
            className="landing-font-display font-bold tracking-[-0.02em] leading-[0.9] text-landing-fg mb-8"
            style={{ fontSize: 'clamp(56px, 9.5vw, 132px)' }}
          >
            {chars.map((c, i) => (
              <span
                key={c.key}
                className="inline-block"
                style={{
                  animation: `charReveal 0.8s cubic-bezier(0.16,1,0.3,1) ${350 + i * 22}ms both`,
                  whiteSpace: c.char === ' ' ? 'pre' : 'normal',
                }}
              >
                {c.char}
              </span>
            ))}
          </h1>
          <Anime {...fadeIn} delay={250} autoplay>
            <p className="text-[19px] leading-relaxed text-landing-muted max-w-130 mb-12">
              {description}
            </p>
          </Anime>
          <Anime {...fadeIn} delay={400} autoplay>
            <div className="flex gap-3 flex-wrap items-center">
              <Btn href={primaryCta.href}>{primaryCta.label}</Btn>
              <Btn variant="secondary" href={secondaryCta.href}>
                {secondaryCta.label}
              </Btn>
              <span className="landing-font-mono text-[12px] text-landing-muted hidden md:inline ml-2">
                {'\u25CF'} MIT licensed
              </span>
            </div>
          </Anime>
        </div>

        {/* ── Motion specimen panel (right, 5 cols) ───── */}
        <div className="col-span-12 lg:col-span-5 mt-16 lg:mt-0">
          <MotionSpecimen />
        </div>
      </div>

      {/* ── Bottom byline strip ──────────────────────── */}
      <div className="relative z-10 border-t border-landing-border">
        <div className="max-w-300 mx-auto px-6 py-4 flex items-center justify-between">
          <span className="landing-font-mono text-[11px] tracking-[0.2em] uppercase text-landing-muted">
            Scroll to read
          </span>
          <span className="landing-font-mono text-[11px] tracking-[0.2em] uppercase text-landing-muted hidden sm:block">
            A field guide to React motion
          </span>
          <span className="landing-font-mono text-[11px] tracking-[0.2em] uppercase text-landing-muted">
            ↓
          </span>
        </div>
      </div>

      <style>{`
        @keyframes charReveal {
          from { opacity: 0; transform: translateY(90px) rotateX(-45deg); }
          to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
        }
      `}</style>
    </section>
  );
});

/** Hairline vertical column guides, faded for texture. */
const Rules = memo(function Rules({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'absolute inset-0 hidden lg:grid grid-cols-12 max-w-300 mx-auto px-6 pointer-events-none',
        className
      )}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="h-full"
          style={{
            borderRight:
              i < 11
                ? `1px solid color-mix(in oklch, var(--landing-border) 45%, transparent)`
                : 'none',
          }}
        />
      ))}
    </div>
  );
});

/**
 * Live "motion specimen" card — a self-contained looping demo of three
 * primitives the library offers (fade, stagger, orbit). It advertises the
 * product by being the product.
 */
const MotionSpecimen = memo(function MotionSpecimen() {
  const [cells, specs] = useMemo(
    () => [
      ['01', '02', '03'],
      [
        { name: 'fadeIn', tag: 'hook', ms: '600' },
        { name: 'stagger', tag: 'prop', ms: '60' },
        { name: 'onScroll', tag: 'hook', ms: '800' },
      ],
    ] as const,
    []
  );

  return (
    <div className="relative rounded-2xl border border-landing-border bg-landing-surface/70 backdrop-blur-sm overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-landing-border">
        <span className="landing-font-mono text-[10px] tracking-[0.25em] uppercase text-landing-muted">
          Specimen / live
        </span>
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-landing-accent opacity-80" />
          <span className="w-2 h-2 rounded-full bg-landing-muted opacity-30" />
          <span className="w-2 h-2 rounded-full bg-landing-muted opacity-30" />
        </div>
      </div>

      {/* Active canvas */}
      <div className="px-6 py-10 flex items-center justify-center min-h-[210px]">
        <Anime
          opacity={[0, 1]}
          translateY={[14, 0]}
          duration={900}
          ease="outCubic"
          loop
          loopDelay={1400}
          direction="alternate"
          autoplay
        >
          <div className="flex items-end gap-3">
            {cells.map((n, i) => (
              <div
                key={n}
                className="w-12 rounded-md flex items-center justify-center landing-font-mono text-sm text-landing-accent"
                style={{
                  height: `${48 + i * 22}px`,
                  background:
                    'color-mix(in oklch, var(--landing-accent) 14%, transparent)',
                  animation: `specPulse 2.4s ease-in-out ${i * 0.18}s infinite`,
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </Anime>
      </div>

      {/* Spec table */}
      <dl className="border-t border-landing-border">
        {specs.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between px-5 py-2.5 border-b border-landing-border/60 last:border-b-0"
          >
            <dt className="flex items-center gap-2.5">
              <span className="landing-font-mono text-[13px] text-landing-fg">
                {s.name}
              </span>
              <span className="landing-font-mono text-[9px] uppercase tracking-[0.18em] text-landing-muted px-1.5 py-0.5 rounded border border-landing-border">
                {s.tag}
              </span>
            </dt>
            <dd className="landing-font-mono text-[12px] text-landing-muted">
              {s.ms}ms
            </dd>
          </div>
        ))}
      </dl>

      <style>{`
        @keyframes specPulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
});
