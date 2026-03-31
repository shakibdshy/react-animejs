/**
 * useAnimeScope - Scope management hook for React
 *
 * Provides React-friendly access to Anime.js Scope functionality:
 * - Media query reactivity
 * - Custom root elements
 * - Shared default parameters
 * - Batch cleanup/revert
 *
 * @see https://animejs.com/documentation/scope
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createScope } from "animejs";
import type {
  AnimeJsScope,
  ScopeConstructorFunction,
  ScopeMediaMatches,
  ScopeMediaQueries,
  ScopeMethods,
  UseAnimeScopeOptions,
  UseAnimeScopeReturn,
} from "../types/scope";
import { safeJsonStringify } from "../core";

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Create empty matches object for media queries
 */
function createEmptyMatches<T extends ScopeMediaQueries>(
  mediaQueries: T | undefined,
): ScopeMediaMatches<T> {
  if (!mediaQueries) return {} as ScopeMediaMatches<T>;

  const matches = {} as ScopeMediaMatches<T>;
  for (const key of Object.keys(mediaQueries)) {
    (matches as Record<string, boolean>)[key] = false;
  }
  return matches;
}

/**
 * Extract matches from scope instance
 */
function extractMatches<T extends ScopeMediaQueries>(
  scope: AnimeJsScope<T> | null,
  mediaQueries: T | undefined,
): ScopeMediaMatches<T> {
  if (!scope || !mediaQueries) return createEmptyMatches(mediaQueries);
  return (scope.matches ||
    createEmptyMatches(mediaQueries)) as ScopeMediaMatches<T>;
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useAnimeScope - Create and manage an Anime.js Scope
 *
 * Scopes allow animations to:
 * - React to media query changes (auto-refresh when viewport changes)
 * - Use custom root elements (CSS selectors scoped to root)
 * - Share default parameters (ease, duration, etc.)
 * - Be reverted in batch (cleanup all animations at once)
 *
 * @param options - Scope configuration options
 * @returns Object containing ref, scope instance, matches, and controls
 *
 * @example Basic usage with media queries
 * ```tsx
 * function ResponsiveAnimation() {
 *   const { ref, matches, add } = useAnimeScope({
 *     mediaQueries: {
 *       isMobile: '(max-width: 640px)',
 *       isDesktop: '(min-width: 1024px)',
 *       reduceMotion: '(prefers-reduced-motion)',
 *     },
 *   });
 *
 *   useEffect(() => {
 *     add((self) => {
 *       const { isMobile, reduceMotion } = self.matches;
 *
 *       animate('.box', {
 *         x: isMobile ? 0 : 200,
 *         duration: reduceMotion ? 0 : 1000,
 *         loop: true,
 *         alternate: true,
 *       });
 *
 *       // Optional cleanup
 *       return () => {
 *         console.log('Scope reverted or media changed');
 *       };
 *     });
 *   }, [add]);
 *
 *   return (
 *     <div ref={ref}>
 *       <div className="box">Responsive Animation</div>
 *       <p>Is Mobile: {matches.isMobile ? 'Yes' : 'No'}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With shared defaults
 * ```tsx
 * function SharedDefaults() {
 *   const { ref, add } = useAnimeScope({
 *     defaults: {
 *       ease: 'outExpo',
 *       duration: 800,
 *     },
 *   });
 *
 *   useEffect(() => {
 *     add(() => {
 *       // All animations inherit ease: 'outExpo', duration: 800
 *       animate('.item-1', { x: 100 });
 *       animate('.item-2', { y: 100 });
 *       animate('.item-3', { rotate: 180 });
 *     });
 *   }, [add]);
 *
 *   return <div ref={ref}>...</div>;
 * }
 * ```
 *
 * @example Registering methods
 * ```tsx
 * function MethodRegistration() {
 *   const { ref, methods, add } = useAnimeScope();
 *
 *   useEffect(() => {
 *     add((self) => {
 *       self.add('playAnimation', () => {
 *         animate('.box', { scale: 1.5, duration: 500 });
 *       });
 *
 *       self.add('stopAnimation', () => {
 *         // ... cleanup logic
 *       });
 *     });
 *   }, [add]);
 *
 *   return (
 *     <div ref={ref}>
 *       <button onClick={() => methods.playAnimation?.()}>Play</button>
 *       <button onClick={() => methods.stopAnimation?.()}>Stop</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnimeScope<T extends ScopeMediaQueries = ScopeMediaQueries>(
  options: UseAnimeScopeOptions<T> = {},
): UseAnimeScopeReturn<T> {
  // ==========================================================================
  // Refs
  // ==========================================================================

  // Root element ref
  const rootRef = useRef<HTMLElement | null>(null);

  // Scope instance ref
  const scopeRef = useRef<AnimeJsScope<T> | null>(null);

  // Constructors queue (for adding before scope is ready)
  const constructorsQueue = useRef<ScopeConstructorFunction<T>[]>([]);
  const onceConstructorsQueue = useRef<ScopeConstructorFunction<T>[]>([]);

  // ==========================================================================
  // State
  // ==========================================================================

  const [matches, setMatches] = useState<ScopeMediaMatches<T>>(() =>
    createEmptyMatches(options.mediaQueries),
  );
  const [isReady, setIsReady] = useState(false);
  const [methods, setMethods] = useState<ScopeMethods>({});

  // ==========================================================================
  // Extract Options
  // ==========================================================================

  const {
    root,
    defaults,
    mediaQueries,
    enabled = true,
    deps = [],
    onMediaChange,
    onRevert,
    onRefresh,
  } = options;

  // ==========================================================================
  // Stable Option Refs
  // ==========================================================================

  const onMediaChangeRef = useRef(onMediaChange);
  onMediaChangeRef.current = onMediaChange;

  const onRevertRef = useRef(onRevert);
  onRevertRef.current = onRevert;

  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  // ==========================================================================
  // Memoized Config
  // ==========================================================================

  const configJson = useMemo(
    () =>
      safeJsonStringify({
        defaults,
        mediaQueries,
      }),
    [defaults, mediaQueries],
  );

  // ==========================================================================
  // Scope Lifecycle
  // ==========================================================================

  useEffect(() => {
    if (!enabled) {
      setIsReady(false);
      return;
    }

    // Resolve root element
    let rootElement: HTMLElement | Document | string | undefined;

    if (root) {
      if (typeof root === "string") {
        rootElement = root;
      } else if ("current" in root) {
        rootElement = root.current || undefined;
      } else {
        rootElement = root;
      }
    } else if (rootRef.current) {
      rootElement = rootRef.current;
    }

    // Wait for root element if using ref
    if (!rootElement && !root) {
      // Check if rootRef exists but is not yet populated (component not mounted)
      const checkRoot = () => {
        if (rootRef.current) {
          // Root is now available, trigger re-run
          setIsReady(false);
          setTimeout(() => setIsReady(true), 0);
        }
      };

      // Use microtask to wait for mount
      queueMicrotask(checkRoot);
      return;
    }

    try {
      // Build scope config
       
      const scopeConfig: Record<string, any> = {};

      if (rootElement) {
        scopeConfig.root = rootElement;
      }

      if (defaults) {
        scopeConfig.defaults = defaults;
      }

      if (mediaQueries) {
        scopeConfig.mediaQueries = mediaQueries;
      }

      // Create the scope
      const scope = createScope(scopeConfig) as unknown as AnimeJsScope<T>;
      scopeRef.current = scope;

      // Update matches state
      const currentMatches = extractMatches(scope, mediaQueries);
      setMatches(currentMatches);

      // Process queued constructors
      constructorsQueue.current.forEach((constructor) => {
        scope.add(constructor);
      });
      constructorsQueue.current = [];

      onceConstructorsQueue.current.forEach((constructor) => {
        scope.addOnce(constructor);
      });
      onceConstructorsQueue.current = [];

      // Sync methods
      setMethods({ ...scope.methods });

      setIsReady(true);

      // Note: Anime.js handles media query changes internally
      // The scope's add() constructors are re-run automatically on media changes
    } catch (error) {
      console.error("[react-animejs] Scope creation error:", error);
      setIsReady(false);
    }

    // Cleanup
    return () => {
      if (scopeRef.current) {
        try {
          scopeRef.current.revert();
          onRevertRef.current?.();
        } catch (error) {
          console.warn("[react-animejs] Scope revert error:", error);
        }
        scopeRef.current = null;
      }
      setIsReady(false);
      setMethods({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, root, configJson, ...deps]);

  // ==========================================================================
  // Sync Matches State (for media query changes)
  // ==========================================================================

  // Use a ref to track previous matches to avoid stale closure
  const matchesRef = useRef(matches);
  matchesRef.current = matches;

  useEffect(() => {
    if (!isReady || !scopeRef.current || !mediaQueries) return;

    // Poll for matches changes (Anime.js doesn't expose a change callback)
    // This is a trade-off for React integration
    const intervalId = setInterval(() => {
      const scope = scopeRef.current;
      if (!scope) return;

      const currentMatches = extractMatches(scope, mediaQueries);
      const prevMatches = matchesRef.current;

      // Compare using JSON stringify for deep comparison
      if (JSON.stringify(currentMatches) !== JSON.stringify(prevMatches)) {
        setMatches(currentMatches);
        setMethods({ ...scope.methods });
        onMediaChangeRef.current?.(currentMatches);
      }
    }, 100); // Check every 100ms

    return () => {
      clearInterval(intervalId);
    };
  }, [isReady, mediaQueries]);

  // ==========================================================================
  // Controls
  // ==========================================================================

  const add = useCallback((constructor: ScopeConstructorFunction<T>) => {
    if (scopeRef.current) {
      scopeRef.current.add(constructor);
      setMethods({ ...scopeRef.current.methods });
    } else {
      // Queue for later
      constructorsQueue.current.push(constructor);
    }
  }, []);

  const addOnce = useCallback((constructor: ScopeConstructorFunction<T>) => {
    if (scopeRef.current) {
      scopeRef.current.addOnce(constructor);
      setMethods({ ...scopeRef.current.methods });
    } else {
      // Queue for later
      onceConstructorsQueue.current.push(constructor);
    }
  }, []);

  const revert = useCallback(() => {
    if (scopeRef.current) {
      scopeRef.current.revert();
      setMethods({});
      onRevertRef.current?.();
    }
  }, []);

  const refresh = useCallback(() => {
    if (scopeRef.current) {
      scopeRef.current.refresh();
      setMethods({ ...scopeRef.current.methods });
      onRefreshRef.current?.();
    }
  }, []);

  const keepTime = useCallback(() => {
    if (scopeRef.current) {
      scopeRef.current.keepTime();
    }
  }, []);

  // ==========================================================================
  // Return Value
  // ==========================================================================

  return {
    ref: rootRef,
    scope: scopeRef.current,
    matches,
    methods,
    isReady,
    add,
    addOnce,
    revert,
    refresh,
    keepTime,
  };
}

export default useAnimeScope;
