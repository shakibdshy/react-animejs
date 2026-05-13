import { RESERVED_KEYS } from './constants';

export function parseAnimeOptions<T extends Record<string, unknown>>(
  options: T,
): {
  animatableProps: Record<string, unknown>;
  otherOptions: Record<string, unknown>;
} {
  const animatableProps: Record<string, unknown> = {};
  const otherOptions: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(options)) {
    if (
      RESERVED_KEYS.has(
        key as typeof RESERVED_KEYS extends Set<infer U> ? U : never,
      )
    ) {
      otherOptions[key] = value;
    } else {
      animatableProps[key] = value;
    }
  }

  return { animatableProps, otherOptions };
}
