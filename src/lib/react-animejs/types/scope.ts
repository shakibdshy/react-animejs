/**
 * Scope-related types for Anime.js Scope functionality
 *
 * Scopes allow animations to react to media queries, use custom root elements,
 * share default parameters, and be reverted in batch.
 *
 * @see https://animejs.com/documentation/scope
 */

import type { JSX, RefObject } from "react";
import type { AnimationCallbacks, Easing, PlaybackSettings } from "./common";

// =============================================================================
// Scope Parameters Types
// =============================================================================

/**
 * Media queries configuration for scope
 * Key is an arbitrary name, value is the media query definition string
 *
 * @example
 * ```ts
 * {
 *   isSmall: '(max-width: 640px)',
 *   isMedium: '(min-width: 641px) and (max-width: 1024px)',
 *   isLarge: '(min-width: 1025px)',
 *   reduceMotion: '(prefers-reduced-motion)',
 * }
 * ```
 */
export type ScopeMediaQueries = Record<string, string>;

/**
 * Media query matches state
 * Boolean values indicating which media queries currently match
 */
export type ScopeMediaMatches<T extends ScopeMediaQueries = ScopeMediaQueries> =
  {
    [K in keyof T]: boolean;
  };

/**
 * Default animation parameters that apply to all animations within the scope
 */
export interface ScopeDefaults
  extends Partial<PlaybackSettings>, Partial<AnimationCallbacks> {
  /**
   * Default easing for all animations in scope
   */
  ease?: Easing;

  /**
   * Default duration in milliseconds
   */
  duration?: number;

  /**
   * Default delay in milliseconds
   */
  delay?: number;

  /**
   * Default loop count or boolean
   */
  loop?: boolean | number;

  /**
   * Whether animations should alternate direction on loop
   */
  alternate?: boolean;
}

/**
 * Parameters for creating a scope
 *
 * @see https://animejs.com/documentation/scope/scope-parameters
 */
export interface ScopeParameters<
  T extends ScopeMediaQueries = ScopeMediaQueries,
> {
  /**
   * Root element for the scope. CSS selectors within the scope
   * will only match elements inside this root.
   *
   * Accepts CSS selector string or DOM element
   *
   * @see https://animejs.com/documentation/scope/scope-parameters/root
   */
  root?: string | HTMLElement | RefObject<HTMLElement | null>;

  /**
   * Default animation parameters that apply to all animations within the scope
   *
   * @see https://animejs.com/documentation/scope/scope-parameters/defaults
   */
  defaults?: ScopeDefaults;

  /**
   * Media queries configuration
   * The scope will re-run constructors when media query states change
   *
   * @see https://animejs.com/documentation/scope/scope-parameters/mediaqueries
   */
  mediaQueries?: T;
}

// =============================================================================
// Scope Self Types (passed to constructor callbacks)
// =============================================================================

/**
 * Self parameter passed to scope.add() callback
 * Provides access to scope context within the constructor
 *
 * @see https://animejs.com/documentation/scope/add-constructor-function
 */
export interface ScopeSelf<T extends ScopeMediaQueries = ScopeMediaQueries> {
  /**
   * Current media query match states
   * Access: `self.matches.isSmall`, `self.matches.reduceMotion`, etc.
   */
  matches: ScopeMediaMatches<T>;

  /**
   * The root element of the scope
   */
  root: HTMLElement | Document;

  /**
   * Register a method accessible via scope.methods
   * Methods can be called outside the scope
   *
   * @param name - The method name
   * @param fn - The method function
   *
   * @example
   * ```ts
   * self.add('onClick', (e) => {
   *   animate('.square', { rotate: '+=360' });
   * });
   * // Later: scope.methods.onClick(event);
   * ```
   */
  add: (name: string, fn: (...args: unknown[]) => unknown) => void;
}

/**
 * Cleanup function returned from scope constructor
 * Called when the scope is reverted or when media query state changes
 */
export type ScopeCleanupFunction = () => void;

/**
 * Constructor function for scope.add()
 * Receives scope context and optionally returns a cleanup function
 */
export type ScopeConstructorFunction<
  T extends ScopeMediaQueries = ScopeMediaQueries,
> = (self: ScopeSelf<T>) => ScopeCleanupFunction | void;

// =============================================================================
// Anime.js Scope Instance Types
// =============================================================================

/**
 * Methods registered within the scope via self.add(name, fn)
 */
export type ScopeMethods = Record<string, (...args: unknown[]) => unknown>;

/**
 * Anime.js Scope instance returned by createScope()
 *
 * @see https://animejs.com/documentation/scope/scope-properties
 * @see https://animejs.com/documentation/scope/scope-methods
 */
export interface AnimeJsScope<T extends ScopeMediaQueries = ScopeMediaQueries> {
  /**
   * Root element of the scope (HTMLElement or Document)
   */
  root: HTMLElement | Document;

  /**
   * Current media query match states
   */
  matches: ScopeMediaMatches<T>;

  /**
   * Methods registered via self.add(name, fn) within constructors
   * These can be called from outside the scope
   */
  methods: ScopeMethods;

  /**
   * Add a constructor function to the scope
   * The constructor is called immediately and on media query changes
   *
   * @param constructor - Function that sets up animations/timers/etc
   * @returns The scope itself for chaining
   *
   * @see https://animejs.com/documentation/scope/scope-methods/add
   */
  add(constructor: ScopeConstructorFunction<T>): AnimeJsScope<T>;

  /**
   * Add a constructor that only runs once (doesn't re-run on media query changes)
   *
   * @param constructor - Function that sets up animations/timers/etc
   * @returns The scope itself for chaining
   *
   * @see https://animejs.com/documentation/scope/scope-methods/addonce
   */
  addOnce(constructor: ScopeConstructorFunction<T>): AnimeJsScope<T>;

  /**
   * Register a named method in the scope
   *
   * @param name - The method name
   * @param method - The method function
   * @returns The scope itself for chaining
   */
  add(name: string, method: (...args: unknown[]) => unknown): AnimeJsScope<T>;

  /**
   * Preserve the current time of tickables when refreshing
   * Useful when media queries change but you want to maintain animation progress
   *
   * @returns The scope itself for chaining
   *
   * @see https://animejs.com/documentation/scope/scope-methods/keeptime
   */
  keepTime(): AnimeJsScope<T>;

  /**
   * Revert all animations/timers/draggables in this scope
   * Also calls cleanup functions returned from constructors
   *
   * @returns The scope itself for chaining
   *
   * @see https://animejs.com/documentation/scope/scope-methods/revert
   */
  revert(): AnimeJsScope<T>;

  /**
   * Re-run all constructors, useful after DOM changes
   *
   * @returns The scope itself for chaining
   *
   * @see https://animejs.com/documentation/scope/scope-methods/refresh
   */
  refresh(): AnimeJsScope<T>;
}

// =============================================================================
// React Hook Types
// =============================================================================

/**
 * Options for useAnimeScope hook
 */
export interface UseAnimeScopeOptions<
  T extends ScopeMediaQueries = ScopeMediaQueries,
> extends ScopeParameters<T> {
  /**
   * Whether the scope is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Dependency array for recreating the scope
   */
  deps?: unknown[];

  /**
   * Callback when media query state changes
   */
  onMediaChange?: (matches: ScopeMediaMatches<T>) => void;

  /**
   * Callback when scope is reverted
   */
  onRevert?: () => void;

  /**
   * Callback when scope is refreshed
   */
  onRefresh?: () => void;
}

/**
 * Return value from useAnimeScope hook
 */
export interface UseAnimeScopeReturn<
  T extends ScopeMediaQueries = ScopeMediaQueries,
> {
  /**
   * Ref to attach to the root element
   */
  ref: RefObject<HTMLElement | null>;

  /**
   * The underlying Anime.js scope instance
   */
  scope: AnimeJsScope<T> | null;

  /**
   * Current media query match states
   */
  matches: ScopeMediaMatches<T>;

  /**
   * Registered methods from the scope
   */
  methods: ScopeMethods;

  /**
   * Whether the scope is ready
   */
  isReady: boolean;

  /**
   * Add a constructor to the scope
   */
  add: (constructor: ScopeConstructorFunction<T>) => void;

  /**
   * Add a constructor that only runs once
   */
  addOnce: (constructor: ScopeConstructorFunction<T>) => void;

  /**
   * Revert all animations in the scope
   */
  revert: () => void;

  /**
   * Refresh the scope (re-run constructors)
   */
  refresh: () => void;

  /**
   * Preserve current time when refreshing
   */
  keepTime: () => void;
}

// =============================================================================
// AnimeProvider Types (Context-based scope)
// =============================================================================

/**
 * Scope context value provided by AnimeProvider
 */
export interface AnimeScopeContext {
  /**
   * The current scope instance
   */
  scope: AnimeJsScope | null;

  /**
   * Root ref for the scope
   */
  rootRef: RefObject<HTMLElement | null>;

  /**
   * Whether inside an AnimeProvider
   */
  isScoped: boolean;

  /**
   * Register a cleanup function to be called on unmount
   */
  registerCleanup: (cleanup: () => void) => void;

  /**
   * Current media query matches (if mediaQueries configured in provider)
   */
  matches: ScopeMediaMatches;
}

/**
 * Props for AnimeProvider component
 */
export interface AnimeProviderProps<
  T extends ScopeMediaQueries = ScopeMediaQueries,
> {
  children: React.ReactNode;

  /**
   * Custom root element ref (optional)
   * If not provided, a wrapper div will be created
   */
  rootRef?: RefObject<HTMLElement | null>;

  /**
   * Whether to render a wrapper element
   * @default true
   */
  asWrapper?: boolean;

  /**
   * Wrapper element tag name
   * @default 'div'
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Additional props to pass to the wrapper element
   */
  wrapperProps?: React.HTMLAttributes<HTMLElement>;

  /**
   * Default animation parameters for all animations in scope
   */
  defaults?: ScopeDefaults;

  /**
   * Media queries to track
   */
  mediaQueries?: T;

  /**
   * Callback when media query state changes
   */
  onMediaChange?: (matches: ScopeMediaMatches<T>) => void;
}

// =============================================================================
// Legacy Types (for backwards compatibility)
// =============================================================================

/**
 * @deprecated Use AnimeJsScope instead
 */
export type AnimeScope = AnimeJsScope;
