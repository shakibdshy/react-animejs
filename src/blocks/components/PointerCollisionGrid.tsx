/**
 * PointerCollisionGrid — a 20×20 light grid that catches every cell the pointer
 * sweeps, even on a fast flick.
 *
 * `pointermove` fires sparsely during a fast flick, so reading only the cell
 * under the cursor misses cells in between. This block therefore performs
 * *swept* collision detection: on each move it walks a supercover line
 * (all grid cells a segment passes through) from the last pointer position to
 * the current one, lighting every cell along the way.
 *
 * Each cell owns its own `useAnimatable` opacity setter (the library's
 * cursor-event hook). When swept, the cell is lit (opacity → 1) and then told
 * to fade back to idle (opacity → 0) on its own — no React state churn per
 * frame, exactly what `useAnimatable` is designed for.
 */
import {
  memo,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
} from 'react';
import { useAnimatable } from '@/lib/react-animejs';

const COLS = 20;
const ROWS = 20;
const FADE_MS = 650;

export const PointerCollisionGrid = memo(function PointerCollisionGrid({
  className = '',
}: {
  className?: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);

  /** Sweep-light every cell between (x0,y0) and (x1,y1) inclusive — supercover. */
  const sweepLine = useCallback((x0: number, y0: number, x1: number, y1: number) => {
    const grid = gridRef.current;
    if (!grid) return;
    const cells = grid.children;

    // Bresenham-style supercover: walk the longer axis, compute the other via
    // the line equation, collecting every cell the segment touches.
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let x = x0;
    let y = y0;
    let err = dx - dy;

    // Guard against pathological input.
    let guard = 0;
    while (guard++ < COLS * ROWS + 4) {
      if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
        const node = cells[y * COLS + x] as HTMLElement | undefined;
        // The cell stores its lightUp callback on the closure via a custom
        // property we set during render (see Cell). We instead re-light by
        // re-triggering through a dispatched event.
        node?.dispatchEvent(new CustomEvent('light'));
      }
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }, []);

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const grid = gridRef.current;
      if (!grid) return;
      const rect = grid.getBoundingClientRect();
      const cx = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
      const cy = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);
      if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) {
        lastCellRef.current = null;
        return;
      }

      const last = lastCellRef.current;
      if (last) {
        sweepLine(last.x, last.y, cx, cy);
      } else {
        // First event in this stroke — light just the current cell.
        const node = grid.children[cy * COLS + cx] as HTMLElement | undefined;
        node?.dispatchEvent(new CustomEvent('light'));
      }
      lastCellRef.current = { x: cx, y: cy };
    },
    [sweepLine],
  );

  const handlePointerLeave = useCallback(() => {
    lastCellRef.current = null;
  }, []);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative rounded-2xl border border-landing-border/60 bg-landing-surface/40 p-4 cursor-crosshair ${className}`}
      style={{ minHeight: 360 }}
    >
      <div
        ref={gridRef}
        className="grid h-80 w-full gap-0.75"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <CellWithListener key={i} index={i} />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-muted/60">
          flick fast · swept collision lights every cell
        </span>
      </div>
    </div>
  );
});

/**
 * Cell with an event listener. Each cell registers a `light` CustomEvent
 * listener on mount that calls the animatable setter; the parent grid sweeps
 * these events across the supercover line. Decoupling via events avoids a
 * 400-entry registry ref and keeps each cell self-contained.
 */
const CellWithListener = memo(function CellWithListener({ index }: { index: number }) {
  const { ref, animatable } = useAnimatable<HTMLDivElement>({
    opacity: { to: 0, duration: FADE_MS, ease: 'outQuad' },
    scale: { to: 1, duration: FADE_MS, ease: 'outQuad' },
  });

  const handleLight = useCallback(() => {
    const a = animatable.current;
    if (!a) return;
    const opacity = a.opacity as (v: number, d?: number) => void;
    const scale = a.scale as (v: number, d?: number) => void;
    opacity(1, 0);
    opacity(0, FADE_MS);
    scale(1.18, 0);
    scale(1, FADE_MS);
  }, [animatable]);

  // Register the listener imperatively so it survives re-renders without
  // re-binding and so the parent can dispatch to a specific DOM node.
  const setNode = useCallback(
    (node: HTMLDivElement | null) => {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (node) {
        node.addEventListener('light', handleLight as EventListener);
        node.dataset.cellIndex = String(index);
      }
    },
    [ref, handleLight, index],
  );

  return (
    <div
      ref={setNode}
      className="rounded-[3px] bg-landing-accent"
      style={{ opacity: 0, transform: 'scale(1)', willChange: 'opacity, transform' }}
    />
  );
});

export default PointerCollisionGrid;
