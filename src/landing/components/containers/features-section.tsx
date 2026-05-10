import { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { LandingContainer } from '@/landing/components/ui/landing-container';
import { SectionLabel } from '@/landing/components/ui/section-label';
import { SectionHeading } from '@/landing/components/ui/section-heading';
import { SectionDescription } from '@/landing/components/ui/section-description';
import { FeatureCard } from '@/landing/components/base/feature-card';
import type { FeatureItem } from '@/landing/types';

const defaultFeatures: FeatureItem[] = [
  {
    icon: '\u2726',
    title: 'Zero boilerplate',
    description:
      'One import, one component. No useEffect, no cleanup refs, no imperative anime.js calls cluttering your components.',
  },
  {
    icon: '\u2197',
    title: 'TypeScript native',
    description:
      'Full type inference on all props. Autocomplete your animations \u2014 duration, easing, delay, stagger, all typed.',
  },
  {
    icon: '\u25CE',
    title: 'Tree-shakeable',
    description:
      'Import only what you use. <FadeIn> weighs ~1.2 kB gzipped. Your bundle stays lean.',
  },
  {
    icon: '\u25C8',
    title: 'GSAP scroll power',
    description:
      '<Reveal> wraps ScrollTrigger. <Parallax> binds to scroll position. Server-side safe with fallback.',
  },
  {
    icon: '\u25C9',
    title: 'Stagger & sequences',
    description:
      '<Stagger> accepts any easing curve. <Timeline> orchestrates multi-step sequences with precise timing.',
  },
  {
    icon: '\u25A4',
    title: 'Layout animations',
    description:
      '<AnimateLayout> handles FLIP transitions automatically. Animate between list, grid, and detail views.',
  },
];

interface FeaturesSectionProps {
  features?: FeatureItem[];
  className?: string;
}

export const FeaturesSection = memo(function FeaturesSection({
  features = defaultFeatures,
  className,
}: FeaturesSectionProps) {
  const [labelRef, labelVisible] = useScrollReveal();
  const [headingRef, headingVisible] = useScrollReveal();
  const [descRef, descVisible] = useScrollReveal();

  return (
    <LandingContainer as="section" id="features" className={cn('py-30', className)}>
      <div
        ref={labelRef}
        className={cn(
          labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          'transition-all duration-800'
        )}
      >
        <SectionLabel>Features</SectionLabel>
      </div>
      <div
        ref={headingRef}
        className={cn(
          headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          'transition-all duration-800'
        )}
      >
        <SectionHeading>
          Why developers <br className="hidden sm:block" />
          choose React AnimeJS
        </SectionHeading>
      </div>
      <div
        ref={descRef}
        className={cn(
          descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          'transition-all duration-800',
          'mb-15'
        )}
      >
        <SectionDescription>
          Drop-in components that replace raw anime.js calls. No effect refs, no cleanup code \u2014
          just props.
        </SectionDescription>
      </div>
      <div
        className="grid gap-px border border-landing-border rounded-2xl overflow-hidden"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </LandingContainer>
  );
});
