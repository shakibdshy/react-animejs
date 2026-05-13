import type { RefObject } from 'react';

export function mergeRefs<T>(
  ...refs: (RefObject<T> | ((instance: T | null) => void) | null | undefined)[]
): (instance: T | null) => void {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        (ref as { current: T | null }).current = instance;
      }
    });
  };
}
