import { memo, useCallback, useState, useRef, useEffect } from 'react';
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from '@/lib/react-animejs/components/AnimeLayout';
import { DemoButton, PreviewCard } from './shared';
import type { PreviewProps } from './types';
import { flushSync } from 'react-dom';

export const LayoutPreview = memo(function LayoutPreview(_props: PreviewProps) {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [grid, setGrid] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  // Cycle to next grid configuration
  const nextGrid = useCallback(() => {
    layoutRef.current?.update(() => {
      flushSync(() => {
        setGrid((prev) => (prev % 4) + 1);
      });
    });
  }, []);

  // Auto-playing sequence loop matching the official AnimeJS documentation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      nextGrid();
    }, 2200);
    return () => clearInterval(interval);
  }, [isPlaying, nextGrid]);

  return (
    <PreviewCard
      title="Bento Grid"
      description="Adaptive Bento layout transitions"
      controls={
        <div className="flex gap-2">
          <DemoButton onClick={() => setIsPlaying((p) => !p)} small>
            {isPlaying ? 'Pause' : 'Auto Play'}
          </DemoButton>
          <DemoButton onClick={nextGrid} variant="accent" small>
            Next State
          </DemoButton>
        </div>
      }
    >
      <div id="layout-preview-root" className="w-48">
        <AnimeLayout
          ref={layoutRef}
          duration={600}
          ease="outExpo"
          className="grid-layout gap-2 w-full"
          wrapperProps={{ 'data-grid': grid } as any}
        >
          {['A', 'B', 'C', 'D'].map((char) => (
            <AnimeLayoutItem
              key={char}
              layoutId={`preview-bento-${char}`}
              className="item rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors"
              style={{
                backgroundColor: `var(--color-landing-card, rgba(255,255,255,0.08))`,
                color: `var(--color-landing-text, #e2e0d9)`,
                border: `1px solid var(--color-landing-border, rgba(255,255,255,0.05))`,
              }}
            >
              Item {char}
            </AnimeLayoutItem>
          ))}
        </AnimeLayout>

        <style>{`
          #layout-preview-root .grid-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 40px 40px 40px;
          }

          #layout-preview-root .item {
            height: 100%;
            width: 100%;
            min-height: 40px;
          }

          /* grid-1 */
          #layout-preview-root [data-grid="1"] .item:nth-child(1) { grid-column: 1; grid-row: 1 / 3; }
          #layout-preview-root [data-grid="1"] .item:nth-child(2) { grid-column: 2; grid-row: 1; }
          #layout-preview-root [data-grid="1"] .item:nth-child(3) { grid-column: 1; grid-row: 3; }
          #layout-preview-root [data-grid="1"] .item:nth-child(4) { grid-column: 2; grid-row: 2 / 4; }

          /* grid-2 */
          #layout-preview-root [data-grid="2"] { grid-template-columns: repeat(3, 1fr); grid-template-rows: 40px 40px; }
          #layout-preview-root [data-grid="2"] .item:nth-child(1),
          #layout-preview-root [data-grid="2"] .item:nth-child(4) { grid-row: 1 / 3; }

          /* grid-3 */
          #layout-preview-root [data-grid="3"] .item:nth-child(4) { grid-column: 1; grid-row: 1; }
          #layout-preview-root [data-grid="3"] .item:nth-child(3) { grid-column: 2; grid-row: 1 / 3; }
          #layout-preview-root [data-grid="3"] .item:nth-child(2) { grid-column: 1; grid-row: 2 / 4; }
          #layout-preview-root [data-grid="3"] .item:nth-child(1) { grid-column: 2; grid-row: 3; }

          /* grid-4 */
          #layout-preview-root [data-grid="4"] { grid-template-columns: repeat(3, 1fr); grid-template-rows: 40px 40px; }
          #layout-preview-root [data-grid="4"] .item:nth-child(1) { grid-column: 1; grid-row: 1; }
          #layout-preview-root [data-grid="4"] .item:nth-child(2) { grid-column: 1; grid-row: 2; }
          #layout-preview-root [data-grid="4"] .item:nth-child(3),
          #layout-preview-root [data-grid="4"] .item:nth-child(4) { grid-row: 1 / 3; }
        `}</style>
      </div>
    </PreviewCard>
  );
});
