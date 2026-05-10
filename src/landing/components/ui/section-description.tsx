import React, { memo } from 'react';
import { cn } from '@/landing/utils/cn';

interface SectionDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionDescription = memo(function SectionDescription({
  children,
  className,
}: SectionDescriptionProps) {
  return (
    <p className={cn('text-lg text-landing-muted leading-relaxed max-w-150', className)}>
      {children}
    </p>
  );
});
