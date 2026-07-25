import { memo, useEffect, useState } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { LandingContainer } from '@/landing/components/ui/landing-container';
import type { TestimonialItem } from '@/landing/types';

const defaultTestimonials: TestimonialItem[] = [
  {
    text: 'React AnimeJS replaced our entire custom animation layer. The useAnime hook alone saved us 200+ lines of boilerplate.',
    authorInitials: 'SK',
    authorName: 'Sarah Kim',
    authorRole: 'Lead Engineer, Luma',
  },
  {
    text: 'I\u2019ve tried every React animation library. This is the first that feels like it was built for how I actually think about animations \u2014 composable, typed, zero surprises.',
    authorInitials: 'JC',
    authorName: 'James Chen',
    authorRole: 'OSS Contributor',
  },
  {
    text: 'Ship time went from two days to two hours on our onboarding flow. <Stagger> + <Timeline> is the killer combo.',
    authorInitials: 'AP',
    authorName: 'Aisha Patel',
    authorRole: 'Senior Frontend, Wave',
  },
];

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
  className?: string;
}

/**
 * Single oversized pull-quote that cycles through voices, with the full set
 * indexed as a dot strip. Reads like the centerfold quote of a magazine
 * rather than a row of identical cards.
 */
export const TestimonialsSection = memo(function TestimonialsSection({
  testimonials = defaultTestimonials,
  className,
}: TestimonialsSectionProps) {
  const [active, setActive] = useState(0);
  const [ref, visible] = useScrollReveal({ threshold: 0.2 });

  useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % testimonials.length),
      6000
    );
    return () => window.clearInterval(id);
  }, [visible, testimonials.length]);

  const current = testimonials[active];

  return (
    <section
      className={cn('border-y border-landing-border bg-landing-surface/50', className)}
      aria-label="Testimonials"
    >
      <LandingContainer className="!py-0">
        <div
          ref={ref}
          className={cn(
            'py-28 max-w-200 mx-auto text-center',
            'transition-all duration-1000',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span
            className="block landing-font-display text-landing-accent leading-none mb-6"
            style={{ fontSize: 'clamp(72px, 12vw, 128px)' }}
            aria-hidden="true"
          >
            {'\u201C'}
          </span>

          <blockquote
            key={active}
            className="landing-font-display font-medium tracking-tight leading-[1.18] text-landing-fg text-balance"
            style={{
              fontSize: 'clamp(26px, 3.6vw, 42px)',
              animation: 'quoteIn 0.7s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {current.text}
          </blockquote>

          <div className="mt-10 flex items-center justify-center gap-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-landing-accent landing-font-display"
              style={{
                background: 'color-mix(in oklch, var(--landing-accent) 15%, transparent)',
              }}
              aria-hidden="true"
            >
              {current.authorInitials}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-landing-fg">
                {current.authorName}
              </div>
              <div className="text-xs text-landing-muted">{current.authorRole}</div>
            </div>
          </div>

          {/* Dot index */}
          <div className="mt-10 flex items-center justify-center gap-2" role="tablist" aria-label="Select testimonial">
            {testimonials.map((t, i) => (
              <button
                key={t.authorName}
                role="tab"
                aria-selected={i === active}
                aria-label={`Quote from ${t.authorName}`}
                onClick={() => setActive(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 cursor-pointer border-0',
                  i === active
                    ? 'w-7 bg-landing-accent'
                    : 'w-1.5 bg-landing-muted/40 hover:bg-landing-muted'
                )}
              />
            ))}
          </div>
        </div>
      </LandingContainer>

      <style>{`
        @keyframes quoteIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
});
