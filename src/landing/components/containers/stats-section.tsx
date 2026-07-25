import { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';

interface Stat {
  value: string;
  label: string;
  sub?: string;
}

const STATS: Stat[] = [
  { value: '1.2', label: 'kB', sub: 'gzipped, <FadeIn> only' },
  { value: '25+', label: 'components', sub: 'hooks & declarative tags' },
  { value: '46', label: 'easings', sub: 'named curves, plus springs' },
  { value: '0', label: 'configs', sub: 'sensible typed defaults' },
];

interface StatsSectionProps {
  className?: string;
}

/**
 * Editorial data band — four figures separated by hairline rules. The accent
 * treatment is reserved for the figures themselves so the band reads like a
 * printed stat sheet.
 */
export const StatsSection = memo(function StatsSection({
  className,
}: StatsSectionProps) {
  const [ref, visible] = useScrollReveal();

  return (
    <section
      className={cn('border-y border-landing-border', className)}
      aria-label="By the numbers"
    >
      <div
        ref={ref}
        className={cn(
          'max-w-300 mx-auto px-6 grid grid-cols-2 lg:grid-cols-4',
          'transition-all duration-700',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              'py-12 px-5 flex flex-col gap-2',
              i > 0 && 'lg:border-l border-landing-border',
              i % 2 === 1 && 'border-l border-landing-border lg:border-l',
              i >= 2 && 'border-t border-landing-border lg:border-t-0'
            )}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="landing-font-display font-bold leading-none text-landing-accent"
                style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}
              >
                {s.value}
              </span>
              <span className="landing-font-mono text-[12px] tracking-[0.15em] uppercase text-landing-muted">
                {s.label}
              </span>
            </div>
            {s.sub ? (
              <span className="text-[13px] text-landing-muted leading-snug max-w-[18ch]">
                {s.sub}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
});
