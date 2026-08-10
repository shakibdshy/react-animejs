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

/**
 * Resolve a target using the active animation scope when one exists.
 *
 * Keeping this named seam separate makes it difficult for imperative controls
 * to accidentally fall back to document-wide selector resolution.
 */
export function resolveScopedTarget(
  target: AnimationTarget,
  scopeRoot?: HTMLElement | null,
) {
  return resolveTarget(target, scopeRoot);
}

export function isRef(
  value: unknown,
): value is RefObject<HTMLElement | SVGElement | null> {
  return value !== null && typeof value === 'object' && 'current' in value;
}
