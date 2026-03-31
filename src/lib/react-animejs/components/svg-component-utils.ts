import { useMemo, type MutableRefObject, type RefObject } from "react";
import type { PlaybackControls, AnimationState, JSAnimation } from "../types";
import { extractAnimationState, isRef } from "../core";

export interface SvgComponentRef {
  controls: PlaybackControls;
  state: AnimationState;
  animation: JSAnimation | null;
  isReady: boolean;
  isPlaying: boolean;
  getAnimation: () => JSAnimation | null;
}

export function useSvgPlaybackControls(
  animationRef: MutableRefObject<JSAnimation | null>,
  setAnimationState: (state: AnimationState) => void,
): PlaybackControls {
  return useMemo(
    () => ({
      play: () => {
        if (!animationRef.current) return;
        animationRef.current.play();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      pause: () => {
        if (!animationRef.current) return;
        animationRef.current.pause();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      resume: () => {
        if (!animationRef.current) return;
        animationRef.current.resume();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      restart: () => {
        if (!animationRef.current) return;
        animationRef.current.restart();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      reverse: () => {
        if (!animationRef.current) return;
        animationRef.current.reverse();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      alternate: () => {
        if (!animationRef.current) return;
        animationRef.current.alternate();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      complete: () => {
        if (!animationRef.current) return;
        animationRef.current.complete();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      reset: () => {
        if (!animationRef.current) return;
        animationRef.current.reset();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      cancel: () => {
        if (!animationRef.current) return;
        animationRef.current.cancel();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      revert: () => {
        if (!animationRef.current) return;
        animationRef.current.revert();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      refresh: () => {
        if (!animationRef.current) return;
        animationRef.current.refresh();
        setAnimationState(extractAnimationState(animationRef.current));
      },
      seek: (time: number | string) => {
        if (!animationRef.current) return;
        animationRef.current.seek(time);
        setAnimationState(extractAnimationState(animationRef.current));
      },
      stretch: (duration: number) => {
        if (!animationRef.current) return;
        animationRef.current.stretch(duration);
        setAnimationState(extractAnimationState(animationRef.current));
      },
      setPlaybackRate: (rate: number) => {
        if (!animationRef.current) return;
        (animationRef.current as JSAnimation & { playbackRate?: number }).playbackRate = rate;
        setAnimationState(extractAnimationState(animationRef.current));
      },
      setFrameRate: (fps: number) => {
        if (!animationRef.current) return;
        (animationRef.current as JSAnimation & { fps?: number }).fps = fps;
        setAnimationState(extractAnimationState(animationRef.current));
      },
    }),
    [animationRef, setAnimationState],
  );
}

export function resolveSvgElement<T extends SVGElement>(
  value?: T | RefObject<T | null> | null,
): T | null {
  if (!value) {
    return null;
  }

  if (isRef(value)) {
    return value.current as T | null;
  }

  return value;
}

export function mergeClassName(
  className: string | undefined,
  childClassName: unknown,
) {
  if (!className) {
    return childClassName as string | undefined;
  }

  return `${(childClassName as string | undefined) || ""} ${className}`.trim();
}
