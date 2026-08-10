/**
 * Adapter Registry - idempotent adapter registration for React
 *
 * anime.js v4.5.0's `registerAdapter()` (from `animejs/adapters`) is
 * imperative and global, with no unregister. Calling it on every React mount
 * would leak duplicate adapters. This module keys registrations by a stable
 * `id` so the same adapter registers exactly once per app, regardless of
 * React lifecycle (mount/unmount/StrictMode double-invoke).
 *
 * @see https://animejs.com/documentation/adapters/
 */

import { registerAdapter } from 'animejs/adapters';
import type { AnimeAdapterConfig, AnimeAdapterInstance } from '../types/adapter';

// =============================================================================
// Module-level singleton
// =============================================================================

/**
 * Map of `id` → registered adapter instance. Lives at module scope so it
 * survives across React renders and is shared by all `useAnimeAdapter` /
 * `<AnimeAdapter>` instances in the app.
 *
 * Since anime.js has no unregister, entries persist for the app's lifetime
 * once created. This is intentional — adapters are "register once" global
 * extensions, like custom elements.
 */
const registry = new Map<string, AnimeAdapterInstance>();

// =============================================================================
// Registration
// =============================================================================

/**
 * Register an adapter idempotently, keyed by `config.id`.
 *
 * - First call for an `id`: wires up the adapter via anime.js's
 *   `registerAdapter()`, stores it, and returns it.
 * - Subsequent calls with the same `id`: returns the existing adapter without
 *   re-registering (no duplicate target adapters, no duplicate properties).
 *
 * @param config - declarative adapter config
 * @returns the anime.js `Adapter` instance (newly created or existing)
 */
export function registerAnimeAdapter(config: AnimeAdapterConfig): AnimeAdapterInstance {
  const existing = registry.get(config.id);
  if (existing) return existing;

  const adapter = registerAdapter(
    config.detect as unknown as ((target: unknown) => boolean) | undefined
  ) as AnimeAdapterInstance;

  // Wire up each target-adapter group and its properties
  if (config.targets) {
    for (const targetConfig of config.targets) {
      const targetAdapter = adapter.registerTargetAdapter(targetConfig.detect) as unknown as {
        registerProperty: (
          name: string,
          getter: (t: Record<string, unknown>) => unknown,
          setter: (target: Record<string, unknown>, value: number, tween: unknown) => void,
          gate?: (t: Record<string, unknown>) => unknown
        ) => void;
      };
      for (const [name, property] of Object.entries(targetConfig.properties)) {
        // anime.js's registerProperty signature: (name, getter, setter, gate?)
        targetAdapter.registerProperty(name, property.get, property.set, property.gate);
      }
    }
  }

  registry.set(config.id, adapter);
  return adapter;
}

/**
 * Look up a previously-registered adapter by `id` without registering.
 *
 * @returns the adapter, or `undefined` if none is registered under that id
 */
export function getRegisteredAdapter(id: string): AnimeAdapterInstance | undefined {
  return registry.get(id);
}

// =============================================================================
// Test-only helpers
// =============================================================================

/**
 * Clear the react-animejs adapter registry map (NOT anime.js's own global
 * adapter list, which has no unregister). Test-only — lets each test start
 * with an empty react-animejs registry so idempotency assertions are
 * deterministic.
 *
 * @internal
 */
export function clearAdapterRegistryForTesting(): void {
  registry.clear();
}
