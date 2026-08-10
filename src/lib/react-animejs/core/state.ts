import type { AnimationState } from '../types';
import { createSafeCallback } from './callbacks';

export function extractAnimationState(instance: unknown): AnimationState {
  if (!instance || typeof instance !== 'object') {
    return {
      id: '',
      progress: 0,
      currentTime: 0,
      duration: 0,
      paused: true,
      began: false,
      completed: false,
      reversed: false,
      currentIteration: 0,
      deltaTime: 0,
      iterationCurrentTime: 0,
      iterationProgress: 0,
      speed: 1,
      fps: 0,
      backwards: false,
    };
  }

  const anim = instance as Record<string, unknown>;

  return {
    id: (anim.id as string) || '',
    progress: (anim.progress as number) || 0,
    currentTime: (anim.currentTime as number) || 0,
    duration: (anim.duration as number) || 0,
    paused: (anim.paused as boolean) ?? true,
    began: (anim.began as boolean) ?? false,
    completed: (anim.completed as boolean) ?? false,
    reversed: (anim.reversed as boolean) ?? false,
    currentIteration:
      ((anim.iteration as number) ?? (anim._currentIteration as number)) || 0,
    deltaTime: (anim.deltaTime as number) || 0,
    iterationCurrentTime: (anim.iterationCurrentTime as number) || 0,
    iterationProgress: (anim.iterationProgress as number) || 0,
    speed: (anim.speed as number) || 1,
    fps: (anim.fps as number) || 0,
    backwards: (anim.backwards as boolean) ?? false,
    labels: anim.labels as Record<string, number>,
  };
}

export function buildCallbackConfig<
  T extends Record<string, unknown>,
  S extends AnimationState,
  C extends Record<string, ((...args: any[]) => void) | undefined>,
>(
  setState: (state: S) => void,
  extractState: (instance: unknown) => S,
  callbacks: C,
  _defaultState: S,
): T {
  const config: Record<string, unknown> = {};

  config.onBegin = (anim: unknown) => {
    setState(extractState(anim));
    createSafeCallback(callbacks.onBegin, 'onBegin')?.(anim);
  };

  config.onComplete = (anim: unknown) => {
    setState(extractState(anim));
    createSafeCallback(callbacks.onComplete, 'onComplete')?.(anim);
  };

  config.onUpdate = (anim: unknown) => {
    setState(extractState(anim));
    createSafeCallback(callbacks.onUpdate, 'onUpdate')?.(anim);
  };

  config.onRender = (anim: unknown) => {
    setState(extractState(anim));
    createSafeCallback(callbacks.onRender, 'onRender')?.(anim);
  };

  config.onBeforeUpdate = (anim: unknown) => {
    setState(extractState(anim));
    createSafeCallback(callbacks.onBeforeUpdate, 'onBeforeUpdate')?.(anim);
  };

  config.onLoop = (anim: unknown) => {
    setState(extractState(anim));
    createSafeCallback(callbacks.onLoop, 'onLoop')?.(anim);
  };

  config.onPause = (anim: unknown) => {
    setState(extractState(anim));
    createSafeCallback(callbacks.onPause, 'onPause')?.(anim);
  };

  return config as T;
}
