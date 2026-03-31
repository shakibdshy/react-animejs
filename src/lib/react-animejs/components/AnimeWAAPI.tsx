import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useAnimeWAAPI } from "../hooks";
import type {
  AnimationState,
  PlaybackControls,
  UseAnimeWAAPIOptions,
  WAAPIAnimation,
} from "../types";

export interface AnimeWAAPIRef {
  controls: PlaybackControls;
  state: AnimationState;
  animation: WAAPIAnimation | null;
  isReady: boolean;
  isPlaying: boolean;
  getAnimation: () => WAAPIAnimation | null;
}

export interface AnimeWAAPIProps
  extends Omit<UseAnimeWAAPIOptions, "targets"> {
  children: ReactElement;
  onReady?: (api: AnimeWAAPIRef) => void;
  onControlsReady?: (controls: PlaybackControls) => void;
  onStateChange?: (state: AnimationState) => void;
  className?: string;
}

export const AnimeWAAPI = forwardRef<AnimeWAAPIRef, AnimeWAAPIProps>(
  function AnimeWAAPI(
    {
      children,
      onReady,
      onControlsReady,
      onStateChange,
      className,
      ...animationProps
    },
    ref,
  ) {
    const { ref: targetRef, controls, state, animation, isReady, isPlaying } =
      useAnimeWAAPI({
        ...animationProps,
      });
    const readyNotifiedRef = useRef(false);
    const controlsNotifiedRef = useRef(false);

    const refValue = useMemo<AnimeWAAPIRef>(
      () => ({
        controls,
        state,
        animation,
        isReady,
        isPlaying,
        getAnimation: () => animation,
      }),
      [controls, state, animation, isReady, isPlaying],
    );

    useImperativeHandle(ref, () => refValue, [refValue]);

    useEffect(() => {
      if (onControlsReady && !controlsNotifiedRef.current) {
        onControlsReady(controls);
        controlsNotifiedRef.current = true;
      }
    }, [controls, onControlsReady]);

    useEffect(() => {
      if (isReady && onReady && !readyNotifiedRef.current) {
        onReady(refValue);
        readyNotifiedRef.current = true;
      }
    }, [isReady, onReady, refValue]);

    useEffect(() => {
      if (!animationProps.enabled) {
        readyNotifiedRef.current = false;
      }
    }, [animationProps.enabled]);

    useEffect(() => {
      onStateChange?.(state);
    }, [state, onStateChange]);

    if (!isValidElement(children)) {
      console.warn(
        "[react-animejs] AnimeWAAPI requires a single valid React element as child",
      );
      return children;
    }

    return cloneElement(children, {
      ref: targetRef,
      className: className
        ? `${(children.props as { className?: string }).className || ""} ${className}`.trim()
        : (children.props as { className?: string }).className,
    } as Partial<unknown>);
  },
);

export default AnimeWAAPI;
