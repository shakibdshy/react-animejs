/**
 * Utils module exports
 */

// Presets
export {
  fadeIn,
  fadeOut,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleOut,
  popIn,
  slideInTop,
  slideInBottom,
  slideInLeft,
  slideInRight,
  pulse,
  bounce,
  shake,
  wiggle,
  heartbeat,
  flipInX,
  flipInY,
  rotateIn,
  spin,
  presets,
  getPreset,
} from "./presets";
export type { PresetName } from "./presets";

// Stagger helpers
export {
  simpleStagger,
  staggerFromCenter,
  staggerFromLast,
  staggerFromEdges,
  staggerFromIndex,
  gridStagger,
  gridStaggerX,
  gridStaggerY,
  rippleStagger,
  easedStagger,
  inOutStagger,
  outStagger,
  randomStagger,
  createStagger,
  stagger,
} from "./stagger-helpers";

// Anime.js utilities
export {
  $,
  get,
  set,
  cleanInlineStyles,
  remove,
  sync,
  keepTime,
  random,
  createSeededRandom,
  randomPick,
  shuffle,
  round,
  clamp,
  snap,
  wrap,
  mapRange,
  lerp,
  damp,
  roundPad,
  padStart,
  padEnd,
  degToRad,
  radToDeg,
} from "./anime-utils";
