import type { RefObject } from "react";
import type { AutoLayout, AutoLayoutParams, LayoutAnimationParams } from "animejs";
import type { AnimationTarget, AnimationState } from "./common";
import type { Timeline } from "./timeline";

export type { AutoLayout, AutoLayoutParams, LayoutAnimationParams } from "animejs";

export type UseAnimeLayoutOptions = AutoLayoutParams & {
  root?: AnimationTarget;
  selector?: string;
  deps?: unknown[];
  enabled?: boolean;
};

export interface UseAnimeLayoutControls {
  record: () => AutoLayout | null;
  animate: (params?: LayoutAnimationParams) => Timeline | null;
  update: (
    callback: (layout: AutoLayout) => void,
    params?: LayoutAnimationParams,
  ) => Timeline | null;
  revert: () => void;
}

export interface UseAnimeLayoutReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T | null>;
  controls: UseAnimeLayoutControls;
  state: AnimationState;
  layout: AutoLayout | null;
  timeline: Timeline | null;
  isReady: boolean;
  isAnimating: boolean;
}
