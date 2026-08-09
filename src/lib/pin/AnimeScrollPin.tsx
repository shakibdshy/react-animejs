/**
 * <AnimeScrollPin> - declarative wrapper around `useAnimeOnScrollPin`.
 *
 * Local superset of the published `<AnimeScroll>` with `pin` / `pinSpacing` /
 * `onPin` / `onUnpin`. Phase 1 lives here because demo-docs consumes the
 * published package; phase 2 folds these props into the real `<AnimeScroll>`
 * in `react-animejs-package` and deletes this file.
 *
 * Mirrors the published component's shape: forwardRef, render-prop and static
 * children, `onReady` / `onStateChange` / `onControlsReady` lifecycle hooks.
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ForwardedRef,
  type ReactElement,
  type RefAttributes,
} from 'react';
import { useAnimeOnScrollPin } from './use-anime-onscroll-pin';
import type {
  AnimeScrollPinProps,
  AnimeScrollPinRef,
  PinState,
} from './types';

function shallowEqualPinState(a: PinState, b: PinState): boolean {
  return (
    a.id === b.id &&
    a.progress === b.progress &&
    a.scroll === b.scroll &&
    a.velocity === b.velocity &&
    a.backward === b.backward &&
    a.isInView === b.isInView &&
    a.ready === b.ready &&
    a.began === b.began &&
    a.completed === b.completed &&
    a.reverted === b.reverted &&
    a.offset === b.offset &&
    a.offsetStart === b.offsetStart &&
    a.offsetEnd === b.offsetEnd &&
    a.distance === b.distance &&
    a.isPinned === b.isPinned
  );
}

function AnimeScrollPinImpl<
  T extends HTMLElement,
  C extends HTMLElement,
>(
  {
    children,
    className,
    onReady,
    onStateChange,
    onControlsReady,
    ...scrollOptions
  }: AnimeScrollPinProps<T, C>,
  forwardedRef: ForwardedRef<AnimeScrollPinRef<T, C>>,
) {
  const {
    ref,
    targetRef,
    containerRef,
    controls,
    state,
    observer,
    isReady,
    isInView,
    isPinned,
    progress,
    scroll,
    velocity,
    backward,
  } = useAnimeOnScrollPin<T, C>(scrollOptions);

  const readyNotifiedRef = useRef(false);
  const controlsNotifiedRef = useRef(false);

  const refValue = useMemo<AnimeScrollPinRef<T, C>>(
    () => ({
      ref,
      targetRef,
      containerRef,
      controls,
      state,
      observer,
      isReady,
      isInView,
      isPinned,
      progress,
      scroll,
      velocity,
      backward,
      getObserver: () => observer,
    }),
    [
      ref,
      targetRef,
      containerRef,
      controls,
      state,
      observer,
      isReady,
      isInView,
      isPinned,
      progress,
      scroll,
      velocity,
      backward,
    ],
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

  const lastNotifiedStateRef = useRef<PinState>(state);
  useEffect(() => {
    if (!onStateChange || shallowEqualPinState(lastNotifiedStateRef.current, state)) return;
    lastNotifiedStateRef.current = state;
    onStateChange(state);
  }, [onStateChange, state]);

  // Render-prop form receives the full ref API; static children are rendered
  // inside a wrapper div only when a className is provided, otherwise we mirror
  // the published component and add no wrapper.
  if (typeof children === 'function') {
    return <>{children(refValue)}</>;
  }

  if (className) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement | null>} className={className}>
        {children ?? null}
      </div>
    );
  }

  return <>{children ?? null}</>;
}

export const AnimeScrollPin = forwardRef(AnimeScrollPinImpl) as <
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement,
>(
  props: AnimeScrollPinProps<T, C> & RefAttributes<AnimeScrollPinRef<T, C>>,
) => ReactElement | null;

export default AnimeScrollPin;
