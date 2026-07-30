import { memo, useState } from 'react';
import { AnimePresence, AnimePresenceChild } from '@shakibdshy/react-animejs';
import { PreviewCard } from './shared';
import type { PreviewProps } from './types';

type TooltipVariantName = 'fade' | 'slide' | 'bounce';

const TooltipVariant = memo(function TooltipVariant({
  label,
  variant,
}: {
  label: string;
  variant: TooltipVariantName;
}) {
  const [open, setOpen] = useState(false);

  const enterExit = {
    fade: {
      enter: { opacity: [0, 1] },
      exit: { opacity: [1, 0] },
    },
    slide: {
      enter: { opacity: [0, 1], translateX: [-16, 0] },
      exit: { opacity: [1, 0], translateX: [0, -16] },
    },
    bounce: {
      enter: { opacity: [0, 1], scale: [0.6, 1], translateY: [10, 0] },
      exit: { opacity: [1, 0], scale: [1, 0.6], translateY: [0, 10] },
    },
  }[variant];

  const durations: Record<TooltipVariantName, number> = {
    fade: 400,
    slide: 450,
    bounce: 600,
  };
  const eases: Record<TooltipVariantName, string> = {
    fade: 'outExpo',
    slide: 'outQuart',
    bounce: 'outBack',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="landing-font-mono text-[10px] tracking-widest uppercase text-landing-muted/60">
        {variant}
      </span>
      <div
        className="relative pt-6"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <AnimePresence mode="sync" initial={false}>
          {open && (
            <AnimePresenceChild
              key="tip"
              enter={enterExit.enter}
              exit={enterExit.exit}
              duration={durations[variant]}
              ease={eases[variant]}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 landing-font-mono text-[10px] text-landing-bg bg-landing-accent px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap pointer-events-none">
                {label}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-landing-accent rotate-45" />
              </div>
            </AnimePresenceChild>
          )}
        </AnimePresence>
        <button
          onClick={() => setOpen((current) => !current)}
          className="px-3 py-1.5 rounded-lg border border-landing-border bg-landing-surface text-xs text-landing-fg hover:border-landing-accent/40 transition-colors"
        >
          Hover me
        </button>
      </div>
    </div>
  );
});

export const TooltipPreview = memo(function TooltipPreview(_props: PreviewProps) {
  return (
    <PreviewCard title="Tooltip" description="Hover any target to reveal">
      <div className="flex items-start justify-center gap-8 w-full">
        <TooltipVariant label="Simple fade" variant="fade" />
        <TooltipVariant label="Slides from left" variant="slide" />
        <TooltipVariant label="Bounces in" variant="bounce" />
      </div>
    </PreviewCard>
  );
});
