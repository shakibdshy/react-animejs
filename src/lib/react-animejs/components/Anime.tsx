import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { useAnime } from '../hooks/use-anime';
import { shallowEqual } from '../core';
import type { AnimationState, PlaybackControls, UseAnimeOptions } from '../types';
import { mergeChildProps } from '../utils/svg-component-utils';

export interface AnimeProps extends Omit<UseAnimeOptions, 'targets' | 'selector'> {
  children: ReactElement;
  onControlsReady?: (controls: PlaybackControls) => void;
  /**
   * Called whenever the reactive animation state *meaningfully* changes.
   *
   * Gated by shallow equality, so it fires on real transitions (begin,
   * complete, pause, reverse, seek) — not on every animation frame. During
   * playback this still emits once per frame because `progress`/`currentTime`
   * change each tick; bind it to a ref or throttle if you drive React state
   * from it.
   */
  onStateChange?: (state: AnimationState) => void;
  className?: string;
  // @deprecated Use `autoplay` instead
  playOnMount?: boolean;
}

export const Anime = forwardRef<HTMLElement | SVGElement, AnimeProps>(function Anime(
  { children, onControlsReady, onStateChange, playOnMount, className, enabled, ...animationProps },
  forwardedRef
) {
  const { ref, controls, state } = useAnime({
    ...animationProps,
    autoplay: animationProps.autoplay ?? playOnMount ?? false,
  });

  const notifiedRef = useRef(false);

  useEffect(() => {
    if (onControlsReady && !notifiedRef.current) {
      onControlsReady(controls);
      notifiedRef.current = true;
    }
  }, [controls, onControlsReady]);

  // Reset the ready notification when the animation is disabled, so a
  // subsequent enable re-fires onControlsReady with the fresh controls. This
  // matches AnimeTimeline's behavior and keeps the two components consistent.
  useEffect(() => {
    if (enabled === false) {
      notifiedRef.current = false;
    }
  }, [enabled]);

  // Notify on meaningful state changes. Shallow equality suppresses the
  // reference-only updates that `extractAnimationState` produces on internal
  // ticks where nothing observable changed (e.g. a paused animation re-render).
  const lastNotifiedStateRef = useRef<AnimationState>(state);
  useEffect(() => {
    if (!onStateChange) return;
    if (shallowEqual(lastNotifiedStateRef.current, state)) return;
    lastNotifiedStateRef.current = state;
    onStateChange(state);
  }, [state, onStateChange]);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement | SVGElement, [ref]);

  if (!isValidElement(children)) {
    console.warn('[react-animejs] Anime requires a single valid React element as child');
    return children;
  }

  return cloneElement(children, mergeChildProps(children as ReactElement<any>, { ref, className }));
});

export default Anime;
