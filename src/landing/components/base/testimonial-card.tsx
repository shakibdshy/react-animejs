import { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import type { TestimonialItem } from '@/landing/types';

interface TestimonialCardProps extends TestimonialItem {
  className?: string;
}

export const TestimonialCard = memo(function TestimonialCard({
  text,
  authorInitials,
  authorName,
  authorRole,
  className,
}: TestimonialCardProps) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        'bg-landing-surface border border-landing-border rounded-2xl p-8',
        'transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
        className
      )}
    >
      <p className="text-base leading-[1.7] mb-5 text-landing-fg">
        <span
          className="landing-font-display text-[48px] leading-none align-[-12px] text-landing-accent mr-1"
          aria-hidden="true"
        >
          {'\u201C'}
        </span>
        {text}
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-landing-accent landing-font-display"
          style={{
            background: 'color-mix(in oklch, var(--landing-accent) 15%, transparent)',
          }}
          aria-hidden="true"
        >
          {authorInitials}
        </div>
        <div>
          <div className="text-sm font-semibold">{authorName}</div>
          <div className="text-xs text-landing-muted">{authorRole}</div>
        </div>
      </div>
    </div>
  );
});
