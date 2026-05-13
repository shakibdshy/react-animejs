export type DemoScrollObserverSnapshot = {
  progress: number;
  velocity: number;
  backward: boolean;
  isInView: boolean;
  offsetStart: number;
  offsetEnd: number;
};

export const DEFAULT_SCROLL_OBSERVER_SNAPSHOT: DemoScrollObserverSnapshot = {
  progress: 0,
  velocity: 0,
  backward: false,
  isInView: false,
  offsetStart: 0,
  offsetEnd: 0,
};

export function toObserverSnapshot(observer: {
  progress?: number;
  velocity?: number;
  backward?: boolean;
  isInView?: boolean;
  offsetStart?: number;
  offsetEnd?: number;
}): DemoScrollObserverSnapshot {
  return {
    progress: observer.progress ?? 0,
    velocity: observer.velocity ?? 0,
    backward: observer.backward ?? false,
    isInView: observer.isInView ?? false,
    offsetStart: observer.offsetStart ?? 0,
    offsetEnd: observer.offsetEnd ?? 0,
  };
}
