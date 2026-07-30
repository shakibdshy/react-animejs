import { memo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  AnimeLayout,
  AnimeLayoutItem,
  AnimePresence,
  AnimePresenceChild,
} from '@shakibdshy/react-animejs';
import type { AnimeLayoutRef } from '@shakibdshy/react-animejs';
import { PreviewCard } from './shared';
import { cn } from './utils';
import type { PreviewProps } from './types';
import { ACCORDION_ITEMS } from './accordion-data';

interface AccordionItemProps {
  title: string;
  body: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem = memo(function AccordionItem({
  title,
  body,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  const layoutRef = useRef<AnimeLayoutRef>(null);

  const handleToggle = () => {
    const layout = layoutRef.current;
    if (!layout) {
      onToggle();
      return;
    }

    layout.update(
      () => {
        flushSync(() => onToggle());
      },
      { duration: 320, ease: 'outExpo' }
    );
  };

  return (
    <div className="rounded-lg border border-landing-border bg-landing-surface/40 overflow-hidden">
      <button
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
      >
        <span className="text-sm text-landing-fg">{title}</span>
        <span
          className={cn(
            'landing-font-mono text-xs text-landing-muted transition-transform duration-300',
            isOpen && 'rotate-180 text-landing-accent'
          )}
        >
          ▼
        </span>
      </button>
      <AnimeLayout
        ref={layoutRef}
        mode="manual"
        duration={500}
        ease="outExpo"
        enterFrom={{ opacity: 0 }}
        leaveTo={{ opacity: 0 }}
        className="overflow-hidden"
      >
        {isOpen && (
          <AnimeLayoutItem key="panel" layoutId="panel">
            <p className="px-3.5 pb-3 text-xs text-landing-muted leading-relaxed">{body}</p>
          </AnimeLayoutItem>
        )}
      </AnimeLayout>
    </div>
  );
});

export const AccordionPreview = memo(function AccordionPreview(_props: PreviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <PreviewCard title="Accordion" description="Click a header to toggle">
      <div className="w-full max-w-80 flex flex-col gap-2">
        {ACCORDION_ITEMS.map((item, index) => (
          <AccordionItem
            key={item.title}
            title={item.title}
            body={item.body}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </PreviewCard>
  );
});

const AccordionPresenceItem = memo(function AccordionPresenceItem({
  title,
  body,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="rounded-lg border border-landing-border bg-landing-surface/40 overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
      >
        <span className="text-sm text-landing-fg">{title}</span>
        <span
          className={cn(
            'landing-font-mono text-xs text-landing-muted transition-transform duration-300',
            isOpen && 'rotate-180 text-landing-accent'
          )}
        >
          ▼
        </span>
      </button>
      <AnimePresence mode="sync" initial={false}>
        {isOpen && (
          <AnimePresenceChild
            key="panel"
            enter={{ height: [0, 'auto'], opacity: [0, 1] }}
            exit={{ height: ['auto', 0], opacity: [1, 0] }}
            duration={320}
            ease="outExpo"
          >
            <div className="overflow-hidden">
              <p className="px-3.5 pb-3 text-xs text-landing-muted leading-relaxed">{body}</p>
            </div>
          </AnimePresenceChild>
        )}
      </AnimePresence>
    </div>
  );
});

export const AccordionPresencePreview = memo(function AccordionPresencePreview(
  _props: PreviewProps
) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <PreviewCard title="Accordion (Presence)" description="Click a header to toggle">
      <div className="w-full max-w-80 flex flex-col gap-2">
        {ACCORDION_ITEMS.map((item, index) => (
          <AccordionPresenceItem
            key={item.title}
            title={item.title}
            body={item.body}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </PreviewCard>
  );
});
