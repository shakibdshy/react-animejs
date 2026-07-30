/**
 * AnimateCssGridFlip — a CSS Grid FLIP interaction built with AnimeLayout.
 *
 * The active product occupies the large three-by-three area. Selecting one of
 * the three cards in the bottom row swaps its grid area with the active card;
 * AnimeLayout measures the before/after positions and animates the real DOM
 * nodes between them.
 */
import { memo, useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AnimeLayout, AnimeLayoutItem } from '@shakibdshy/react-animejs';
import type { AnimeLayoutRef } from '@shakibdshy/react-animejs';

const GRID_AREAS = '"hero hero hero" "hero hero hero" "hero hero hero" "slot-a slot-b slot-c"';
const SMALL_SLOTS = ['slot-a', 'slot-b', 'slot-c'] as const;

const PRODUCTS = [
  {
    id: 'img-1',
    label: 'Signal / 01',
    title: 'Electric bloom',
    src: 'https://assets.codepen.io/16327/ui-flair-1.png',
    accent: '#9ee8ff',
  },
  {
    id: 'img-2',
    label: 'Signal / 02',
    title: 'Soft geometry',
    src: 'https://assets.codepen.io/16327/ui-flair-2.png',
    accent: '#ffc47d',
  },
  {
    id: 'img-3',
    label: 'Signal / 03',
    title: 'Night frequency',
    src: 'https://assets.codepen.io/16327/ui-flair-3.png',
    accent: '#ef9cff',
  },
  {
    id: 'img-4',
    label: 'Signal / 04',
    title: 'After image',
    src: 'https://assets.codepen.io/16327/ui-flair-4.png',
    accent: '#92efb6',
  },
] as const;

export interface AnimateCssGridFlipProps {
  className?: string;
}

export const AnimateCssGridFlip = memo(function AnimateCssGridFlip({
  className = '',
}: AnimateCssGridFlipProps) {
  const layoutRef = useRef<AnimeLayoutRef>(null);
  const busyRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectProduct = useCallback(
    (index: number) => {
      const layout = layoutRef.current;
      if (!layout || index === activeIndex || busyRef.current) return;

      busyRef.current = true;
      const timeline = layout.update(
        () => {
          // Commit the new CSS-grid area before AnimeLayout measures the second
          // layout, preserving a real FLIP first/last pair.
          flushSync(() => setActiveIndex(index));
        },
        {
          duration: 420,
          ease: 'inOutQuad',
          onComplete: () => {
            busyRef.current = false;
          },
        }
      );

      if (!timeline) busyRef.current = false;
    },
    [activeIndex]
  );

  const remaining = PRODUCTS.map((_, index) => index).filter((index) => index !== activeIndex);
  const activeProduct = PRODUCTS[activeIndex];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-landing-border/60 bg-[#0e100f] text-landing-fg ${className}`}
    >
      <AnimeLayout
        ref={layoutRef}
        as="div"
        mode="manual"
        duration={420}
        ease="inOutQuad"
        className="mx-auto w-full max-w-115 p-5 sm:p-8"
      >
        <div
          className="grid aspect-3/4 w-full gap-2"
          style={{
            gridTemplateAreas: GRID_AREAS,
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
          }}
        >
          {PRODUCTS.map((product, index) => {
            const smallIndex = remaining.indexOf(index);
            const gridArea = index === activeIndex ? 'hero' : SMALL_SLOTS[smallIndex];
            const isActive = index === activeIndex;

            return (
              <AnimeLayoutItem
                key={product.id}
                layoutId={product.id}
                as="button"
                aria-label={isActive ? `${product.title}, active product` : `Show ${product.title}`}
                onClick={() => selectProduct(index)}
                className={`group relative min-h-0 overflow-hidden border border-dashed border-white/35 bg-[#0e100f] text-left outline-none transition-[border-color,background-color] duration-200 focus-visible:border-white focus-visible:ring-2 focus-visible:ring-white/40 ${
                  isActive
                    ? 'cursor-default'
                    : 'cursor-pointer hover:border-white/80 hover:bg-white/3'
                }`}
                style={{
                  gridArea,
                  backgroundImage: `url(${product.src})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  // Leave a clear breathing band around the compact tile
                  // labels so the artwork cannot collide with the metadata.
                  backgroundSize: isActive ? '70%' : '56%',
                  willChange: 'transform',
                }}
              >
                <span
                  className={`absolute left-2.5 top-2.5 z-10 rounded-sm bg-[#0e100f]/80 px-1.5 py-1 landing-font-mono uppercase tracking-[0.2em] text-white/80 backdrop-blur-[2px] ${
                    isActive ? 'text-[10px]' : 'text-[8px] text-white/55'
                  }`}
                  style={{ color: isActive ? product.accent : undefined }}
                >
                  {product.label}
                </span>
                {!isActive && (
                  <span className="absolute bottom-3 left-3 landing-font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    make active
                  </span>
                )}
              </AnimeLayoutItem>
            );
          })}
        </div>
      </AnimeLayout>

      <div className="flex items-center justify-between border-t border-white/10 bg-white/2.5 px-5 py-3 sm:px-8">
        <span className="landing-font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">
          click a bottom tile · positions interpolate
        </span>
        <span
          className="landing-font-mono text-[9px] uppercase tracking-[0.2em]"
          style={{ color: activeProduct.accent }}
        >
          {String(activeIndex + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
});

export default AnimateCssGridFlip;
