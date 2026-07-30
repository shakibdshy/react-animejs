import { useCallback, useRef, useState } from 'react';
import {
  AnimeLayout,
  AnimeLayoutItem,
  type AnimeLayoutRef,
} from '@shakibdshy/react-animejs';

export interface AnimatedReorderListProps<T> {
  /** Items to render */
  items: T[];
  /** Unique key extractor */
  getKey: (item: T) => string;
  /** Render function for each item */
  children: (item: T, index: number) => React.ReactNode;
  /** Animation duration in ms */
  duration?: number;
  /** Easing function */
  ease?: string;
  /** Layout direction */
  direction?: 'vertical' | 'horizontal';
  /** Gap between items in px */
  gap?: number;
  /** Custom className */
  className?: string;
}

export function AnimatedReorderList<T>({
  items,
  getKey,
  children,
  duration = 500,
  ease = 'outExpo',
  direction = 'vertical',
  gap = 8,
  className = '',
}: AnimatedReorderListProps<T>) {
  const layoutRef = useRef<AnimeLayoutRef>(null);

  return (
    <AnimeLayout
      ref={layoutRef}
      mode="auto"
      duration={duration}
      ease={ease}
      enterFrom={{ opacity: 0, transform: 'scale(0.9)' }}
      leaveTo={{ opacity: 0, transform: 'scale(0.9)' }}
      className={`flex ${direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'} ${className}`}
      style={{ gap }}
    >
      {items.map((item, index) => (
        <AnimeLayoutItem key={getKey(item)} layoutId={getKey(item)} className="w-full">
          {children(item, index)}
        </AnimeLayoutItem>
      ))}
    </AnimeLayout>
  );
}

// =============================================================================
// Preset list with built-in move controls — ready for demos
// =============================================================================

export interface ReorderListPresetProps {
  /** Initial items */
  items?: { id: string; label: string; color: string }[];
  /** Animation duration */
  duration?: number;
  /** Show move buttons */
  showControls?: boolean;
  /** Custom className */
  className?: string;
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
}

function shuffleArray<T>(arr: T[]): T[] {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const DEFAULT_ITEMS = [
  { id: 'a', label: 'Alpha', color: '#ffd11a' },
  { id: 'b', label: 'Beta', color: '#ff4d6a' },
  { id: 'c', label: 'Gamma', color: '#63b3ed' },
  { id: 'd', label: 'Delta', color: '#68d391' },
  { id: 'e', label: 'Epsilon', color: '#b794f4' },
];

export function ReorderListPreset({
  items: initialItems = DEFAULT_ITEMS,
  duration = 500,
  showControls = true,
  className = '',
}: ReorderListPresetProps) {
  const [items, setItems] = useState(initialItems);

  const move = useCallback((from: number, to: number) => {
    setItems((prev) => moveItem(prev, from, to));
  }, []);

  const shuffle = useCallback(() => {
    setItems((prev) => shuffleArray(prev));
  }, []);

  const reverse = useCallback(() => {
    setItems((prev) => [...prev].reverse());
  }, []);

  const reset = useCallback(() => {
    setItems(initialItems);
  }, [initialItems]);

  const layoutRef = useRef<AnimeLayoutRef>(null);

  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      {/* Action bar */}
      {showControls && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={shuffle}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-demo-accent text-demo-bg rounded-lg hover:bg-demo-accent/90 transition-colors"
          >
            Shuffle
          </button>
          <button
            onClick={reverse}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-demo-border text-demo-text rounded-lg hover:bg-demo-border-hover transition-colors"
          >
            Reverse
          </button>
          <button
            onClick={reset}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-demo-border text-demo-text-secondary rounded-lg hover:bg-demo-border-hover hover:text-demo-text transition-colors"
          >
            Reset
          </button>
        </div>
      )}

      {/* Animated list */}
      <AnimeLayout
        ref={layoutRef}
        mode="auto"
        duration={duration}
        ease="outExpo"
        enterFrom={{ opacity: 0, transform: 'scale(0.9)' }}
        leaveTo={{ opacity: 0, transform: 'scale(0.9)' }}
        className="flex flex-col"
        style={{ gap: 8 }}
      >
        {items.map((item, index) => (
          <AnimeLayoutItem key={item.id} layoutId={item.id}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-demo-border bg-demo-bg hover:border-white/10 transition-colors group">
              {/* Drag handle dots */}
              <div className="flex flex-col gap-0.5 cursor-grab active:cursor-grabbing">
                <svg width="12" height="12" viewBox="0 0 12 12" className="text-slate-600">
                  <circle cx="3" cy="3" r="1.5" fill="currentColor" />
                  <circle cx="9" cy="3" r="1.5" fill="currentColor" />
                  <circle cx="3" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                </svg>
              </div>

              {/* Color dot */}
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />

              {/* Label */}
              <span className="flex-1 text-sm font-bold text-demo-text">{item.label}</span>

              {/* Move buttons */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  className="w-6 h-6 flex items-center justify-center rounded bg-white/5 text-demo-text-muted hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </button>
                <button
                  onClick={() => move(index, index + 1)}
                  disabled={index === items.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded bg-white/5 text-demo-text-muted hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </AnimeLayoutItem>
        ))}
      </AnimeLayout>
    </div>
  );
}

export default AnimatedReorderList;
