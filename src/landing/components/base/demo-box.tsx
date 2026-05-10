import React, { memo } from 'react';
import { cn } from '@/landing/utils/cn';

interface DemoBoxProps {
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  outline?: boolean;
  muted?: boolean;
  className?: string;
}

export const DemoBox = memo(function DemoBox({
  children,
  size = 'md',
  outline = false,
  muted = false,
  className,
}: DemoBoxProps) {
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-xl',
    lg: 'w-[72px] h-[72px] text-2xl',
  };

  return (
    <div
      className={cn(
        'rounded-xl flex items-center justify-center font-bold',
        sizes[size],
        outline
          ? 'bg-transparent border-2 border-landing-accent text-landing-accent'
          : muted
            ? 'text-landing-muted'
            : 'bg-landing-accent text-landing-bg',
        outline && 'border-landing-accent',
        muted && !outline && 'bg-transparent',
        className
      )}
      style={
        muted && !outline
          ? {
              background: 'color-mix(in oklch, var(--landing-muted) 15%, transparent)',
            }
          : undefined
      }
    >
      {children}
    </div>
  );
});
