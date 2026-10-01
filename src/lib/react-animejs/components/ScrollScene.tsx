import type { ReactElement, ReactNode } from 'react';
import { useAnimeOnScroll } from '../hooks/use-anime-onscroll';
import type {
  UseAnimeOnScrollOptions,
  UseAnimeOnScrollReturn,
} from '../types';

/**
 * The API handed to a ScrollScene render prop: attach the refs to your
 * container and track, read coarse state for UI, and do per-frame work
 * (transform writes, canvas draws, chrome) in `onFrame` — never the reverse.
 */
export type ScrollSceneRef<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
> = UseAnimeOnScrollReturn<T, C>;

export interface ScrollSceneProps<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
> extends UseAnimeOnScrollOptions {
  /** Static children, or a render prop receiving the scene API. */
  children?: ReactNode | ((api: ScrollSceneRef<T, C>) => ReactNode);
}

/**
 * Declarative container-scoped scroll scene — the simple face of the scroll
 * hook. Owns the observer lifecycle (creation, engine wake, cleanup) and
 * routes high-frequency progress through `onFrame` with zero React
 * re-renders, while reactive `state` only advances on meaningful transitions.
 *
 * ```tsx
 * <ScrollScene enter="top top" leave="bottom bottom" scrub={0.25} onFrame={applyFrame}>
 *   {({ targetRef, containerRef }) => (
 *     <div ref={containerRef} style={{ height: '400vh', overflowY: 'auto' }}>
 *       <div ref={targetRef} style={{ position: 'sticky', top: 0 }}>…cards…</div>
 *     </div>
 *   )}
 * </ScrollScene>
 * ```
 */
function ScrollSceneImpl<T extends HTMLElement, C extends HTMLElement>({
  children,
  ...options
}: ScrollSceneProps<T, C>) {
  const api = useAnimeOnScroll<T, C>(options);
  return <>{typeof children === 'function' ? children(api) : children}</>;
}

export const ScrollScene = ScrollSceneImpl as <
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
>(
  props: ScrollSceneProps<T, C>
) => ReactElement | null;

export default ScrollScene;
