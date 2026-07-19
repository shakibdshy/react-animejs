import { Children, isValidElement, type ReactElement, type ReactNode, useState } from 'react';
import { Code } from 'lucide-react';
import { CodeModal } from '@/blocks/components/CodeModal';
import { demoDetails } from '@/component-gallery/data';
import type { DemoId } from '@/component-gallery/data';

interface DemoSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  /** Override the inferred API starter, or pass false for a deliberately visual-only section. */
  codeId?: DemoId | false;
  /** Group sections already provide their own child section framing. */
  frameChildren?: boolean;
}

function inferCodeId(title: string): DemoId | undefined {
  const normalized = title.toLowerCase();
  if (normalized.includes('timeline') || normalized.includes('callback') || normalized.includes('call') || normalized.includes('position')) return 'timeline';
  if (normalized.includes('timer') || normalized.includes('countdown') || normalized.includes('playback')) return 'timer';
  if (normalized.includes('draggable') || normalized.includes('drag')) return 'draggable';
  if (normalized.includes('scroll-linked') || normalized.includes('parallax')) return 'scroll-linked-animations';
  if (normalized.includes('scroll') || normalized.includes('scrub')) return 'on-scroll';
  if (normalized.includes('layout') || normalized.includes('reorder')) return normalized.includes('reorder') ? 'reorder-list' : 'layout';
  if (normalized.includes('scope')) return 'scope';
  if (normalized.includes('split') || normalized.includes('scramble') || normalized.includes('text')) {
    return normalized.includes('scramble') ? 'scramble-text' : 'split-text';
  }
  if (normalized.includes('toggle')) return 'toggle-switch';
  if (normalized.includes('counter')) return 'counter-countdown';
  if (normalized.includes('cube')) return 'spinning-cube';
  if (normalized.includes('clippath') || normalized.includes('clip path')) return 'clippath-reveal';
  if (normalized.includes('slider')) return 'animated-slider';
  if (normalized.includes('svg')) return 'svg-draw';
  if (normalized.includes('basic') || normalized.includes('core') || normalized.includes('selector') || normalized.includes('target')) return 'basic-animation';
  return undefined;
}

function isNestedDemoSection(child: ReactNode): child is ReactElement {
  return isValidElement(child) && child.type === DemoSection;
}

export const DemoSection: React.FC<DemoSectionProps> = ({
  title,
  children,
  className = '',
  codeId,
  frameChildren = false,
}) => {
  const items = Children.toArray(children);
  const containsSections = items.some(isNestedDemoSection);
  const isGroup = codeId === false;
  const resolvedCodeId = codeId === false ? undefined : codeId ?? inferCodeId(title);
  const detail = resolvedCodeId ? demoDetails[resolvedCodeId] : undefined;
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  return (
    <section className={`demo-example-section ${isGroup ? 'demo-example-section--group' : 'demo-example-section--leaf'} w-full ${className}`}>
      <header className="mb-6 flex items-end justify-between gap-6 border-b border-landing-border pb-4">
        <div>
          <p className="mb-2 landing-font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-landing-accent">
            {isGroup ? 'Playground section' : 'Interactive example'}
          </p>
          <h2 className="landing-font-display text-2xl tracking-tight text-landing-fg sm:text-3xl">
            {title}
          </h2>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {detail && !isGroup ? (
            <button
              type="button"
              onClick={() => setIsCodeOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-landing-border px-3 py-1 landing-font-mono text-[10px] uppercase tracking-[0.16em] text-landing-muted transition-colors hover:border-landing-accent hover:text-landing-accent"
            >
              <Code size={12} aria-hidden />
              View code
            </button>
          ) : null}
          <span className="rounded-full border border-landing-border px-3 py-1 landing-font-mono text-[10px] uppercase tracking-[0.16em] text-landing-muted">
            Live controls
          </span>
        </div>
      </header>

      <div className={`demo-example-grid grid grid-cols-1 gap-6 ${items.length > 1 ? 'xl:grid-cols-2' : ''}`}>
        {items.map((child, index) => (
          isNestedDemoSection(child) || !frameChildren ? child : (
            <div className="demo-example-item" key={index}>
              {child}
            </div>
          )
        ))}
      </div>

      {detail && !containsSections ? (
        <CodeModal
          open={isCodeOpen}
          title={`${detail.component}.tsx`}
          code={detail.code}
          onClose={() => setIsCodeOpen(false)}
        />
      ) : null}
    </section>
  );
};
