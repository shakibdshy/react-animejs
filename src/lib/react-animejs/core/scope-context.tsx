/**
 * Anime.js Scope Context for React
 *
 * Provides scoped animation management using React Context.
 * All animations created within an AnimeProvider are automatically
 * scoped and cleaned up when the provider unmounts.
 */

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type RefObject,
} from "react";
import React from "react";
import { createScope } from "animejs";
import type {
  AnimeScopeContext,
  AnimeProviderProps,
  AnimeScope,
} from "../types";

// =============================================================================
// Context
// =============================================================================

/**
 * Default context value (no scope)
 */
const defaultContextValue: AnimeScopeContext = {
  scope: null,
  rootRef: { current: null },
  isScoped: false,
  registerCleanup: () => {},
};

/**
 * React Context for anime scope
 */
const ScopeContext = createContext<AnimeScopeContext>(defaultContextValue);

// =============================================================================
// Provider Component
// =============================================================================

/**
 * AnimeProvider - Provides scoped animation context
 *
 * All animations created by hooks inside this provider will be:
 * 1. Scoped to the root element (CSS selectors only match within this tree)
 * 2. Automatically cleaned up when the provider unmounts
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AnimeProvider>
 *       <MyAnimatedComponent />
 *     </AnimeProvider>
 *   );
 * }
 * ```
 */
export function AnimeProvider({
  children,
  rootRef: externalRootRef,
  asWrapper = true,
  wrapperProps = {},
}: AnimeProviderProps) {
  // Internal ref for wrapper element
  const internalRootRef = useRef<HTMLElement>(null);

  // Use external ref if provided, otherwise use internal
  const rootRef = externalRootRef || internalRootRef;

  // Store the scope instance
  const scopeRef = useRef<AnimeScope | null>(null);

  // Store cleanup functions registered by child hooks
  const cleanupFunctions = useRef<Set<() => void>>(new Set());

  /**
   * Register a cleanup function to be called on unmount
   */
  const registerCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.add(cleanup);

    // Return unregister function
    return () => {
      cleanupFunctions.current.delete(cleanup);
    };
  }, []);

  /**
   * Initialize scope on mount
   */
  useEffect(() => {
    if (!rootRef.current) return;

    // Create the anime.js scope
    scopeRef.current = createScope({ root: rootRef }) as unknown as AnimeScope;

    // Cleanup on unmount
    return () => {
      // Call all registered cleanup functions
      cleanupFunctions.current.forEach((cleanup) => {
        try {
          cleanup();
        } catch (error) {
          console.warn("[react-animejs] Cleanup error:", error);
        }
      });
      cleanupFunctions.current.clear();

      // Revert the scope (cleanup all anime.js instances)
      if (scopeRef.current) {
        try {
          scopeRef.current.revert();
        } catch (error) {
          console.warn("[react-animejs] Scope revert error:", error);
        }
        scopeRef.current = null;
      }
    };
  }, [rootRef]);

  /**
   * Context value - memoized to prevent unnecessary re-renders
   */
  const contextValue = useMemo<AnimeScopeContext>(
    () => ({
      scope: scopeRef.current,
      rootRef: rootRef as RefObject<HTMLElement | null>,
      isScoped: true,
      registerCleanup,
    }),
    [rootRef, registerCleanup],
  );

  // If using external ref (no wrapper needed)
  if (!asWrapper || externalRootRef) {
    return (
      <ScopeContext.Provider value={contextValue}>
        {children}
      </ScopeContext.Provider>
    );
  }

  // Render with wrapper element - always use div for type safety
  return (
    <ScopeContext.Provider value={contextValue}>
      <div
        ref={internalRootRef as RefObject<HTMLDivElement>}
        {...(wrapperProps as React.HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    </ScopeContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Hook to access the anime scope context
 *
 * @returns The current scope context
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { scope, isScoped } = useAnimeScope();
 *
 *   useEffect(() => {
 *     if (scope) {
 *       // Use scope directly for advanced cases
 *     }
 *   }, [scope]);
 * }
 * ```
 */
export function useAnimeScope(): AnimeScopeContext {
  return useContext(ScopeContext);
}

/**
 * Hook to get the root ref from the scope context
 * Useful when you need to reference the scoped root element
 */
export function useScopedRoot(): RefObject<HTMLElement | null> {
  const { rootRef } = useContext(ScopeContext);
  return rootRef;
}
