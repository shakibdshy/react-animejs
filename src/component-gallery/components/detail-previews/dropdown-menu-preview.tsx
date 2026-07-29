import { memo, useEffect, useRef, useState } from 'react';
import { Anime, AnimePresence, AnimePresenceChild } from '@/lib/react-animejs';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';

const MENU_ITEMS = ['Profile', 'Settings', 'Theme', 'Sign out'];

export const DropdownMenuPreview = memo(function DropdownMenuPreview(_props: PreviewProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const toggleOpen = () => setOpen((current) => !current);

  return (
    <PreviewCard
      title="Dropdown Menu"
      description="Click the trigger"
      overflow="visible"
      controls={
        <div onPointerDown={(event) => event.stopPropagation()}>
          <DemoButton onClick={toggleOpen} variant="accent" small>
            {open ? 'Close' : 'Open'}
          </DemoButton>
        </div>
      }
    >
      <div ref={containerRef} className="flex items-center justify-center py-6">
        <div className="relative inline-flex">
          <button
            onClick={toggleOpen}
            className="px-4 py-2 rounded-lg border border-landing-border bg-landing-surface text-sm text-landing-fg hover:border-landing-accent/40 transition-colors flex items-center gap-2"
          >
            Menu
            <span className="text-landing-muted text-xs">{open ? '▲' : '▼'}</span>
          </button>
          <AnimePresence mode="sync">
            {open && (
              <AnimePresenceChild
                key="dropdown"
                enter={{ opacity: [0, 1], scale: [0.95, 1] }}
                exit={{ opacity: [1, 0], scale: [1, 0.95] }}
                duration={200}
                ease="outExpo"
              >
                <div className="absolute top-full left-0 mt-1 w-40 rounded-lg border border-landing-border bg-landing-surface shadow-xl overflow-hidden z-20">
                  {MENU_ITEMS.map((item, index) => (
                    <Anime
                      key={item}
                      opacity={[0, 1]}
                      translateY={[-6, 0]}
                      delay={index * 40}
                      duration={200}
                      ease="outQuad"
                      autoplay
                    >
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-landing-fg hover:bg-landing-accent/10 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item}
                      </button>
                    </Anime>
                  ))}
                </div>
              </AnimePresenceChild>
            )}
          </AnimePresence>
        </div>
      </div>
    </PreviewCard>
  );
});
