import React, { memo } from 'react';
import { cn } from '@/landing/utils/cn';

interface LandingContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'footer';
  id?: string;
  padded?: boolean;
}

export const LandingContainer = memo(function LandingContainer({
  children,
  className,
  as: Tag = 'div',
  id,
  padded = true,
}: LandingContainerProps) {
  return (
    <Tag id={id} className={cn(padded && 'py-30', className)}>
      <div className="max-w-300 mx-auto px-6">{children}</div>
    </Tag>
  );
});
