/**
 * Constants and default values for React Anime.js
 */

import type { PlaybackSettings, AnimationState } from "../types";

// =============================================================================
// Default Values
// =============================================================================

/**
 * Default playback settings
 * Note: autoplay defaults to false in React (unlike vanilla anime.js)
 * to give developers explicit control over when animations start
 */
export const DEFAULT_PLAYBACK_SETTINGS: Required<PlaybackSettings> = {
  delay: 0,
  duration: 1000,
  loop: false,
  loopDelay: 0,
  alternate: false,
  reversed: false,
  autoplay: false, // React default: false for better control
  frameRate: null as unknown as number,
  playbackRate: 1,
  playbackEase: null as unknown as any,
  persist: false,
};

/**
 * Default animation state
 */
export const DEFAULT_ANIMATION_STATE: AnimationState = {
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

// =============================================================================
// Property Keys
// =============================================================================

/**
 * Playback setting keys (to separate from animatable properties)
 */
export const PLAYBACK_SETTING_KEYS = [
  "delay",
  "duration",
  "loop",
  "loopDelay",
  "alternate",
  "reversed",
  "autoplay",
  "frameRate",
  "playbackRate",
  "playbackEase",
  "persist",
] as const;

/**
 * Callback keys
 */
export const CALLBACK_KEYS = [
  "onBegin",
  "onComplete",
  "onUpdate",
  "onRender",
  "onBeforeUpdate",
  "onLoop",
  "onPause",
] as const;

/**
 * Tween parameter keys
 */
export const TWEEN_PARAM_KEYS = [
  "ease",
  "round",
  "modifier",
  "composition",
] as const;

/**
 * Hook-specific option keys (not passed to anime.js)
 */
export const HOOK_OPTION_KEYS = [
  "selector",
  "targets",
  "stagger",
  "keyframes",
  "deps",
  "enabled",
  "controller",
] as const;

/**
 * Transform property keys
 */
export const TRANSFORM_KEYS = [
  "translateX",
  "translateY",
  "translateZ",
  "translate",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "skew",
  "skewX",
  "skewY",
  "perspective",
] as const;

/**
 * All reserved keys that shouldn't be treated as animatable properties
 */
export const RESERVED_KEYS = new Set([
  ...PLAYBACK_SETTING_KEYS,
  ...CALLBACK_KEYS,
  ...TWEEN_PARAM_KEYS,
  ...HOOK_OPTION_KEYS,
]);

// =============================================================================
// Utility Constants
// =============================================================================

/**
 * Regex for CSS custom properties
 */
export const CSS_CUSTOM_PROPERTY_REGEX = /^--/;

/**
 * Regex for percentage values
 */
export const PERCENTAGE_REGEX = /^[\d.]+%$/;

/**
 * Regex for relative offset values (+=, -=)
 */
export const RELATIVE_OFFSET_REGEX = /^[+-]=/;
