export function depsChanged(
  prev: unknown[] | undefined,
  next: unknown[] | undefined,
): boolean {
  if (prev === next) return false;
  if (!prev || !next) return true;
  if (prev.length !== next.length) return true;

  for (let i = 0; i < prev.length; i++) {
    if (!Object.is(prev[i], next[i])) return true;
  }

  return false;
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

export function isFunction(
  value: unknown,
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

export function safeJsonStringify(obj: unknown): string {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) return '[Circular]';

      if (typeof window !== 'undefined' && value instanceof Node) {
        return `[DOM Node: ${value.nodeName}]`;
      }

      if (
        value &&
        typeof value === 'object' &&
        Object.prototype.hasOwnProperty.call(value, 'current')
      ) {
        return {
          __type: 'Ref',
          current: (value as { current: unknown }).current,
        };
      }

      if (typeof value === 'function') {
        return '[Function]';
      }

      if (key.startsWith('__react') || key.startsWith('fiber')) {
        return undefined;
      }

      cache.add(value);
    }
    return value;
  });
}

/**
 * Shallow equality check for two values. Treats objects with the same keys and
 * shallow-equal primitive values as equal; references are compared otherwise.
 *
 * Used to gate `onStateChange` so it doesn't fire on every animation tick when
 * the extracted `AnimationState` is reference-new but value-identical. Object
 * fields (e.g. `labels`) are compared by reference — they only change on
 * timeline rebuild, not per-tick, so this is safe.
 */
export function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (
      !Object.is(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      )
    ) {
      return false;
    }
  }
  return true;
}
