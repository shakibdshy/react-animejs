/**
 * Animation Presets - Ready-to-use animation configurations
 *
 * Common animation patterns that can be used directly with useAnime or <Animate>
 */

import type { UseAnimeOptions } from "../types";

// =============================================================================
// Fade Animations
// =============================================================================

/**
 * Fade in animation
 */
export const fadeIn: Partial<UseAnimeOptions> = {
  opacity: [0, 1],
  duration: 400,
  ease: "outQuad",
};

/**
 * Fade out animation
 */
export const fadeOut: Partial<UseAnimeOptions> = {
  opacity: [1, 0],
  duration: 400,
  ease: "outQuad",
};

/**
 * Fade in and up
 */
export const fadeInUp: Partial<UseAnimeOptions> = {
  opacity: [0, 1],
  translateY: [20, 0],
  duration: 500,
  ease: "outQuad",
};

/**
 * Fade in and down
 */
export const fadeInDown: Partial<UseAnimeOptions> = {
  opacity: [0, 1],
  translateY: [-20, 0],
  duration: 500,
  ease: "outQuad",
};

/**
 * Fade in from left
 */
export const fadeInLeft: Partial<UseAnimeOptions> = {
  opacity: [0, 1],
  translateX: [-20, 0],
  duration: 500,
  ease: "outQuad",
};

/**
 * Fade in from right
 */
export const fadeInRight: Partial<UseAnimeOptions> = {
  opacity: [0, 1],
  translateX: [20, 0],
  duration: 500,
  ease: "outQuad",
};

// =============================================================================
// Scale Animations
// =============================================================================

/**
 * Scale in (zoom in)
 */
export const scaleIn: Partial<UseAnimeOptions> = {
  scale: [0, 1],
  opacity: [0, 1],
  duration: 400,
  ease: "outBack",
};

/**
 * Scale out (zoom out)
 */
export const scaleOut: Partial<UseAnimeOptions> = {
  scale: [1, 0],
  opacity: [1, 0],
  duration: 300,
  ease: "inQuad",
};

/**
 * Pop in with bounce
 */
export const popIn: Partial<UseAnimeOptions> = {
  scale: [0.8, 1],
  opacity: [0, 1],
  duration: 400,
  ease: "outBack",
};

// =============================================================================
// Slide Animations
// =============================================================================

/**
 * Slide in from top
 */
export const slideInTop: Partial<UseAnimeOptions> = {
  translateY: ["-100%", 0],
  opacity: [0, 1],
  duration: 500,
  ease: "outQuint",
};

/**
 * Slide in from bottom
 */
export const slideInBottom: Partial<UseAnimeOptions> = {
  translateY: ["100%", 0],
  opacity: [0, 1],
  duration: 500,
  ease: "outQuint",
};

/**
 * Slide in from left
 */
export const slideInLeft: Partial<UseAnimeOptions> = {
  translateX: ["-100%", 0],
  opacity: [0, 1],
  duration: 500,
  ease: "outQuint",
};

/**
 * Slide in from right
 */
export const slideInRight: Partial<UseAnimeOptions> = {
  translateX: ["100%", 0],
  opacity: [0, 1],
  duration: 500,
  ease: "outQuint",
};

// =============================================================================
// Attention Animations
// =============================================================================

/**
 * Pulse animation (looping)
 */
export const pulse: Partial<UseAnimeOptions> = {
  scale: [1, 1.05, 1],
  duration: 600,
  loop: true,
  ease: "inOutSine",
};

/**
 * Bounce animation
 */
export const bounce: Partial<UseAnimeOptions> = {
  translateY: [0, -20, 0],
  duration: 600,
  ease: "outBounce",
};

/**
 * Shake animation (horizontal)
 */
export const shake: Partial<UseAnimeOptions> = {
  translateX: [0, -10, 10, -10, 10, 0],
  duration: 500,
  ease: "outQuad",
};

/**
 * Wiggle animation (rotation)
 */
export const wiggle: Partial<UseAnimeOptions> = {
  rotate: [0, -5, 5, -5, 5, 0],
  duration: 500,
  ease: "outQuad",
};

/**
 * Heartbeat animation
 */
export const heartbeat: Partial<UseAnimeOptions> = {
  scale: [1, 1.15, 1, 1.1, 1],
  duration: 800,
  loop: true,
  ease: "inOutSine",
};

// =============================================================================
// Special Animations
// =============================================================================

/**
 * Flip in X (rotate in from top)
 */
export const flipInX: Partial<UseAnimeOptions> = {
  rotateX: [90, 0],
  opacity: [0, 1],
  duration: 600,
  ease: "outQuad",
};

/**
 * Flip in Y (rotate in from left)
 */
export const flipInY: Partial<UseAnimeOptions> = {
  rotateY: [90, 0],
  opacity: [0, 1],
  duration: 600,
  ease: "outQuad",
};

/**
 * Rotate in
 */
export const rotateIn: Partial<UseAnimeOptions> = {
  rotate: [-180, 0],
  opacity: [0, 1],
  duration: 600,
  ease: "outQuad",
};

/**
 * Spin animation (continuous rotation)
 */
export const spin: Partial<UseAnimeOptions> = {
  rotate: [0, 360],
  duration: 1000,
  loop: true,
  ease: "linear",
};

// =============================================================================
// Preset Map
// =============================================================================

/**
 * All presets as a map for dynamic access
 */
export const presets = {
  // Fade
  fadeIn,
  fadeOut,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,

  // Scale
  scaleIn,
  scaleOut,
  popIn,

  // Slide
  slideInTop,
  slideInBottom,
  slideInLeft,
  slideInRight,

  // Attention
  pulse,
  bounce,
  shake,
  wiggle,
  heartbeat,

  // Special
  flipInX,
  flipInY,
  rotateIn,
  spin,
} as const;

export type PresetName = keyof typeof presets;

/**
 * Get a preset by name
 */
export function getPreset(name: PresetName): Partial<UseAnimeOptions> {
  return presets[name];
}
