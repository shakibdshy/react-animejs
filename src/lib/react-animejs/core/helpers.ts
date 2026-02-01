/**
 * Utility helper functions for React Anime.js
 */

import type { RefObject } from "react";
import type { AnimationTarget, AnimationState } from "../types";
import { RESERVED_KEYS } from "./constants";

// =============================================================================
// Target Resolution
// =============================================================================

/**
 * Resolve animation target to actual DOM element(s)
 */
export function resolveTarget(
  target: AnimationTarget,
  rootElement?: HTMLElement | null,
): HTMLElement | SVGElement | NodeList | (HTMLElement | SVGElement)[] | null {
  if (!target) return null;

  // Array of targets
  if (Array.isArray(target)) {
    return target
      .map((t) => resolveTarget(t as AnimationTarget, rootElement))
      .filter(Boolean)
      .flat() as (HTMLElement | SVGElement)[];
  }

  // String selector
  if (typeof target === "string") {
    const root = rootElement || document;
    return root.querySelectorAll(target) as unknown as (
      | HTMLElement
      | SVGElement
    )[];
  }

  // Ref object
  if (isRef(target)) {
    return target.current;
  }

  // Direct element or NodeList
  return target as HTMLElement | SVGElement | NodeList;
}

/**
 * Check if a value is a React ref
 */
export function isRef(
  value: unknown,
): value is RefObject<HTMLElement | SVGElement | null> {
  return value !== null && typeof value === "object" && "current" in value;
}

// =============================================================================
// Options Parsing
// =============================================================================

/**
 * Separate animatable properties from options
 */
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

// =============================================================================
// State Extraction
// =============================================================================

/**
 * Extract animation state from an anime.js instance
 */
export function extractAnimationState(instance: unknown): AnimationState {
  if (!instance || typeof instance !== "object") {
    return {
      id: "",
      progress: 0,
      currentTime: 0,
      duration: 0,
      paused: true,
      began: false,
      completed: false,
      reversed: false,
      currentIteration: 0,
      deltaTime: 0,
      iterationCurrentTime: 0,
      iterationProgress: 0,
      speed: 1,
      fps: 0,
      backwards: false,
    };
  }

  const anim = instance as Record<string, unknown>;

  return {
    id: (anim.id as string) || "",
    progress: (anim.progress as number) || 0,
    currentTime: (anim.currentTime as number) || 0,
    duration: (anim.duration as number) || 0,
    paused: (anim.paused as boolean) ?? true,
    began: (anim.began as boolean) ?? false,
    completed: (anim.completed as boolean) ?? false,
    reversed: (anim.reversed as boolean) ?? false,
    currentIteration:
      ((anim.iteration as number) ?? (anim._currentIteration as number)) || 0,
    deltaTime: (anim.deltaTime as number) || 0,
    iterationCurrentTime: (anim.iterationCurrentTime as number) || 0,
    iterationProgress: (anim.iterationProgress as number) || 0,
    speed: (anim.speed as number) || 1,
    fps: (anim.fps as number) || 0,
    backwards: (anim.backwards as boolean) ?? false,
    labels: anim.labels as Record<string, number>,
  };
}

// =============================================================================
// Callbacks
// =============================================================================

/**
 * Create a safe callback wrapper that catches errors
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSafeCallback<T extends (...args: any[]) => void>(
  callback: T | undefined,
  name: string,
): T | undefined {
  if (!callback) return undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((...args: any[]) => {
    try {
      callback(...args);
    } catch (error) {
      console.error(`[react-animejs] Error in ${name} callback:`, error);
    }
  }) as T;
}

// =============================================================================
// Ref Utilities
// =============================================================================

/**
 * Merge multiple refs into one
 */
export function mergeRefs<T>(
  ...refs: (RefObject<T> | ((instance: T | null) => void) | null | undefined)[]
): (instance: T | null) => void {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        (ref as { current: T | null }).current = instance;
      }
    });
  };
}

// =============================================================================
// Comparison Utilities
// =============================================================================

/**
 * Shallow compare two dependency arrays
 */
export function depsChanged(
  prev: unknown[] | undefined,
  next: unknown[] | undefined,
): boolean {
  if (prev === next) return false;
  if (!prev || !next) return true;
  if (prev.length !== next.length) return true;

  for (let i = 0; i < prev.length; i++) {
    if (!Object.is(prev[i], next[i])) return true;
  }

  return false;
}

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Check if value is a plain object
 */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

/**
 * Check if value is a function
 */
export function isFunction(
  value: unknown,
): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}

// =============================================================================
// JSON Utilities
// =============================================================================

/**
 * Safely stringify an object for dependency tracking
 * Handles circular references and avoids stringifying DOM nodes/refs
 */
export function safeJsonStringify(obj: unknown): string {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) return "[Circular]";

      // Handle DOM nodes
      if (typeof window !== "undefined" && value instanceof Node) {
        return `[DOM Node: ${value.nodeName}]`;
      }

      // Handle React refs
      if (
        value &&
        typeof value === "object" &&
        Object.prototype.hasOwnProperty.call(value, "current")
      ) {
        return {
          __type: "Ref",
          current: (value as { current: unknown }).current,
        };
      }

      // Handle functions
      if (typeof value === "function") {
        return "[Function]";
      }

      // Avoid React internals that might be attached to objects
      if (key.startsWith("__react") || key.startsWith("fiber")) {
        return undefined;
      }

      cache.add(value);
    }
    return value;
  });
}

// =============================================================================
// Stagger Helpers
// =============================================================================

/**
 * Create stagger value (re-export from anime.js with type safety)
 */
import { stagger, waapi } from "animejs";
export { stagger };
export const convertEase = waapi.convertEase;
