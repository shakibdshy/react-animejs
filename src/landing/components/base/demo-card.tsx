import React, { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';

interface DemoCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const DemoCard = memo(function DemoCard({
  title,
  description,
  children,
  footer,
  className,
}: DemoCardProps) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={cn(
        'bg-landing-surface border border-landing-border rounded-2xl overflow-hidden',
        'transition-all duration-600',
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.97]',
        className
      )}
    >
      <div className="p-6 pb-0">
        <h3 className="landing-font-display text-lg mb-1">{title}</h3>
        <p className="text-[13px] text-landing-muted">{description}</p>
      </div>
      <div className="px-6 py-12 flex items-center justify-center gap-3 flex-wrap min-h-45">
        <div className="flex flex-col items-center gap-4 w-full">{children}</div>
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-landing-border flex items-center gap-3 flex-wrap">
          {footer}
        </div>
      )}
    </div>
  );
});
