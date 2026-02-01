import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  RefObject,
} from "react";
import { createAnimatable } from "animejs";
import type {
  AnimationTargets,
  Easing,
  JSAnimation,
  AnimationTarget,
} from "../types";
import { useAnimeScope, resolveTarget } from "../core";

// =============================================================================
// Types
// =============================================================================

/**
 * Property-specific settings for animatable
 */
export interface AnimatablePropertySettings {
  /** Unit for the property value (e.g., 'px', 'rem', '%') */
  unit?: string;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Easing function */
  ease?: Easing;
  /** Value modifier function */
  modifier?: (value: number) => number;
}

/**
 * Configuration for createAnimatable
 * Properties can be a number (duration) or detailed settings
 */
export interface AnimatableConfig {
  /** Global easing for all properties */
  ease?: Easing;
  /** Global duration for all properties */
  duration?: number;
  /** Property configurations - number for duration, or detailed settings */
  [property: string]: number | AnimatablePropertySettings | Easing | any;
}

/**
 * Property setter function with optional overrides
 */
export type AnimatablePropertySetter = {
  (value: number | number[]): void;
  (value: number | number[], duration: number): void;
  (value: number | number[], duration: number, ease: Easing): void;
};

/**
 * Property getter/setter function
 * Call with no args to get current value, with args to animate
 */
export type AnimatablePropertyFunction = AnimatablePropertySetter & {
  (): number;
};

/**
 * The animatable instance with dynamic property methods
 */
export interface AnimatableInstance {
  /** Access property methods dynamically */
  [property: string]:
    | AnimatablePropertyFunction
    | (() => void)
    | unknown[]
    | Record<string, unknown>;
  /** Reverts all applied styles */
  revert: () => void;
  /** Array of target elements */
  targets: AnimationTarget[];
  /** Object containing animation instances per property */
  animations: Record<string, JSAnimation>;
}

/**
 * Return type for useAnimatable hook
 */
export interface UseAnimatableReturn<
  T extends HTMLElement | SVGElement = HTMLElement,
> {
  /** Ref to attach to the target element */
  ref: React.RefObject<T | null>;
  /** The animatable instance - null until ready */
  animatable: AnimatableInstance | null;
  /** Whether the animatable is initialized and ready */
  isReady: boolean;
  /** Cleanup function to revert all applied styles */
  revert: () => void;
}

// =============================================================================
// useAnimatable Hook
// =============================================================================

/**
 * useAnimatable - Reactive wrapper for Anime.js createAnimatable
 *
 * Creates animatable property functions that efficiently animate values
 * when called. Ideal for cursor events, scroll, or animation loops.
 *
 * @example
 * ```tsx
 * const { ref, animatable } = useAnimatable({
 *   x: 500,
 *   y: 500,
 * });
 *
 * // Animate efficiently in handlers
 * useAnimatableEvent(containerRef, "mousemove", (e) => {
 *   animatable?.x(e.clientX);
 * });
 * ```
 */
export function useAnimatable<T extends HTMLElement | SVGElement = HTMLElement>(
  config: AnimatableConfig,
  externalTargets?: AnimationTargets,
): UseAnimatableReturn<T> {
  const internalRef = useRef<T | null>(null);
  const animatableRef = useRef<AnimatableInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const scopeContext = useAnimeScope();

  const configKey = useMemo(() => {
    try {
      return JSON.stringify(config);
    } catch {
      return config;
    }
  }, [config]);

  const revert = useCallback(() => {
    animatableRef.current?.revert();
  }, []);

  useEffect(() => {
    const targets = externalTargets ?? internalRef.current;

    // Resolve target using the same logic as the rest of the library (scoped or global)
    const resolvedTargets = resolveTarget(
      targets,
      scopeContext.rootRef.current,
    );

    if (!resolvedTargets) {
      setIsReady(false);
      return;
    }

    try {
      const instance = createAnimatable(resolvedTargets as any, config as any);
      animatableRef.current = instance as unknown as AnimatableInstance;
      setIsReady(true);
    } catch (error) {
      console.error("[react-animejs] useAnimatable error:", error);
      setIsReady(false);
    }

    return () => {
      animatableRef.current?.revert();
      animatableRef.current = null;
      setIsReady(false);
    };
  }, [configKey, externalTargets, scopeContext.rootRef]);

  return {
    ref: internalRef,
    animatable: animatableRef.current,
    isReady,
    revert,
  };
}

// =============================================================================
// useAnimatableEvent Helper Hook
// =============================================================================

/**
 * useAnimatableEvent - Helper for binding high-performance event listeners
 *
 * Attaches a native event listener to the target element (via ref) that
 * runs outside the React render cycle, preserving performance for high-frequency
 * events like 'mousemove', 'scroll', or 'resize'.
 *
 * @example
 * ```tsx
 * const containerRef = useRef(null);
 *
 * useAnimatableEvent(containerRef, "mousemove", (e) => {
 *   // Math here is efficient
 *   animatable?.x(e.clientX);
 * });
 * ```
 */
export function useAnimatableEvent<K extends keyof HTMLElementEventMap>(
  targetRef: RefObject<HTMLElement | null | undefined> | Window | Document,
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  // Use a stable handler ref to avoid re-binding the event listener when the handler function changes
  const handlerRef = useRef(handler);

  // Always keep the handler fresh without re-running effects
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const target =
      targetRef && "current" in targetRef ? targetRef.current : targetRef;

    if (!target || !target.addEventListener) return;

    // Create a stable callback that calls the current handler
    const eventListener = (event: Event) => {
      return handlerRef.current(event as HTMLElementEventMap[K]);
    };

    target.addEventListener(eventName, eventListener, options);

    return () => {
      target.removeEventListener(eventName, eventListener, options);
    };
  }, [targetRef, eventName, options]);
}
