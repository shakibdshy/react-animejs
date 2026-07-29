/**
 * Adapter types for react-animejs
 *
 * These types wrap anime.js v4.5.0's adapter system (from `animejs/adapters`)
 * in a React-friendly, declarative shape. Adapters let `useAnime` / `<Anime>`
 * animate non-DOM objects — Three.js scenes, PixiJS display objects, Canvas
 * contexts, custom class instances — exactly like DOM elements.
 *
 * anime.js's own `Adapter` and `TargetAdapter` classes are NOT exported as
 * types from `animejs/adapters` (only `registerAdapter` is). So these types
 * are structural: they mirror the runtime shape of anime.js's adapter objects
 * without importing the private classes.
 *
 * @see https://animejs.com/documentation/adapters/
 */

/**
 * Matches anime.js's `TargetAdapterEntry` — the getter/setter pair for a
 * single animated property on a target.
 *
 * The setter receives `(target, value, tween)`:
 * - For simple scalar tweens, `value` is the interpolated number.
 * - For color/complex tweens, `value` is `undefined` and you must read the
 *   decomposed numeric parts from `tween._numbers`.
 *
 * @see registry.d.ts `TargetAdapterEntry` in animejs
 */
export interface AnimeAdapterProperty<
  TTarget extends object = Record<string, unknown>,
  TTween = unknown,
> {
  /** Read the current value of the property from the target. */
  get: (target: TTarget) => unknown;
  /** Write the interpolated value to the target. */
  set: (target: TTarget, value: number, tween: TTween) => void;
  /**
   * Optional gate. When provided and returning falsy, this property is
   * skipped for the given target. Use to scope a property to a subset of
   * matching targets (e.g. only materials that have an `opacity` field).
   */
  gate?: (target: TTarget) => unknown;
}

/**
 * A group of properties scoped to a specific target type within an adapter.
 *
 * For example, a Three.js adapter might register one target adapter for
 * `Object3D` (position, rotation, scale) and another for `Material`
 * (opacity, color).
 */
export interface AnimeAdapterTarget<
  TTarget extends object = Record<string, unknown>,
  TTween = unknown,
> {
  /**
   * Predicate that claims a target for this target-adapter. The first
   * target-adapter whose `detect` returns truthy wins (registration order).
   */
  detect: (target: TTarget) => unknown;
  /** Properties to wire up for targets matching `detect`. */
  properties: Record<string, AnimeAdapterProperty<TTarget, TTween>>;
}

/**
 * The declarative adapter config passed to `useAnimeAdapter` /
 * `<AnimeAdapter>`. Mirrors anime.js's three-level adapter structure:
 *
 * 1. `detect` — adapter-level gate (early-reject unrelated targets)
 * 2. `targets[]` — target-adapter groups, each claiming a target type
 * 3. `targets[].properties{}` — per-property getter/setter pairs
 *
 * `id` is a react-animejs addition: it keys idempotent registration so the
 * same adapter isn't registered twice across React lifecycle (mount/unmount,
 * StrictMode double-invoke). anime.js itself has no unregister, so once an
 * `id` is registered it persists for the app's lifetime.
 */
export interface AnimeAdapterConfig<
  TTarget extends object = Record<string, unknown>,
  TTween = unknown,
> {
  /**
   * Stable unique identifier for this adapter. Used to dedupe registrations
   * across React renders/mounts. Choose a descriptive name ('pixi',
   * 'konva', 'custom-mesh').
   */
  id: string;
  /**
   * Optional adapter-level gate. When provided, all lookups against this
   * adapter are skipped if `detect(target)` returns falsy. Recommended for
   * performance: early-reject DOM nodes and unrelated objects so the per-
   * target adapters don't run on every animated element.
   */
  detect?: (target: TTarget) => unknown;
  /**
   * Target-adapter groups. Each defines a `detect` predicate and a set of
   * `properties`. Resolution order: target adapters first (in array order,
   * first match wins), then property resolvers (none here — for advanced
   * pattern-matching use `registerAdapter` from `animejs/adapters` directly).
   */
  targets?: AnimeAdapterTarget<TTarget, TTween>[];
}

/**
 * Structural type matching the `Adapter` instance returned by anime.js's
 * `registerAdapter()`. Returned by `useAnimeAdapter` so consumers can
 * inspect/extend a registered adapter imperatively if needed.
 */
export interface AnimeAdapterInstance<TTarget extends object = Record<string, unknown>> {
  detect: ((target: TTarget) => boolean) | null;
  targetAdapters: unknown[];
  propertyResolvers: unknown[];
  registerTargetAdapter: (detect: (target: TTarget) => unknown) => unknown;
  registerPropertyResolver: (resolver: (target: TTarget, name: string) => unknown) => void;
}
