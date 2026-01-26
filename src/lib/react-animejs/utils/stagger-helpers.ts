/**
 * Stagger Helpers - Utilities for creating stagger patterns
 *
 * Provides convenient functions for common stagger configurations.
 */

import { stagger } from "animejs";
import type { StaggerOptions } from "../types";

// Type assertion helper for anime.js stagger function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const animeStagger = stagger as (value: any, options?: any) => any;

// =============================================================================
// Basic Stagger Helpers
// =============================================================================

/**
 * Create a simple stagger delay
 *
 * @param delay - Delay between each element in ms
 * @returns Stagger configuration
 *
 * @example
 * ```tsx
 * const { ref } = useAnime({
 *   translateY: [20, 0],
 *   delay: simpleStagger(100),
 * });
 * ```
 */
export function simpleStagger(delay: number) {
  return animeStagger(delay);
}

/**
 * Create a stagger from the center outward
 *
 * @param delay - Delay between each element
 * @returns Stagger configuration
 */
export function staggerFromCenter(delay: number) {
  return animeStagger(delay, { from: "center" });
}

/**
 * Create a stagger from the last element
 *
 * @param delay - Delay between each element
 * @returns Stagger configuration
 */
export function staggerFromLast(delay: number) {
  return animeStagger(delay, { from: "last" });
}

/**
 * Create a stagger from the edges inward
 *
 * @param delay - Delay between each element
 * @returns Stagger configuration
 */
export function staggerFromEdges(delay: number) {
  return animeStagger(delay, { from: "edges" });
}

/**
 * Create a stagger from a specific index
 *
 * @param delay - Delay between each element
 * @param index - Starting index
 * @returns Stagger configuration
 */
export function staggerFromIndex(delay: number, index: number) {
  return animeStagger(delay, { from: index });
}

// =============================================================================
// Grid Stagger Helpers
// =============================================================================

/**
 * Create a grid-based stagger
 *
 * @param delay - Delay between each element
 * @param columns - Number of columns in the grid
 * @param rows - Number of rows in the grid
 * @returns Stagger configuration
 *
 * @example
 * ```tsx
 * // 4x3 grid with diagonal stagger
 * const { ref } = useAnime({
 *   scale: [0, 1],
 *   delay: gridStagger(50, 4, 3),
 * });
 * ```
 */
export function gridStagger(delay: number, columns: number, rows: number) {
  return animeStagger(delay, { grid: [columns, rows] });
}

/**
 * Create a grid stagger along the X axis
 *
 * @param delay - Delay between each element
 * @param columns - Number of columns
 * @param rows - Number of rows
 * @returns Stagger configuration
 */
export function gridStaggerX(delay: number, columns: number, rows: number) {
  return animeStagger(delay, { grid: [columns, rows], axis: "x" });
}

/**
 * Create a grid stagger along the Y axis
 *
 * @param delay - Delay between each element
 * @param columns - Number of columns
 * @param rows - Number of rows
 * @returns Stagger configuration
 */
export function gridStaggerY(delay: number, columns: number, rows: number) {
  return animeStagger(delay, { grid: [columns, rows], axis: "y" });
}

/**
 * Create a ripple/wave effect from center
 *
 * @param delay - Delay between each element
 * @param columns - Number of columns
 * @param rows - Number of rows
 * @returns Stagger configuration
 */
export function rippleStagger(delay: number, columns: number, rows: number) {
  return animeStagger(delay, {
    grid: [columns, rows],
    from: "center",
  });
}

// =============================================================================
// Eased Stagger Helpers
// =============================================================================

/**
 * Create a stagger with easing
 *
 * @param delay - Total delay range
 * @param easing - Easing function name
 * @returns Stagger configuration
 *
 * @example
 * ```tsx
 * // Eased stagger for smooth animation build-up
 * const { ref } = useAnime({
 *   translateY: [50, 0],
 *   delay: easedStagger(500, 'outQuad'),
 * });
 * ```
 */
export function easedStagger(delay: number, easing: string) {
  return animeStagger(delay, { easing });
}

/**
 * Create a stagger with in-out easing (slow start and end)
 *
 * @param delay - Total delay range
 * @returns Stagger configuration
 */
export function inOutStagger(delay: number) {
  return animeStagger(delay, { easing: "inOutQuad" });
}

/**
 * Create a stagger with out easing (fast start, slow end)
 *
 * @param delay - Total delay range
 * @returns Stagger configuration
 */
export function outStagger(delay: number) {
  return animeStagger(delay, { easing: "outQuad" });
}

// =============================================================================
// Random Stagger
// =============================================================================

/**
 * Create a random stagger within a range
 *
 * @param min - Minimum delay
 * @param max - Maximum delay
 * @returns Stagger configuration
 */
export function randomStagger(min: number, max: number) {
  return animeStagger([min, max]);
}

// =============================================================================
// Stagger Preset Factory
// =============================================================================

/**
 * Create a custom stagger configuration
 *
 * @param delay - Delay value or range
 * @param options - Additional stagger options
 * @returns Stagger configuration
 */
export function createStagger(
  delay: number | [number, number],
  options?: StaggerOptions,
) {
  return animeStagger(delay, options);
}

// =============================================================================
// Re-export stagger from anime.js
// =============================================================================

export { stagger };
