import { memo } from 'react';
import { AnimeProvider } from '@/lib/react-animejs';
import { ErrorBoundary } from '@/landing/components/ui/error-boundary';
import { LandingHeader } from '@/landing/components/containers/landing-header';
import { HeroSection } from '@/landing/components/containers/hero-section';
import { FeaturesSection } from '@/landing/components/containers/features-section';
import { DemosSection } from '@/landing/components/containers/demos-section';
import { CodeShowcaseSection } from '@/landing/components/containers/code-showcase-section';
import { TestimonialsSection } from '@/landing/components/containers/testimonials-section';
import { CtaSection } from '@/landing/components/containers/cta-section';
import { FooterSection } from '@/landing/components/containers/footer-section';
import type { FeatureItem, FooterColumn, NavItem, TestimonialItem } from '@/landing/types';

interface LandingPageProps {
  features?: FeatureItem[];
  testimonials?: TestimonialItem[];
  footerColumns?: FooterColumn[];
  footerSocials?: NavItem[];
  navItems?: NavItem[];
}

export const LandingPage = memo(function LandingPage({
  features,
  testimonials,
  footerColumns,
  footerSocials,
  navItems,
}: LandingPageProps) {
  return (
    <AnimeProvider>
      <div className="min-h-screen bg-landing-bg text-landing-fg transition-[background,color] duration-[0.35s] ease-in-out">
        <LandingHeader navItems={navItems} />
        <main>
          <ErrorBoundary>
            <HeroSection
              eyebrow="v2.0 \u2014 React animation library"
              words={['Animations', 'that', 'flow.']}
              description="The animation power of anime.js, wrapped in beautiful React components. Zero boilerplate. Production-ready."
              primaryCta={{ label: 'See the demos \u2192', href: '/demos' }}
              secondaryCta={{
                label: 'npm install react-animejs',
                href: '#install',
              }}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <FeaturesSection features={features} />
          </ErrorBoundary>
          <ErrorBoundary>
            <DemosSection />
          </ErrorBoundary>
          <ErrorBoundary>
            <CodeShowcaseSection />
          </ErrorBoundary>
          <ErrorBoundary>
            <TestimonialsSection testimonials={testimonials} />
          </ErrorBoundary>
          <ErrorBoundary>
            <CtaSection />
          </ErrorBoundary>
        </main>
        <ErrorBoundary>
          <FooterSection columns={footerColumns} socials={footerSocials} />
        </ErrorBoundary>
      </div>
    </AnimeProvider>
  );
});
