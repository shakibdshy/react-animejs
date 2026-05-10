import { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { LandingContainer } from '@/landing/components/ui/landing-container';
import { SectionLabel } from '@/landing/components/ui/section-label';
import { SectionHeading } from '@/landing/components/ui/section-heading';
import { SectionDescription } from '@/landing/components/ui/section-description';
import { TestimonialCard } from '@/landing/components/base/testimonial-card';
import type { TestimonialItem } from '@/landing/types';

const defaultTestimonials: TestimonialItem[] = [
  {
    text: 'React AnimeJS replaced our entire custom animation layer. The useAnime hook alone saved us 200+ lines of boilerplate.',
    authorInitials: 'SK',
    authorName: 'Sarah Kim',
    authorRole: 'Lead Engineer, Luma',
  },
  {
    text: 'I\u2019ve tried every React animation library. React AnimeJS is the first that feels like it was built for how I actually think about animations \u2014 composable, typed, zero surprises.',
    authorInitials: 'JC',
    authorName: 'James Chen',
    authorRole: 'OSS Contributor',
  },
  {
    text: 'Ship time went from 2 days to 2 hours on our onboarding flow. <Stagger> + <Timeline> is the killer combo.',
    authorInitials: 'AP',
    authorName: 'Aisha Patel',
    authorRole: 'Senior Frontend, Wave',
  },
];

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
  className?: string;
}

export const TestimonialsSection = memo(function TestimonialsSection({
  testimonials = defaultTestimonials,
  className,
}: TestimonialsSectionProps) {
  const [labelRef, labelVisible] = useScrollReveal();
  const [headingRef, headingVisible] = useScrollReveal();
  const [descRef, descVisible] = useScrollReveal();

  return (
    <LandingContainer as="section" id="testimonials" className={cn('py-30', className)}>
      <div
        ref={labelRef}
        className={cn(
          labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          'transition-all duration-800'
        )}
      >
        <SectionLabel>Community</SectionLabel>
      </div>
      <div
        ref={headingRef}
        className={cn(
          headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          'transition-all duration-800'
        )}
      >
        <SectionHeading>Loved by developers</SectionHeading>
      </div>
      <div
        ref={descRef}
        className={cn(
          descVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
          'transition-all duration-800',
          'mb-15'
        )}
      >
        <SectionDescription>From indie hackers to enterprise teams.</SectionDescription>
      </div>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {testimonials.map((t) => (
          <TestimonialCard key={t.authorName} {...t} />
        ))}
      </div>
    </LandingContainer>
  );
});
