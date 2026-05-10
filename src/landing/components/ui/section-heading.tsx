import React, { memo } from 'react';
import { cn } from '@/landing/utils/cn';

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export const SectionHeading = memo(function SectionHeading({
  children,
  className,
  centered,
}: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        'landing-font-display font-bold tracking-tight leading-[1.1] mb-5',
        'text-[clamp(32px,5vw,56px)]',
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </h2>
  );
});
