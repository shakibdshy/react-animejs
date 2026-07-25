import { memo, useCallback, useEffect, useState } from 'react';
import { cn } from '@/landing/utils/cn';

interface BackToTopProps {
  /** Pixel scroll threshold before the button appears. */
  threshold?: number;
  className?: string;
}

/**
 * Fixed bottom-right "back to top" control with a scroll-progress ring.
 *
 * An SVG circle strokeDashoffset tracks scroll position (0% → 100%), and an
 * upward chevron sits in the center. The button fades + lifts in once the user
 * scrolls past `threshold`, and smooth-scrolls to the top on click. Honors
 * prefers-reduced-motion for the scroll-to-top behavior.
 */
export const BackToTop = memo(function BackToTop({
  threshold = 400,
  className,
}: BackToTopProps) {
  const [progress, setProgress] = useState(0); // 0..1
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, p)));
      setVisible(scrollTop > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [threshold]);

  const handleClick = useCallback(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }, []);

  const RADIUS = 20;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const pct = Math.round(progress * 100);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Back to top — ${pct}% scrolled`}
      title="Back to top"
      className={cn(
        'group fixed bottom-6 right-6 z-40 cursor-pointer',
        'flex items-center justify-center',
        'w-12 h-12 rounded-full',
        'bg-landing-bg/85 backdrop-blur-md border border-landing-border',
        'text-landing-muted hover:text-landing-fg',
        'shadow-[0_8px_30px_-10px_color-mix(in_oklch,var(--landing-fg)_30%,transparent)]',
        'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none',
        className
      )}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 -rotate-90"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          stroke="var(--landing-border)"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          stroke="var(--landing-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.15s linear' }}
        />
      </svg>

      {/* Up chevron */}
      <svg
        className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 8.5L7 4.5L11 8.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Percentage readout, visible on hover */}
      <span
        className="absolute right-full mr-3 landing-font-mono text-[10px] tracking-[0.15em] uppercase text-landing-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        aria-hidden="true"
      >
        {pct}%
      </span>
    </button>
  );
});
