import { useRef } from 'react';

/**
 * Keeps a stable ref object pointing at the latest value.
 *
 * This is used for callbacks passed into long-lived Anime.js instances. The
 * instance can keep its original configuration while React consumers still
 * receive the newest callback implementation.
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
