import type { RefObject } from 'react';
import type { AnimationTarget } from '../types';

export function resolveTarget(
  target: AnimationTarget,
  rootElement?: HTMLElement | null,
): HTMLElement | SVGElement | NodeList | (HTMLElement | SVGElement)[] | null {
  if (!target) return null;

  if (Array.isArray(target)) {
    return target
      .map((t) => resolveTarget(t as AnimationTarget, rootElement))
      .filter(Boolean)
      .flat() as (HTMLElement | SVGElement)[];
  }

  if (typeof target === 'string') {
    const root = rootElement || document;
    return root.querySelectorAll(target) as unknown as (
      | HTMLElement
      | SVGElement
    )[];
  }

  if (isRef(target)) {
    return target.current;
  }

  return target as HTMLElement | SVGElement | NodeList;
}

export function isRef(
  value: unknown,
): value is RefObject<HTMLElement | SVGElement | null> {
  return value !== null && typeof value === 'object' && 'current' in value;
}
