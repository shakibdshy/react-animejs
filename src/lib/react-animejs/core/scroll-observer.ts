import type { ScrollObserver } from 'animejs';
import type { UseAnimeOptions, UseAnimeScrollTriggerOptions } from '../types';

export type ScrollObserverCallbackKey =
  | 'onEnter'
  | 'onLeave'
  | 'onEnterForward'
  | 'onLeaveForward'
  | 'onEnterBackward'
  | 'onLeaveBackward'
  | 'onSyncEnter'
  | 'onSyncLeave'
  | 'onUpdate'
  | 'onResize'
  | 'onSyncComplete';

export function normalizeSingleElement(
  target: HTMLElement | SVGElement | NodeList | (HTMLElement | SVGElement)[] | null
): HTMLElement | SVGElement | null {
  if (!target) return null;

  if (Array.isArray(target)) {
    return (target[0] as HTMLElement | SVGElement) ?? null;
  }

  if (typeof NodeList !== 'undefined' && target instanceof NodeList) {
    return (target[0] as HTMLElement | SVGElement) ?? null;
  }

  return target as HTMLElement | SVGElement;
}

export function isScrollObserverInstance(value: unknown): value is ScrollObserver {
  return Boolean(
    value && typeof value === 'object' && 'link' in value && 'refresh' in value && 'revert' in value
  );
}

export function isScrollTriggerOptions(
  value: UseAnimeOptions['autoplay']
): value is UseAnimeScrollTriggerOptions {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;

  return [
    'id',
    'sync',
    'container',
    'target',
    'axis',
    'enter',
    'leave',
    'repeat',
    'debug',
    'onEnter',
    'onLeave',
    'onEnterForward',
    'onLeaveForward',
    'onEnterBackward',
    'onLeaveBackward',
    'onSyncEnter',
    'onSyncLeave',
    'onUpdate',
    'onResize',
    'onSyncComplete',
  ].some((key) => key in value);
}
