import { memo, useCallback } from 'react';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { PreviewRenderer } from './preview-renderer';
import type { DemoSection } from '../types';

interface GalleryCardProps {
  demo: DemoSection;
  demoIndex: number;
  onClick: () => void;
}

export const GalleryCard = memo(function GalleryCard({
  demo,
  demoIndex,
  onClick,
}: GalleryCardProps) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  return (
    <div
      ref={ref}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${demo.title} demo details`}
      className={`bg-landing-surface border border-landing-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 flex flex-col group hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:border-landing-accent/30 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.97]'
      }`}
      style={{ transitionDelay: `${(demoIndex % 12) * 40}ms` }}
    >
      <PreviewRenderer demoIndex={demoIndex} />
      <div className="p-5 pb-6 flex-1 flex flex-col">
        <span className="landing-font-mono text-[10px] tracking-widest uppercase text-landing-accent mb-2">
          {demo.category}
        </span>
        <h3 className="landing-font-display text-lg mb-1.5 group-hover:text-landing-accent transition-colors duration-200">
          {demo.title}
        </h3>
        <p className="text-[13px] text-landing-muted leading-relaxed flex-1">{demo.description}</p>
        <div className="landing-font-mono text-[11px] text-landing-muted/60 mt-3 pt-3 border-t border-landing-border flex items-center gap-1.5">
          <span className="text-landing-accent">&rarr;</span>
          {demo.path}
        </div>
      </div>
    </div>
  );
});
