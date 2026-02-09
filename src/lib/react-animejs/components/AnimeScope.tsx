/**
 * AnimeScope - Declarative Scope Component for Anime.js
 *
 * Built on top of useAnimeScope hook, providing a declarative way to create
 * scoped animations with media query reactivity without manual hook management.
 *
 * Features:
 * - Media query reactivity (auto re-runs animations on viewport changes)
 * - Declarative animate prop (no useEffect boilerplate needed)
 * - Shared default animation parameters
 * - All scope methods exposed via ref
 * - Automatic lifecycle management
 * - Provides ScopeContext so children hooks (useAnime, etc.) are automatically scoped
 *
 * @see https://animejs.com/documentation/scope
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
  type HTMLAttributes,
  type ElementType,
} from "react";
import { animate, utils } from "animejs";
import { useAnimeScope as useCreateScope } from "../hooks/use-anime-scope";
import { ScopeContext } from "../core/scope-context";
import type { AnimeScopeContext as ContextType } from "../types";
import type {
  ScopeMediaQueries,
  ScopeMediaMatches,
  ScopeSelf,
  ScopeDefaults,
  ScopeMethods,
  AnimeJsScope,
  ScopeCleanupFunction,
} from "../types/scope";

// =============================================================================
// Types
// =============================================================================

/**
 * Extended context passed to the animate callback
 * Includes the Anime.js animate and utils functions for convenience
 */
export interface AnimeScopeContext<
  T extends ScopeMediaQueries = ScopeMediaQueries,
> extends ScopeSelf<T> {
  /**
   * Anime.js animate function - creates animations scoped to this element
   * @see https://animejs.com/documentation/animation
   */
  animate: typeof animate;

  /**
   * Anime.js utils object - utility functions for manipulating values
   * @see https://animejs.com/documentation/utils
   */
  utils: typeof utils;
}

/**
 * Animate function that receives scope context with animate/utils and returns optional cleanup
 */
export type AnimeScopeAnimateFn<
  T extends ScopeMediaQueries = ScopeMediaQueries,
> = (ctx: AnimeScopeContext<T>) => ScopeCleanupFunction | void;

/**
 * Props for AnimeScope component
 */
export interface AnimeScopeProps<
  T extends ScopeMediaQueries = ScopeMediaQueries,
> extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /**
   * Child elements to render within the scope.
   * Can be a ReactNode or a function that receives the current media matches.
   */
  children: ReactNode | ((matches: ScopeMediaMatches<T>) => ReactNode);

  /** Wrapper element type */
  as?: ElementType;

  /** Whether the scope is enabled */
  enabled?: boolean;

  /**
   * Media queries to track within this scope
   * Animations will be re-run when media query states change
   */
  mediaQueries?: T;

  /**
   * Default animation parameters for all animations in this scope
   */
  defaults?: ScopeDefaults;

  /**
   * Animation constructor function
   * This is called automatically when the scope is ready
   * and re-called when media queries or deps change
   */
  animate?: AnimeScopeAnimateFn<T>;

  /**
   * One-time animation constructor (doesn't re-run on media query changes)
   */
  animateOnce?: AnimeScopeAnimateFn<T>;

  /**
   * Dependencies that trigger animation re-run (in addition to media query changes)
   * Similar to useEffect dependencies
   */
  deps?: unknown[];

  /** Callback when scope is ready */
  onReady?: (ref: AnimeScopeRef<T>) => void;

  /** Callback when media query state changes */
  onMediaChange?: (matches: ScopeMediaMatches<T>) => void;

  /** Callback when scope is reverted */
  onRevert?: () => void;

  /** Callback when scope is refreshed */
  onRefresh?: () => void;
}

/**
 * Ref interface for AnimeScope - exposes all scope controls and state
 */
export interface AnimeScopeRef<
  T extends ScopeMediaQueries = ScopeMediaQueries,
> {
  /** Whether the scope is ready */
  isReady: boolean;

  /** Current media query match states */
  matches: ScopeMediaMatches<T>;

  /** Registered methods from the scope */
  methods: ScopeMethods;

  /** The underlying Anime.js scope instance */
  scope: AnimeJsScope<T> | null;

  /** Add a constructor to the scope */
  add: (
    constructor: (self: ScopeSelf<T>) => ScopeCleanupFunction | void,
  ) => void;

  /** Add a constructor that only runs once */
  addOnce: (
    constructor: (self: ScopeSelf<T>) => ScopeCleanupFunction | void,
  ) => void;

  /** Revert all animations in the scope */
  revert: () => void;

  /** Refresh the scope (re-run constructors) */
  refresh: () => void;

  /** Preserve current time when refreshing */
  keepTime: () => void;

  /** Get the root DOM element */
  getElement: () => HTMLElement | null;
}

// =============================================================================
// AnimeScope Component
// =============================================================================

function AnimeScopeInner<T extends ScopeMediaQueries = ScopeMediaQueries>(
  {
    children,
    as: Component = "div",
    enabled = true,
    mediaQueries,
    defaults,
    animate: animateProp,
    animateOnce,
    deps = [],
    onReady,
    onMediaChange,
    onRevert,
    onRefresh,
    className,
    style,
    ...rest
  }: AnimeScopeProps<T>,
  forwardedRef: React.ForwardedRef<AnimeScopeRef<T>>,
) {
  const readyNotifiedRef = useRef(false);

  // Use the scope hook
  const {
    ref: rootRef,
    scope,
    matches,
    methods,
    isReady,
    add,
    addOnce,
    revert,
    refresh,
    keepTime,
  } = useCreateScope<T>({
    mediaQueries,
    defaults,
    enabled,
    deps,
    onMediaChange,
    onRevert,
    onRefresh,
  });

  // Get element helper
  const getElement = () => rootRef.current;

  // Build ref value
  const refValue: AnimeScopeRef<T> = useMemo(
    () => ({
      isReady,
      matches,
      methods,
      scope,
      add,
      addOnce,
      revert,
      refresh,
      keepTime,
      getElement,
    }),
    [isReady, matches, methods, scope, add, addOnce, revert, refresh, keepTime],
  );

  // Expose ref
  useImperativeHandle(forwardedRef, () => refValue, [refValue]);

  // Stable ref for animate prop to avoid unnecessary re-runs
  const animatePropRef = useRef(animateProp);
  animatePropRef.current = animateProp;

  const animateOnceRef = useRef(animateOnce);
  animateOnceRef.current = animateOnce;

  /**
   * Wraps user's callback to enhance scope self with animate and utils
   */
  const wrapCallback = (callback: AnimeScopeAnimateFn<T>) => {
    return (self: ScopeSelf<T>) => {
      const enhancedContext: AnimeScopeContext<T> = {
        ...self,
        animate,
        utils,
      };
      return callback(enhancedContext);
    };
  };

  // Handle one-time animation
  useEffect(() => {
    if (!isReady || !animateOnceRef.current) return;
    addOnce(wrapCallback(animateOnceRef.current));
  }, [isReady, addOnce]);

  // Handle animate prop
  useEffect(() => {
    if (!isReady || !animatePropRef.current) return;
    revert();
    add(wrapCallback(animatePropRef.current));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, add, revert, ...deps]);

  // Notify when ready
  useEffect(() => {
    if (isReady && onReady && !readyNotifiedRef.current) {
      onReady(refValue);
      readyNotifiedRef.current = true;
    }
  }, [isReady, onReady, refValue]);

  // Reset ready notification when disabled
  useEffect(() => {
    if (!enabled) {
      readyNotifiedRef.current = false;
    }
  }, [enabled]);

  // --------------------------------------------------------------------------
  // Provider logic for children hooks (useAnime, etc.)
  // --------------------------------------------------------------------------

  // Register cleanup helper for children hooks
  const cleanupFunctions = useRef<Set<() => void>>(new Set());
  const registerCleanup = (cleanup: () => void) => {
    cleanupFunctions.current.add(cleanup);
    return () => cleanupFunctions.current.delete(cleanup);
  };

  // Run child cleanups when scope changes or unmounts
  useEffect(() => {
    return () => {
      cleanupFunctions.current.forEach((fn) => fn());
      cleanupFunctions.current.clear();
    };
  }, [isReady]);

  // Build context value for children hooks
  const contextValue = useMemo<ContextType>(
    () => ({
      scope,
      rootRef: rootRef as React.RefObject<HTMLElement | null>,
      isScoped: true,
      registerCleanup,
      matches: matches as any,
    }),
    [scope, rootRef, matches],
  );

  const Element = Component as React.ElementType;

  return (
    <ScopeContext.Provider value={contextValue}>
      <Element ref={rootRef} className={className} style={style} {...rest}>
        {typeof children === "function"
          ? (children as (matches: ScopeMediaMatches<T>) => ReactNode)(matches)
          : children}
      </Element>
    </ScopeContext.Provider>
  );
}

// Export with proper typing for generics
export const AnimeScope = forwardRef(AnimeScopeInner) as <
  T extends ScopeMediaQueries = ScopeMediaQueries,
>(
  props: AnimeScopeProps<T> & { ref?: React.Ref<AnimeScopeRef<T>> },
) => React.ReactElement | null;

(AnimeScope as React.FC).displayName = "AnimeScope";

export default AnimeScope;
