import { memo, useMemo } from 'react';
import { cn } from '@/landing/utils/cn';
import { Anime, fadeIn } from '@/lib/react-animejs';
import { Btn } from '@/landing/components/ui/btn';
import { ScrollIndicator } from '@/landing/components/ui/scroll-indicator';
import type { HeroProps } from '@/landing/types';

interface HeroSectionProps extends HeroProps {
  className?: string;
}

export const HeroSection = memo(function HeroSection({
  eyebrow,
  words,
  description,
  primaryCta,
  secondaryCta,
  className,
}: HeroSectionProps) {
  const chars = useMemo(
    () =>
      words.flatMap((word, wi) => [
        ...[...word].map((char, ci) => ({
          key: `${wi}-${ci}`,
          char,
        })),
        ...(wi < words.length - 1 ? [{ key: `${wi}-space`, char: '\u00A0' }] : []),
      ]),
    [words]
  );

  return (
    <section
      className={cn(
        'min-h-screen flex flex-col justify-center relative overflow-hidden pt-16',
        className
      )}
      aria-label="Hero"
    >
      <div
        className="absolute -top-1/2 -right-[20%] w-200 h-200 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklch, var(--landing-accent) 6%, transparent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-300 mx-auto px-6">
        <Anime {...fadeIn} autoplay>
          <p className="landing-font-mono text-[13px] tracking-widest uppercase text-landing-accent mb-6">
            {eyebrow}
          </p>
        </Anime>
        <h1 className="landing-font-display font-bold tracking-tight leading-[0.92] mb-8 max-w-225 text-[clamp(48px,10vw,112px)]">
          {chars.map((c, i) => (
            <span
              key={c.key}
              className="inline-block"
              style={{
                animation: `charReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${400 + i * 25}ms both`,
              }}
            >
              {c.char}
            </span>
          ))}
        </h1>
        <Anime {...fadeIn} delay={200} autoplay>
          <p className="text-xl text-landing-muted max-w-130 leading-relaxed mb-12">
            {description}
          </p>
        </Anime>
        <div className="flex gap-4 flex-wrap">
          <Btn href={primaryCta.href}>{primaryCta.label}</Btn>
          <Btn variant="secondary" href={secondaryCta.href}>
            {secondaryCta.label}
          </Btn>
        </div>
      </div>
      <ScrollIndicator />
      <style>{`
        @keyframes charReveal {
          from { opacity: 0; transform: translateY(80px) rotateX(-40deg); }
          to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
        }
      `}</style>
    </section>
  );
});
