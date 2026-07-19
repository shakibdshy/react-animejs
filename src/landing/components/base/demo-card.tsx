import React, { memo, useState } from 'react';
import { Code } from 'lucide-react';
import { CodeModal } from '@/blocks/components/CodeModal';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';

interface DemoCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  code?: string;
}

export const DemoCard = memo(function DemoCard({
  title,
  description,
  children,
  footer,
  className,
  code,
}: DemoCardProps) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.15 });
  const [isCodeOpen, setIsCodeOpen] = useState(false);

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
      <div className="flex items-start justify-between gap-4 p-6 pb-0">
        <div>
          <h3 className="landing-font-display text-lg mb-1">{title}</h3>
          <p className="text-[13px] text-landing-muted">{description}</p>
        </div>
        {code ? (
          <button
            type="button"
            onClick={() => setIsCodeOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 landing-font-mono text-[10px] uppercase tracking-wider text-landing-muted transition-colors hover:bg-landing-border/50 hover:text-landing-accent"
            aria-label={`View ${title} code`}
          >
            <Code className="h-3.5 w-3.5" aria-hidden />
            Code
          </button>
        ) : null}
      </div>
      <div className="px-6 py-12 flex items-center justify-center gap-3 flex-wrap min-h-45">
        <div className="flex flex-col items-center gap-4 w-full">{children}</div>
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-landing-border flex items-center gap-3 flex-wrap">
          {footer}
        </div>
      )}
      {code ? (
        <CodeModal
          open={isCodeOpen}
          title={`${title.replace(/[<>/]/g, '')}.tsx`}
          code={code}
          onClose={() => setIsCodeOpen(false)}
        />
      ) : null}
    </div>
  );
});
