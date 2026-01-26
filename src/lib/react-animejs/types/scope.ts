/**
 * Scope-related types for AnimeProvider and internal scope management
 */

import type { JSX, RefObject } from "react";

// =============================================================================
// Scope Types
// =============================================================================

/**
 * Anime.js Scope instance
 */
export interface AnimeScope {
  /**
   * Root element ref for scoping
   */
  root: RefObject<HTMLElement | null>;

  /**
   * Add animations/timers/draggables to this scope
   */
  add: <T>(factory: (self: ScopeSelf) => T) => AnimeScope;

  /**
   * Registered methods accessible via scope.current.methods
   */
  methods: Record<string, (...args: unknown[]) => unknown>;

  /**
   * Revert all animations in this scope
   */
  revert: () => void;

  /**
   * Refresh the scope (re-query selectors)
   */
  refresh: () => void;
}

/**
 * Self parameter passed to scope.add() callback
 */
export interface ScopeSelf {
  /**
   * Register a method accessible via scope.current.methods
   */
  add: (name: string, fn: (...args: unknown[]) => unknown) => void;
}

/**
 * Scope context value provided by AnimeProvider
 */
export interface AnimeScopeContext {
  /**
   * The current scope instance
   */
  scope: AnimeScope | null;

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
}

/**
 * Props for AnimeProvider component
 */
export interface AnimeProviderProps {
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
}
