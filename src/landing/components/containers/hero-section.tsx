import { memo, useEffect, useMemo, useState } from 'react';
import { cn } from '@/landing/utils/cn';
import { Anime, fadeIn } from '@shakibdshy/react-animejs';
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
  const chars = useMemo(() => [...headline].map((char, i) => ({ key: i, char })), [headline]);

  return (
    <section
      className={cn('relative min-h-screen flex flex-col overflow-hidden pt-16', className)}
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
 * Live "motion specimen" card — a self-contained looping demo. The bars rise
 * one-by-one in sequence (true stagger, not simultaneous), and the bar
 * currently "playing" is mirrored by a highlight in the spec table below.
 *
 * State-driven rather than CSS-keyframed: `active` advances on an interval,
 * a bar is raised when its index <= active, and highlighted when equal.
 * The interval wraps to -1 so all bars drop before the next pass — keeping
 * the bars and the table perfectly in sync across every loop.
 */
const MotionSpecimen = memo(function MotionSpecimen() {
  const specs = useMemo(
    () =>
      [
        { key: '01', name: 'fadeIn', tag: 'hook', ms: '600' },
        { key: '02', name: 'stagger', tag: 'prop', ms: '60' },
        { key: '03', name: 'onScroll', tag: 'hook', ms: '800' },
      ] as const,
    []
  );

  const STAGGER_MS = 380; // delay between each bar rising
  const HOLD_MS = 1000; // pause with all bars up before the reset

  const [active, setActive] = useState(-1);
  useEffect(() => {
    const timers: number[] = [];
    let t = 80;
    // One pass: raise each bar in turn, hold, then drop them all.
    specs.forEach((_, i) => {
      timers.push(window.setTimeout(() => setActive(i), (t += STAGGER_MS)));
    });
    t += HOLD_MS;
    timers.push(window.setTimeout(() => setActive(-1), t));
    // Restart the whole pass after a brief gap with all bars down.
    const LOOP_MS = t + STAGGER_MS;
    const loopId = window.setInterval(() => {
      let s = 0;
      specs.forEach((_, i) => {
        timers.push(window.setTimeout(() => setActive(i), (s += STAGGER_MS)));
      });
      s += HOLD_MS;
      timers.push(window.setTimeout(() => setActive(-1), s));
    }, LOOP_MS);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearInterval(loopId);
    };
  }, [STAGGER_MS, HOLD_MS, specs]);

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

      {/* Active canvas — a bar rises when i <= active; the latest one glows */}
      <div className="px-6 py-10 flex items-end justify-center gap-3 min-h-52.5">
        {specs.map((s, i) => {
          const raised = i <= active;
          const playing = i === active;
          return (
            <div
              key={s.key}
              className={cn(
                'w-12 rounded-md flex items-end justify-center pb-2 landing-font-mono text-[12px]',
                playing ? 'text-landing-bg' : 'text-landing-muted/50'
              )}
              style={{
                height: `${52 + i * 26}px`,
                background: playing
                  ? 'var(--landing-accent)'
                  : raised
                    ? 'color-mix(in oklch, var(--landing-accent) 40%, transparent)'
                    : 'color-mix(in oklch, var(--landing-muted) 14%, transparent)',
                boxShadow: playing
                  ? '0 12px 34px -8px color-mix(in oklch, var(--landing-accent) 70%, transparent)'
                  : 'none',
                transform: raised ? 'translateY(0) scaleY(1)' : 'translateY(8px) scaleY(0.04)',
                opacity: raised ? 1 : 0.5,
                transformOrigin: 'bottom',
                transition: `transform ${STAGGER_MS - 60}ms cubic-bezier(0.16,1,0.3,1), opacity ${STAGGER_MS - 60}ms ease, background-color 300ms ease, box-shadow 300ms ease`,
              }}
            >
              {s.key}
            </div>
          );
        })}
      </div>

      {/* Spec table — the active row mirrors the bar currently rising */}
      <dl className="border-t border-landing-border">
        {specs.map((s, i) => {
          const isActive = i === active;
          return (
            <div
              key={s.name}
              className={cn(
                'flex items-center justify-between px-5 py-2.5 border-b border-landing-border/60 last:border-b-0 transition-colors duration-300',
                isActive ? 'bg-landing-bg/60' : 'bg-transparent'
              )}
            >
              <dt className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-300',
                    isActive ? 'bg-landing-accent scale-150' : 'bg-landing-muted/30'
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'landing-font-mono text-[13px] transition-colors duration-300',
                    isActive ? 'text-landing-fg' : 'text-landing-muted'
                  )}
                >
                  {s.name}
                </span>
                <span className="landing-font-mono text-[9px] uppercase tracking-[0.18em] text-landing-muted px-1.5 py-0.5 rounded border border-landing-border">
                  {s.tag}
                </span>
              </dt>
              <dd className="landing-font-mono text-[12px] text-landing-muted flex items-center gap-2">
                {isActive ? (
                  <span className="text-landing-accent text-[10px] uppercase tracking-[0.15em] animate-pulse">
                    now
                  </span>
                ) : null}
                {s.ms}ms
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
});
