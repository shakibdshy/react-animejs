import { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';

interface SectionHeaderProps {
  /** Mono eyebrow / kicker, e.g. "Chapter II" */
  index?: string;
  /** Large editorial numeral rendered as a drop figure, e.g. "02" */
  numeral?: string;
  label: string;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Art-directed section masthead used across the redesigned landing page.
 *
 * Replaces the older SectionLabel / SectionHeading / SectionDescription trio
 * with a single asymmetric editorial composition: a serif numeral sits beside
 * a mono kicker and serif headline. Keeps the existing --landing-* theme
 * tokens and the scroll-reveal hook so motion language is unchanged.
 */
export const SectionHeader = memo(function SectionHeader({
  index,
  numeral,
  label,
  heading,
  intro,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const [ref, visible] = useScrollReveal();
  const centered = align === 'center';

  return (
    <header
      ref={ref}
      className={cn(
        'transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        centered ? 'text-center' : 'text-left',
        className
      )}
    >
      <div className={cn('flex', centered ? 'flex-col items-center' : 'items-end gap-6')}>
        {numeral ? (
          <span
            className="landing-font-display font-bold leading-none text-landing-accent select-none"
            style={{ fontSize: 'clamp(56px, 8vw, 96px)' }}
            aria-hidden="true"
          >
            {numeral}
          </span>
        ) : null}
        <div className={cn(centered && 'flex flex-col items-center')}>
          <p className="landing-font-mono text-[11px] tracking-[0.28em] uppercase text-landing-muted mb-3">
            {index ? `${index} — ` : ''}
            <span className="text-landing-accent">{label}</span>
          </p>
          <h2
            className="landing-font-display font-bold tracking-tight leading-[1.02] text-landing-fg"
            style={{ fontSize: 'clamp(30px, 4.6vw, 52px)' }}
          >
            {heading}
          </h2>
        </div>
      </div>
      {intro ? (
        <p
          className={cn(
            'text-[17px] text-landing-muted leading-relaxed mt-6 max-w-150',
            centered && 'mx-auto'
          )}
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
});
