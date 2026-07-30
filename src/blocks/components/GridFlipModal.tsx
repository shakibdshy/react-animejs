/**
 * GridFlipModal — a faithful port of the GSAP Flip grid-to-modal demo to React.
 *
 * KEY PATTERN (Declarative React FLIP):
 * - Uses <AnimeLayout> around the grid and modal.
 * - Uses React state `activeIdx` to determine if a tile is expanded in the modal.
 * - The placeholder is rendered in the grid as a dashed box when a tile is active.
 * - On click, we wrap state changes in `layout.update()` with React `flushSync`
 *   to update the state synchronously.
 * - AnimeLayout automatically calculates the position difference between the grid
 *   and the modal using the shared `layoutId` on <AnimeLayoutItem> and animates it.
 * - Styling is 100% Tailwind CSS, eliminating internal CSS styles.
 */
import { memo, useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AnimeLayout, AnimeLayoutItem } from '@shakibdshy/react-animejs';
import type { AnimeLayoutRef } from '@shakibdshy/react-animejs';
import { cn } from '@/lib/utils';

/** Six portrait sources (stable seeds so each tile is a distinct image). */
const img = (seed: string, w = 600, h = 750) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const TILES = [
  { src: img('flip-grid-14'), label: 'Item A', duration: 700 },
  { src: img('flip-grid-1'), label: 'Item B', duration: 700 },
  { src: img('flip-grid-12'), label: 'Item C', duration: 700 },
  { src: img('flip-grid-2'), label: 'Item D', duration: 700 },
  { src: img('flip-grid-4'), label: 'Item E', duration: 700 },
  { src: img('flip-grid-8'), label: 'Item F', duration: 700 },
];

export const GridFlipModal = memo(function GridFlipModal({
  className = '',
}: {
  className?: string;
}) {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const toggleTile = useCallback((idx: number | null) => {
    const layout = layoutRef.current;
    if (!layout) return;

    layout.update(
      () => {
        // flushSync forces React to commit DOM updates synchronously so
        // the AnimeLayout wrapper can measure the new position and size.
        flushSync(() => {
          setActiveIdx(idx);
        });
      },
      {
        duration: idx !== null ? TILES[idx].duration : 700,
        ease: 'inOutQuad',
      }
    );
  }, []);

  return (
    <div
      className={cn(
        'py-10 relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-landing-bg text-landing-fg',
        className
      )}
    >
      <AnimeLayout
        ref={layoutRef}
        as="div"
        duration={700}
        ease="inOutQuad"
        className="relative w-full"
      >
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-10 max-w-5xl mx-auto">
          {TILES.map((tile, i) => {
            const isExpanded = activeIdx === i;
            return (
              <div
                key={i}
                className={cn(
                  'border-2 border-dashed border-landing-border/45 rounded-2xl flex items-center justify-center aspect-4/3 sm:aspect-square',
                  !isExpanded && 'relative'
                )}
              >
                {/* 
                  The tile is always rendered and never unmounted.
                  - If expanded: it transitions to absolute centering relative to the wrapper.
                  - If normal: it sits inside the dashed box.
                */}
                <AnimeLayoutItem
                  layoutId={`tile-${i}`}
                  as="button"
                  className={
                    isExpanded
                      ? 'absolute inset-0 m-auto h-[85%] w-auto aspect-4/5 rounded-2xl overflow-hidden border border-white/15 shadow-2xl cursor-pointer focus:outline-none z-50 transition-none'
                      : 'w-full h-full rounded-xl overflow-hidden cursor-pointer bg-landing-surface border border-landing-border shadow-md focus:outline-none transition-none'
                  }
                  onClick={() => toggleTile(isExpanded ? null : i)}
                >
                  <img
                    src={tile.src}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover transition-none"
                  />
                  <span
                    className={`landing-font-mono absolute uppercase text-white/90 drop-shadow transition-all duration-300 ${
                      isExpanded
                        ? 'bottom-6 left-6 text-xs tracking-[0.2em]'
                        : 'bottom-3 left-3 text-[9px] tracking-[0.2em]'
                    }`}
                  >
                    {tile.label}
                  </span>
                </AnimeLayoutItem>
              </div>
            );
          })}
        </div>

        {/* Modal Backdrop Overlay */}
        <div
          className={`absolute inset-0 z-45 transition-all duration-300 ${
            activeIdx !== null
              ? 'opacity-100 pointer-events-auto backdrop-blur-sm bg-black/65'
              : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => toggleTile(null)}
        />
      </AnimeLayout>
    </div>
  );
});

export default GridFlipModal;
