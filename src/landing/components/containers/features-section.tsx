import { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { LandingContainer } from '@/landing/components/ui/landing-container';
import { SectionHeader } from '@/landing/components/ui/section-header';
import type { FeatureItem } from '@/landing/types';

const defaultFeatures: FeatureItem[] = [
  {
    icon: '\u2726',
    title: 'Zero boilerplate',
    description:
      'One import, one component. No useEffect, no cleanup refs, no imperative anime.js calls cluttering your render.',
  },
  {
    icon: '\u2197',
    title: 'TypeScript native',
    description:
      'Full type inference on every prop. Autocomplete your animations — duration, easing, delay, stagger, all typed.',
  },
  {
    icon: '\u25CE',
    title: 'Tree-shakeable',
    description:
      'Import only what you use. <FadeIn> weighs ~1.2 kB gzipped. Your bundle stays lean by default.',
  },
  {
    icon: '\u25C8',
    title: 'Scroll, handled',
    description:
      'useAnimeOnScroll wraps ScrollTrigger. Reveal, parallax, and progress — server-side safe with a fallback.',
  },
  {
    icon: '\u25C9',
    title: 'Stagger & sequences',
    description:
      'Compose stagger with any easing curve. Orchestrate multi-step timelines with precise keyframe timing.',
  },
  {
    icon: '\u25A4',
    title: 'Layout animations',
    description:
      'useAnimeLayout runs FLIP automatically. Animate between list, grid, and detail views without measuring.',
  },
];

interface FeaturesSectionProps {
  features?: FeatureItem[];
  className?: string;
}

/**
 * Editorial "index of capabilities". Each row is a hairline-separated entry
 * with a mono index number, a serif title, and a muted description — reads
 * like the table of contents of a design journal rather than a card grid.
 */
export const FeaturesSection = memo(function FeaturesSection({
  features = defaultFeatures,
  className,
}: FeaturesSectionProps) {
  return (
    <LandingContainer as="section" id="features" className={cn('py-30', className)}>
      <SectionHeader
        index="Chapter I"
        numeral="01"
        label="Capabilities"
        heading={
          <>
            Why developers <br className="hidden sm:block" />
            reach for it.
          </>
        }
        intro="Six reasons it replaces a hand-rolled animation layer — each one a chapter of its own."
      />

      <ol className="mt-16 border-t border-landing-border">
        {features.map((f, i) => (
          <FeatureRow key={f.title} {...f} index={i} />
        ))}
      </ol>
    </LandingContainer>
  );
});

const FeatureRow = memo(function FeatureRow({
  icon,
  title,
  description,
  index,
}: FeatureItem & { index: number }) {
  const [ref, visible] = useScrollReveal<HTMLLIElement>({ threshold: 0.25 });

  return (
    <li
      ref={ref}
      className={cn(
        'group relative grid grid-cols-12 gap-6 items-start py-8 border-b border-landing-border',
        'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      )}
    >
      {/* Index */}
      <div className="col-span-2 sm:col-span-1">
        <span className="landing-font-mono text-[12px] tracking-[0.18em] text-landing-muted">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Title + glyph */}
      <div className="col-span-10 sm:col-span-5">
        <h3 className="landing-font-display text-[26px] leading-tight text-landing-fg flex items-center gap-3 transition-colors duration-300 group-hover:text-landing-accent">
          <span
            className="text-landing-accent text-2xl transition-transform duration-500 group-hover:scale-110"
            aria-hidden="true"
          >
            {icon}
          </span>
          {title}
        </h3>
      </div>

      {/* Description */}
      <div className="col-span-12 sm:col-span-6">
        <p className="text-[16px] text-landing-muted leading-relaxed">{description}</p>
      </div>

      {/* Hover rule that grows from the left */}
      <span
        className="absolute left-0 top-0 h-px bg-landing-accent origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] scale-x-0 group-hover:scale-x-100"
        style={{ width: '100%' }}
        aria-hidden="true"
      />
    </li>
  );
});
