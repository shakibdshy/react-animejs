import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { GalleryPreview } from './gallery-preview';
import type { DemoSection } from '../types';
import type { DemoId } from '../data';

interface GalleryCardProps {
  demo: DemoSection<DemoId>;
  demoIndex: number;
}

export const GalleryCard = memo(function GalleryCard({
  demo,
  demoIndex,
}: GalleryCardProps) {
  const [ref, isVisible] = useScrollReveal<HTMLAnchorElement>({ threshold: 0.1 });

  return (
    <Link
      to="/demos/$componentId"
      params={{ componentId: demo.componentId }}
      ref={ref}
      aria-label={`Open ${demo.title} component details`}
      className={`bg-landing-surface border border-landing-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 flex flex-col group hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:border-landing-accent/30 no-underline ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.97]'
      }`}
      style={{ transitionDelay: `${(demoIndex % 12) * 40}ms` }}
    >
      <GalleryPreview demoId={demo.componentId} />
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
          Open details
        </div>
      </div>
    </Link>
  );
});
