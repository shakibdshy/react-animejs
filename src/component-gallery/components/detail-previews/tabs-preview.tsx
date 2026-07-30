import { memo, useLayoutEffect, useRef, useState } from 'react';
import { Anime, AnimePresence, AnimePresenceChild } from '@shakibdshy/react-animejs';
import { PreviewCard } from './shared';
import { cn } from './utils';
import type { PreviewProps } from './types';

const TABS = [
  {
    label: 'Overview',
    body: 'A hooks-first React wrapper for anime.js v4. Declarative components where they help.',
  },
  {
    label: 'Install',
    body: 'pnpm add @shakibdshy/react-animejs animejs — then import from @shakibdshy/react-animejs. React 19+ and anime.js v4.',
  },
  {
    label: 'Learn',
    body: 'Start with useAnime for tweens, useAnimeTimeline for sequences, AnimePresence for exits.',
  },
] as const;

export const TabsPreview = memo(function TabsPreview(_props: PreviewProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Active tab's measured offset + width, so the indicator hugs each label
  // exactly instead of using a fixed-width box that drifts off the text.
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current[active];
    if (el) {
      setIndicator({ x: el.offsetLeft, w: el.offsetWidth });
    }
  }, [active]);

  return (
    <PreviewCard title="Tabs" description="Click a tab to switch">
      <div className="w-full max-w-80">
        <div className="relative flex gap-6 border-b border-landing-border">
          {TABS.map((tab, index) => (
            <button
              key={tab.label}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => setActive(index)}
              className={cn(
                'px-2 py-2 text-sm transition-colors text-center',
                active === index
                  ? 'text-landing-accent'
                  : 'text-landing-muted hover:text-landing-fg'
              )}
            >
              {tab.label}
            </button>
          ))}
          <Anime
            translateX={indicator.x}
            width={indicator.w}
            duration={300}
            ease="outExpo"
            autoplay
            deps={[indicator.x, indicator.w]}
          >
            <div className="absolute -bottom-px left-0 h-0.5 bg-landing-accent rounded-full" />
          </Anime>
        </div>
        <div className="relative min-h-20 mt-3">
          <AnimePresence mode="wait" initial={false}>
            <AnimePresenceChild
              key={TABS[active].label}
              enter={{ opacity: [0, 1], translateY: [6, 0] }}
              exit={{ opacity: [1, 0], translateY: [0, -6] }}
              duration={220}
              ease="outQuad"
            >
              <p className="text-xs text-landing-muted leading-relaxed">{TABS[active].body}</p>
            </AnimePresenceChild>
          </AnimePresence>
        </div>
      </div>
    </PreviewCard>
  );
});
