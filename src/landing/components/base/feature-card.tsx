import { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import type { FeatureItem } from '@/landing/types';

interface FeatureCardProps extends FeatureItem {
  className?: string;
}

export const FeatureCard = memo(function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        'bg-landing-surface p-10 px-8 transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5 text-landing-accent"
        style={{
          background: 'color-mix(in oklch, var(--landing-accent) 12%, transparent)',
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="landing-font-display text-[22px] mb-2.5 leading-tight">{title}</h3>
      <p className="text-[15px] text-landing-muted leading-relaxed">{description}</p>
    </div>
  );
});
