import { memo } from 'react';
import { cn } from '@/landing/utils/cn';

interface ScrollIndicatorProps {
  className?: string;
}

export const ScrollIndicator = memo(function ScrollIndicator({ className }: ScrollIndicatorProps) {
  return (
    <div
      className={cn(
        'absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2',
        'text-landing-muted landing-font-mono text-[11px] tracking-widest uppercase',
        className
      )}
      aria-hidden="true"
    >
      <span>Scroll</span>
      <div className="landing-scroll-line" />
    </div>
  );
});
