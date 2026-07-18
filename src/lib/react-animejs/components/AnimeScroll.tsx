import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import type { ForwardedRef, ReactElement, ReactNode, RefAttributes, RefObject } from 'react';
import { useAnimeOnScroll } from '../hooks/use-anime-onscroll';
import { shallowEqual } from '../core';
import type {
  ScrollObserver,
  ScrollObserverState,
  UseAnimeOnScrollControls,
  UseAnimeOnScrollOptions,
} from '../types';

/** The observer state and refs available to an AnimeScroll render prop. */
export interface AnimeScrollRef<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
> {
  ref: RefObject<T | null>;
  targetRef: RefObject<T | null>;
  containerRef: RefObject<C | null>;
  controls: UseAnimeOnScrollControls;
  state: ScrollObserverState;
  observer: ScrollObserver | null;
  isReady: boolean;
  isInView: boolean;
  progress: number;
  scroll: number;
  velocity: number;
  backward: boolean;
  getObserver: () => ScrollObserver | null;
}

export interface AnimeScrollProps<
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
> extends UseAnimeOnScrollOptions {
  /** Static children or a render prop that receives the scroll observer API. */
  children?: ReactNode | ((api: AnimeScrollRef<T, C>) => ReactNode);
  /** Called once when the scroll observer becomes ready. */
  onReady?: (api: AnimeScrollRef<T, C>) => void;
  /** Called whenever the observer state meaningfully changes. */
  onStateChange?: (state: ScrollObserverState) => void;
  /** Called once per enabled observer instance with its controls. */
  onControlsReady?: (controls: UseAnimeOnScrollControls) => void;
}

/**
 * Declarative access to Anime.js scroll observation.
 *
 * AnimeScroll owns observer lifecycle and exposes the same refs, state, and
 * controls as useAnimeOnScroll without adding a wrapper element. Use the
 * render-prop form when the target needs the returned ref:
 *
 * ```tsx
 * <AnimeScroll enter="bottom top" leave="top bottom">
 *   {({ ref, progress }) => <div ref={ref}>{progress}</div>}
 * </AnimeScroll>
 * ```
 */
function AnimeScrollImpl<T extends HTMLElement, C extends HTMLElement>(
  { children, onReady, onStateChange, onControlsReady, ...scrollOptions }: AnimeScrollProps<T, C>,
  forwardedRef: ForwardedRef<AnimeScrollRef<T, C>>
) {
  const {
    ref: targetRef,
    targetRef: returnedTargetRef,
    containerRef,
    controls,
    state,
    observer,
    isReady,
    isInView,
    progress,
    scroll,
    velocity,
    backward,
  } = useAnimeOnScroll<T, C>(scrollOptions);

  const readyNotifiedRef = useRef(false);
  const controlsNotifiedRef = useRef(false);

  const refValue = useMemo<AnimeScrollRef<T, C>>(
    () => ({
      ref: targetRef,
      targetRef: returnedTargetRef,
      containerRef,
      controls,
      state,
      observer,
      isReady,
      isInView,
      progress,
      scroll,
      velocity,
      backward,
      getObserver: () => observer,
    }),
    [
      targetRef,
      returnedTargetRef,
      containerRef,
      controls,
      state,
      observer,
      isReady,
      isInView,
      progress,
      scroll,
      velocity,
      backward,
    ]
  );

  useImperativeHandle(forwardedRef, () => refValue, [refValue]);

  useEffect(() => {
    if (scrollOptions.enabled === false || !onControlsReady || controlsNotifiedRef.current) {
      return;
    }

    onControlsReady(controls);
    controlsNotifiedRef.current = true;
  }, [controls, onControlsReady, scrollOptions.enabled]);

  useEffect(() => {
    if (scrollOptions.enabled === false || !isReady || !onReady || readyNotifiedRef.current) {
      return;
    }

    onReady(refValue);
    readyNotifiedRef.current = true;
  }, [isReady, onReady, refValue, scrollOptions.enabled]);

  useEffect(() => {
    if (scrollOptions.enabled === false) {
      readyNotifiedRef.current = false;
      controlsNotifiedRef.current = false;
    }
  }, [scrollOptions.enabled]);

  const lastNotifiedStateRef = useRef<ScrollObserverState>(state);
  useEffect(() => {
    if (!onStateChange || shallowEqual(lastNotifiedStateRef.current, state)) return;
    lastNotifiedStateRef.current = state;
    onStateChange(state);
  }, [onStateChange, state]);

  if (typeof children === 'function') {
    return <>{children(refValue)}</>;
  }

  return <>{children ?? null}</>;
}

export const AnimeScroll = forwardRef(AnimeScrollImpl) as <
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
>(
  props: AnimeScrollProps<T, C> & RefAttributes<AnimeScrollRef<T, C>>
) => ReactElement | null;

export default AnimeScroll;
