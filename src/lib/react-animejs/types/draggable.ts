/**
 * Draggable-specific types for useAnimeDraggable hook
 */

import type { RefObject } from "react";
import type { Easing } from "./common";

// =============================================================================
// Draggable Options
// =============================================================================

/**
 * Draggable bounds/container configuration
 */
export type DraggableBounds =
  | HTMLElement
  | string // CSS selector
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
 * Draggable callbacks
 */
export interface DraggableCallbacks {
  /**
   * Called when drag starts
   */
  onGrab?: (draggable: Draggable) => void;

  /**
   * Called during drag
   */
  onDrag?: (draggable: Draggable) => void;

  /**
   * Called when drag ends
   */
  onRelease?: (draggable: Draggable) => void;

  /**
   * Called when snap animation completes
   */
  onSnap?: (draggable: Draggable) => void;

  /**
   * Called on each update
   */
  onUpdate?: (draggable: Draggable) => void;
}

/**
 * Options for useAnimeDraggable hook
 */
export interface UseAnimeDraggableOptions extends DraggableCallbacks {
  /**
   * CSS selector for trigger element (handle)
   * If not set, the entire element is draggable
   */
  trigger?: string;

  /**
   * Constrain movement to container bounds
   */
  container?: DraggableBounds;

  /**
   * Constrain movement to an axis
   * @default 'xy'
   */
  axis?: DraggableAxis;

  /**
   * Snap configuration
   */
  snap?: DraggableSnap | number;

  /**
   * Easing for release animation
   * @default 'outQuint'
   */
  releaseEase?: Easing;

  /**
   * Duration for release animation
   * @default 500
   */
  releaseDuration?: number;

  /**
   * Use spring physics for release
   * @example 'spring(0.7)' or { stiffness: 100, damping: 10 }
   */
  releaseSpring?:
    | string
    | { stiffness?: number; damping?: number; mass?: number };

  /**
   * Velocity multiplier for release
   * @default 1
   */
  releaseVelocity?: number;

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
   * Whether currently being dragged
   */
  isDragging: boolean;

  /**
   * Whether in release animation
   */
  isReleasing: boolean;
}

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
   * Whether currently being dragged
   */
  isDragging: boolean;

  /**
   * Current position
   */
  position: { x: number; y: number };

  /**
   * Set position programmatically
   */
  setPosition: (x: number, y: number, animate?: boolean) => void;

  /**
   * Reset to initial position
   */
  reset: () => void;

  /**
   * Enable/disable draggable
   */
  setEnabled: (enabled: boolean) => void;

  /**
   * Raw draggable instance (escape hatch)
   */
  draggable: Draggable | null;
}

// =============================================================================
// Draggable Instance Types (from Anime.js)
// =============================================================================

/**
 * Internal Anime.js Draggable type representation
 */
export interface Draggable {
  id: string;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isDragging: boolean;
  isReleasing: boolean;
  target: HTMLElement | SVGElement;

  // Methods
  setPosition(x: number, y: number): this;
  animateTo(x: number, y: number, params?: object): this;
  enable(): this;
  disable(): this;
  revert(): this;
}
