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
import type { AnimationState, PlaybackControls, UseAnimeOptions } from '../types';
import { mergeChildProps } from '../utils/svg-component-utils';

export interface AnimeProps extends Omit<UseAnimeOptions, 'targets' | 'selector'> {
  children: ReactElement;
  onControlsReady?: (controls: PlaybackControls) => void;
  onStateChange?: (state: AnimationState) => void;
  className?: string;
  // @deprecated Use `autoplay` instead
  playOnMount?: boolean;
}

export const Anime = forwardRef<HTMLElement | SVGElement, AnimeProps>(function Anime(
  { children, onControlsReady, onStateChange, playOnMount, className, ...animationProps },
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

  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement | SVGElement, [ref]);

  if (!isValidElement(children)) {
    console.warn('[react-animejs] Anime requires a single valid React element as child');
    return children;
  }

  return cloneElement(children, mergeChildProps(children as ReactElement<any>, { ref, className }));
});

export default Anime;
