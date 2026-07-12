/**
 * AnimeAdapter - declarative adapter registration component
 *
 * Wraps `useAnimeAdapter` for consumers who prefer JSX over hooks. Renders no
 * DOM node (just children), like `<AnimeTimeline>`. Use it to make non-DOM
 * objects (Three.js, PixiJS, Canvas, custom instances) animatable via
 * `useAnime` / `<Anime>`.
 *
 * @example
 * ```tsx
 * <AnimeAdapter
 *   id="pixi"
 *   detect={(t) => t?.isPixiDisplayObject}
 *   targets={[{
 *     detect: (t) => t.isSprite,
 *     properties: {
 *       x: { get: (t) => t.x, set: (t, v) => { t.x = v; } },
 *       y: { get: (t) => t.y, set: (t, v) => { t.y = v; } },
 *     },
 *   }]}
 * >
 *   <PixiStage />
 * </AnimeAdapter>
 * ```
 *
 * @see https://animejs.com/documentation/adapters/
 */

import { type ReactNode, useEffect } from 'react';
import { useAnimeAdapter } from '../hooks/use-anime-adapter';
import type { AnimeAdapterInstance } from '../types/adapter';

export interface AnimeAdapterProps {
  /** Stable unique id for this adapter (dedupes across mounts). */
  id: string;
  /** Optional adapter-level gate; early-reject unrelated targets. */
  detect?: (target: any) => boolean;
  /** Target-adapter groups, each claiming a target type + properties. */
  targets?: ReactAdapterTargetSpec[];
  /** Children to render (no DOM wrapper is added). */
  children?: ReactNode;
  /** Called once when the adapter is registered. */
  onReady?: (adapter: AnimeAdapterInstance) => void;
}

/** Local subset of AnimeAdapterTarget to avoid importing internal types. */
interface ReactAdapterTargetSpec {
  detect: (target: any) => boolean;
  properties: Record<
    string,
    {
      get: (target: any) => any;
      set: (target: any, value: number, tween: any) => void;
      gate?: (target: any) => boolean;
    }
  >;
}

export function AnimeAdapter({
  id,
  detect,
  targets,
  children,
  onReady,
}: AnimeAdapterProps) {
  const { adapter, isReady } = useAnimeAdapter({ id, detect, targets });

  // Fire onReady exactly once when the adapter registers
  useEffect(() => {
    if (isReady && adapter && onReady) {
      onReady(adapter);
    }
  }, [isReady, adapter, onReady]);

  return <>{children}</>;
}

export default AnimeAdapter;
