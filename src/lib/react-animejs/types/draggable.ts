/**
 * Draggable-specific types for useAnimeDraggable hook
 *
 * Complete implementation based on Anime.js v4 Draggable API:
 * - Axes Parameters: x, y, snap, modifier, mapTo
 * - Settings: trigger, container, containerPadding, containerFriction, releaseContainerFriction,
 *             releaseMass, releaseStiffness, releaseDamping, velocityMultiplier, minVelocity,
 *             maxVelocity, releaseEase, dragSpeed, dragThreshold, scrollThreshold, scrollSpeed, cursor
 * - Callbacks: onGrab, onDrag, onUpdate, onRelease, onSnap, onSettle, onResize, onAfterResize
 * - Methods: disable, enable, setX, setY, animateInView, scrollInView, stop, reset, revert, refresh
 * - Properties: progressX, progressY, velocity, x, y, velocityX, velocityY, isDragging, isReleasing,
 *               isGrabbed, disabled, containerBounds, containerArray, etc.
 */

import type { RefObject } from "react";
import type { Easing } from "./common";

// =============================================================================
// Axis-Specific Parameters
// =============================================================================

/**
 * Modifier function type for transforming drag values
 * Can be used with utils.wrap, utils.clamp, etc.
 */
export type DraggableModifier = (value: number) => number;

/**
 * Axis-specific draggable parameters
 * Each axis (x, y) can have its own configuration
 */
export interface DraggableAxisParams {
  /**
   * Snap points or interval for this axis
   * - number: Snap to multiples of this value
   * - number[]: Snap to specific values
   */
  snap?: number | number[];

  /**
   * Modifier function to transform values
   * Use with utils.wrap(), utils.clamp(), etc.
   */
  modifier?: DraggableModifier;

  /**
   * Map drag movement to other elements/properties
   * Can be used for parallax effects
   */
  mapTo?: DraggableMapToConfig | DraggableMapToConfig[];
}

/**
 * Configuration for mapping drag to other elements
 */
export interface DraggableMapToConfig {
  /**
   * Target element(s) to map to
   */
  target: HTMLElement | SVGElement | string | NodeListOf<Element>;

  /**
   * Property to animate on target
   * @default 'translateX' or 'translateY' based on axis
   */
  property?: string;

  /**
   * Multiplier for the mapped value
   * @default 1
   */
  multiplier?: number;

  /**
   * Offset to add to the mapped value
   * @default 0
   */
  offset?: number;
}

// =============================================================================
// Draggable Bounds & Constraints
// =============================================================================

/**
 * Draggable bounds/container configuration
 */
export type DraggableBounds =
  | HTMLElement
  | string // CSS selector
  | Window
  | [number, number, number, number] // [top, right, bottom, left] offsets
  | false; // No bounds

/**
 * Axis constraint for dragging
 */
export type DraggableAxis = "x" | "y" | "xy";

/**
 * Snap configuration
 */
export interface DraggableSnap {
  /**
   * X-axis snap points or interval
   */
  x?: number | number[];

  /**
   * Y-axis snap points or interval
   */
  y?: number | number[];
}

/**
 * Cursor configuration
 */
export interface DraggableCursorParams {
  /**
   * Cursor during normal state
   */
  default?: string;

  /**
   * Cursor during grab/drag
   */
  grab?: string;

  /**
   * Cursor when disabled
   */
  disabled?: string;
}

// =============================================================================
// Draggable Callbacks
// =============================================================================

/**
 * Draggable callbacks
 */
export interface DraggableCallbacks {
  /**
   * Called when drag starts (element is grabbed)
   * @param draggable - The draggable instance
   */
  onGrab?: (draggable: Draggable) => void;

  /**
   * Called continuously during drag
   * @param draggable - The draggable instance
   */
  onDrag?: (draggable: Draggable) => void;

  /**
   * Called when drag ends (element is released)
   * @param draggable - The draggable instance
   */
  onRelease?: (draggable: Draggable) => void;

  /**
   * Called when snap animation completes
   * @param draggable - The draggable instance
   */
  onSnap?: (draggable: Draggable) => void;

  /**
   * Called on each animation update (during drag and release)
   * @param draggable - The draggable instance
   */
  onUpdate?: (draggable: Draggable) => void;

  /**
   * Called when the release animation settles (completes)
   * @param draggable - The draggable instance
   */
  onSettle?: (draggable: Draggable) => void;

  /**
   * Called when the window/container is resized
   * @param draggable - The draggable instance
   */
  onResize?: (draggable: Draggable) => void;

  /**
   * Called after resize handling is complete
   * @param draggable - The draggable instance
   */
  onAfterResize?: (draggable: Draggable) => void;
}

// =============================================================================
// Draggable Options
// =============================================================================

/**
 * Options for useAnimeDraggable hook
 *
 * @see https://animejs.com/documentation/draggable
 */
export interface UseAnimeDraggableOptions extends DraggableCallbacks {
  // ===========================================================================
  // Axes Parameters
  // ===========================================================================

  /**
   * X-axis specific parameters
   * When specified, allows fine-grained control over X-axis behavior
   */
  x?: DraggableAxisParams | boolean;

  /**
   * Y-axis specific parameters
   * When specified, allows fine-grained control over Y-axis behavior
   */
  y?: DraggableAxisParams | boolean;

  /**
   * Snap configuration (applies to both axes)
   * - number: Snap to multiples of this value
   * - DraggableSnap: Per-axis snap configuration
   */
  snap?: DraggableSnap | number;

  /**
   * Modifier function for both axes
   * Applied to transform drag values
   */
  modifier?: DraggableModifier;

  /**
   * Map drag to other elements (affects both axes)
   */
  mapTo?: DraggableMapToConfig | DraggableMapToConfig[];

  // ===========================================================================
  // Settings
  // ===========================================================================

  /**
   * CSS selector for trigger element (handle)
   * If not set, the entire element is draggable
   */
  trigger?: string | HTMLElement;

  /**
   * Constrain movement to container bounds
   * - HTMLElement: Use element as container
   * - string: CSS selector for container
   * - Window: Use window as container
   * - [top, right, bottom, left]: Offset from edges
   * - false: No container bounds
   */
  container?: DraggableBounds;

  /**
   * Padding inside the container
   * - number: Same padding on all sides
   * - [number, number]: [vertical, horizontal]
   * - [number, number, number, number]: [top, right, bottom, left]
   * @default 0
   */
  containerPadding?:
    | number
    | [number, number]
    | [number, number, number, number];

  /**
   * Friction when dragging against container bounds
   * 0 = no friction (stops at bounds), 1 = no resistance
   * @default 0.85
   */
  containerFriction?: number;

  /**
   * Friction during release when outside container bounds
   * @default 0.25
   */
  releaseContainerFriction?: number;

  /**
   * Mass for spring physics during release
   * Higher values = more momentum
   * @default 1
   */
  releaseMass?: number;

  /**
   * Spring stiffness for release animation
   * Higher values = snappier animation
   * @default 80
   */
  releaseStiffness?: number;

  /**
   * Spring damping for release animation
   * Higher values = less oscillation
   * @default 20
   */
  releaseDamping?: number;

  /**
   * Velocity multiplier for release animation
   * @default 1
   */
  velocityMultiplier?: number;

  /**
   * Minimum velocity threshold for release animation
   * Below this value, no momentum is applied
   * @default 0
   */
  minVelocity?: number;

  /**
   * Maximum velocity cap for release animation
   * @default Infinity
   */
  maxVelocity?: number;

  /**
   * Easing for release animation
   * @default 'outQuint'
   */
  releaseEase?: Easing;

  /**
   * Duration for release animation (when not using spring physics)
   * @default autoCalculated based on velocity
   */
  releaseDuration?: number;

  /**
   * Use spring physics for release
   * @example 'spring(0.7)' or { stiffness: 100, damping: 10, mass: 1 }
   */
  releaseSpring?:
    | string
    | { stiffness?: number; damping?: number; mass?: number };

  /**
   * Velocity multiplier for release (legacy alias for velocityMultiplier)
   * @deprecated Use velocityMultiplier instead
   * @default 1
   */
  releaseVelocity?: number;

  /**
   * Speed multiplier for drag movement
   * > 1 = faster, < 1 = slower
   * @default 1
   */
  dragSpeed?: number;

  /**
   * Minimum distance to move before drag starts
   * Used to differentiate between click and drag
   * @default 0
   */
  dragThreshold?: number;

  /**
   * Threshold for triggering scroll when near container edges
   * @default 50
   */
  scrollThreshold?: number;

  /**
   * Speed of auto-scroll when near container edges
   * @default 10
   */
  scrollSpeed?: number;

  /**
   * Cursor style configuration
   * - true: Use default cursor styles
   * - false: Disable cursor changes
   * - DraggableCursorParams: Custom cursor styles
   */
  cursor?: boolean | DraggableCursorParams;

  // ===========================================================================
  // React-specific Options
  // ===========================================================================

  /**
   * Constrain movement to an axis (legacy shorthand)
   * @deprecated Use x: false or y: false instead
   * @default 'xy'
   */
  axis?: DraggableAxis;

  /**
   * Whether to disable the draggable
   * @default false
   */
  disabled?: boolean;

  /**
   * Dependencies that should trigger re-initialization
   */
  deps?: unknown[];

  /**
   * Whether draggable should be enabled
   * @default true
   */
  enabled?: boolean;
}

// =============================================================================
// Draggable State
// =============================================================================

/**
 * Current draggable state
 */
export interface DraggableState {
  /**
   * Current X position
   */
  x: number;

  /**
   * Current Y position
   */
  y: number;

  /**
   * Current X velocity
   */
  velocityX: number;

  /**
   * Current Y velocity
   */
  velocityY: number;

  /**
   * Progress along X axis (0-1 within container)
   */
  progressX: number;

  /**
   * Progress along Y axis (0-1 within container)
   */
  progressY: number;

  /**
   * Whether the element is currently grabbed
   */
  isGrabbed: boolean;

  /**
   * Whether currently being dragged
   */
  isDragging: boolean;

  /**
   * Whether in release animation
   */
  isReleasing: boolean;

  /**
   * Whether the draggable is disabled
   */
  isDisabled: boolean;
}

// =============================================================================
// Hook Return Type
// =============================================================================

/**
 * Return type for useAnimeDraggable hook
 */
export interface UseAnimeDraggableReturn<T extends HTMLElement = HTMLElement> {
  /**
   * Ref to attach to the draggable element
   */
  ref: RefObject<T | null>;

  /**
   * Current draggable state
   */
  state: DraggableState;

  /**
   * Whether the element is currently grabbed
   */
  isGrabbed: boolean;

  /**
   * Whether currently being dragged
   */
  isDragging: boolean;

  /**
   * Whether in release animation
   */
  isReleasing: boolean;

  /**
   * Whether the draggable is currently disabled
   */
  isDisabled: boolean;

  /**
   * Current position
   */
  position: { x: number; y: number };

  /**
   * Current progress (0-1 within container bounds)
   */
  progress: { x: number; y: number };

  /**
   * Current velocity
   */
  velocity: { x: number; y: number };

  // ===========================================================================
  // Position Methods
  // ===========================================================================

  /**
   * Set X position programmatically
   * @param value - New X value
   * @param animate - Whether to animate to the position
   */
  setX: (value: number, animate?: boolean) => void;

  /**
   * Set Y position programmatically
   * @param value - New Y value
   * @param animate - Whether to animate to the position
   */
  setY: (value: number, animate?: boolean) => void;

  /**
   * Set both X and Y position
   * @param x - New X value
   * @param y - New Y value
   * @param animate - Whether to animate to the position
   */
  setPosition: (x: number, y: number, animate?: boolean) => void;

  // ===========================================================================
  // View Methods
  // ===========================================================================

  /**
   * Animate element into view within its container
   * @param params - Optional animation parameters
   */
  animateInView: (params?: object) => void;

  /**
   * Scroll element into view within its container
   */
  scrollInView: () => void;

  // ===========================================================================
  // Control Methods
  // ===========================================================================

  /**
   * Stop any current animation
   */
  stop: () => void;

  /**
   * Reset to initial position (0, 0)
   * @param animate - Whether to animate the reset
   */
  reset: (animate?: boolean) => void;

  /**
   * Enable the draggable
   */
  enable: () => void;

  /**
   * Disable the draggable
   */
  disable: () => void;

  /**
   * Enable or disable the draggable
   * @param enabled - Whether to enable
   */
  setEnabled: (enabled: boolean) => void;

  /**
   * Refresh draggable (recalculate bounds, etc.)
   * Call after container or element size changes
   */
  refresh: () => void;

  /**
   * Completely remove the draggable instance
   * Called automatically on unmount
   */
  revert: () => void;

  // ===========================================================================
  // Instance Access
  // ===========================================================================

  /**
   * Raw draggable instance (escape hatch)
   * Use for accessing anime.js-specific features not exposed by the hook
   */
  draggable: Draggable | null;
}

// =============================================================================
// Draggable Instance Types (from Anime.js)
// =============================================================================

/**
 * Internal Anime.js Draggable type representation
 * Based on Anime.js v4 Draggable API
 */
export interface Draggable {
  // ===========================================================================
  // Identity
  // ===========================================================================
  id: string;

  // ===========================================================================
  // Position & Velocity
  // ===========================================================================
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  progressX: number;
  progressY: number;

  // ===========================================================================
  // State Flags
  // ===========================================================================
  isGrabbed: boolean;
  isDragging: boolean;
  isReleasing: boolean;
  disabled: boolean;

  // ===========================================================================
  // Elements
  // ===========================================================================
  target: HTMLElement | SVGElement;
  trigger: HTMLElement | SVGElement | null;
  containerEl: HTMLElement | Window | null;

  // ===========================================================================
  // Container Bounds
  // ===========================================================================
  containerBounds: [number, number, number, number];
  containerArray: [number, number, number, number];

  // ===========================================================================
  // Snap Configuration
  // ===========================================================================
  snapX: number | number[] | null;
  snapY: number | number[] | null;

  // ===========================================================================
  // Settings (readonly)
  // ===========================================================================
  containerPadding: [number, number, number, number];
  dragSpeed: number;
  scrollSpeed: number;
  scrollThreshold: number;

  // ===========================================================================
  // Methods
  // ===========================================================================

  /**
   * Set X position
   * @param value - New X value
   */
  setX(value: number): this;

  /**
   * Set Y position
   * @param value - New Y value
   */
  setY(value: number): this;

  /**
   * Set both X and Y position (legacy method)
   * @deprecated Use setX and setY instead
   */
  setPosition?(x: number, y: number): this;

  /**
   * Animate to a position
   * @deprecated Use setX/setY with animation or manual animate call
   */
  animateTo?(x: number, y: number, params?: object): this;

  /**
   * Animate element into view within container
   */
  animateInView(params?: object): this;

  /**
   * Scroll element into view within container
   */
  scrollInView(): this;

  /**
   * Stop current animation
   */
  stop(): this;

  /**
   * Reset to initial position
   */
  reset(): this;

  /**
   * Enable draggable
   */
  enable(): this;

  /**
   * Disable draggable
   */
  disable(): this;

  /**
   * Refresh bounds and calculations
   */
  refresh(): this;

  /**
   * Completely remove/destroy the draggable
   */
  revert(): this;
}
