/**
 * useAnimeDraggable - Draggable hook for React
 *
 * Makes elements draggable with physics-based release animations.
 * Fully implements Anime.js v4 Draggable API.
 *
 * @see https://animejs.com/documentation/draggable
 *
 * Features:
 * - Axes Parameters: x, y, snap, modifier, mapTo
 * - Settings: trigger, container, containerPadding, containerFriction, releaseContainerFriction,
 *             releaseMass, releaseStiffness, releaseDamping, velocityMultiplier, minVelocity,
 *             maxVelocity, releaseEase, dragSpeed, dragThreshold, scrollThreshold, scrollSpeed, cursor
 * - Callbacks: onGrab, onDrag, onUpdate, onRelease, onSnap, onSettle, onResize, onAfterResize
 * - Methods: disable, enable, setX, setY, animateInView, scrollInView, stop, reset, refresh, revert
 * - Properties: progressX, progressY, velocity, x, y, velocityX, velocityY, isDragging, isReleasing
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createDraggable } from "animejs";
import type {
  Draggable,
  DraggableState,
  UseAnimeDraggableOptions,
  UseAnimeDraggableReturn,
} from "../types";
import { createSafeCallback, safeJsonStringify, useAnimeScope } from "../core";

// =============================================================================
// Default State
// =============================================================================

const DEFAULT_DRAGGABLE_STATE: DraggableState = {
  x: 0,
  y: 0,
  velocityX: 0,
  velocityY: 0,
  progressX: 0,
  progressY: 0,
  isGrabbed: false,
  isDragging: false,
  isReleasing: false,
  isDisabled: false,
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract state from draggable instance
 */
function extractDraggableState(d: Draggable): DraggableState {
  return {
    x: d.x ?? 0,
    y: d.y ?? 0,
    velocityX: d.velocityX ?? 0,
    velocityY: d.velocityY ?? 0,
    progressX: d.progressX ?? 0,
    progressY: d.progressY ?? 0,
    isGrabbed: d.isGrabbed ?? false,
    isDragging: d.isDragging ?? false,
    isReleasing: d.isReleasing ?? false,
    isDisabled: d.disabled ?? false,
  };
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useAnimeDraggable - Make elements draggable
 *
 * @param options - Draggable options including bounds, snap, and callbacks
 * @returns Object containing ref, state, and control methods
 *
 * @example
 * ```tsx
 * function DraggableCard() {
 *   const { ref, isDragging, position, setX, setY } = useAnimeDraggable({
 *     container: containerRef.current,
 *     containerPadding: 20,
 *     releaseStiffness: 120,
 *     releaseDamping: 20,
 *     snap: 50,
 *     onDrag: (d) => console.log(d.x, d.y),
 *     onSettle: (d) => console.log('Settled at', d.x, d.y),
 *   });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       className={`card ${isDragging ? 'dragging' : ''}`}
 *     >
 *       Drag me!
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnimeDraggable<T extends HTMLElement = HTMLElement>(
  options: UseAnimeDraggableOptions = {},
): UseAnimeDraggableReturn<T> {
  // ==========================================================================
  // Refs
  // ==========================================================================

  // Target element ref
  const targetRef = useRef<T | null>(null);

  // Draggable instance ref
  const draggableRef = useRef<Draggable | null>(null);

  // ==========================================================================
  // Context
  // ==========================================================================

  const scopeContext = useAnimeScope();

  // ==========================================================================
  // State
  // ==========================================================================

  const [draggableState, setDraggableState] = useState<DraggableState>(
    DEFAULT_DRAGGABLE_STATE,
  );

  // ==========================================================================
  // Extract Options
  // ==========================================================================

  const {
    deps = [],
    enabled = true,
    disabled = false,

    // Axes Parameters
    x,
    y,
    snap,
    modifier,
    mapTo,

    // Settings
    trigger,
    container,
    containerPadding,
    containerFriction,
    releaseContainerFriction,
    releaseMass,
    releaseStiffness,
    releaseDamping,
    velocityMultiplier,
    minVelocity,
    maxVelocity,
    releaseEase,
    releaseDuration,
    releaseSpring,
    releaseVelocity, // Legacy alias
    dragSpeed,
    dragThreshold,
    scrollThreshold,
    scrollSpeed,
    cursor,

    // Legacy
    axis,

    // Callbacks
    onGrab,
    onDrag,
    onRelease,
    onSnap,
    onUpdate,
    onSettle,
    onResize,
    onAfterResize,
  } = options;

  // ==========================================================================
  // Draggable Lifecycle
  // ==========================================================================

  // Stability for options
  const optionsJson = useMemo(
    () =>
      safeJsonStringify({
        // Axes
        x,
        y,
        snap,
        mapTo,
        // Settings
        trigger,
        container,
        containerPadding,
        containerFriction,
        releaseContainerFriction,
        releaseMass,
        releaseStiffness,
        releaseDamping,
        velocityMultiplier,
        minVelocity,
        maxVelocity,
        releaseEase,
        releaseDuration,
        releaseVelocity,
        releaseSpring,
        dragSpeed,
        dragThreshold,
        scrollThreshold,
        scrollSpeed,
        cursor,
        axis,
      }),
    [
      x,
      y,
      snap,
      mapTo,
      trigger,
      container,
      containerPadding,
      containerFriction,
      releaseContainerFriction,
      releaseMass,
      releaseStiffness,
      releaseDamping,
      velocityMultiplier,
      minVelocity,
      maxVelocity,
      releaseEase,
      releaseDuration,
      releaseVelocity,
      releaseSpring,
      dragSpeed,
      dragThreshold,
      scrollThreshold,
      scrollSpeed,
      cursor,
      axis,
    ],
  );

  useEffect(() => {
    if (!enabled || disabled || !targetRef.current) {
      return;
    }

    try {
      // Build config
      const config: Record<string, unknown> = {};

      // ========================================================================
      // Axes Parameters
      // ========================================================================

      // X-axis configuration
      if (x !== undefined) {
        if (typeof x === "boolean") {
          config.x = x;
        } else {
          config.x = { ...x };
          // Handle modifier (can't be serialized, use from options directly)
          if (x.modifier) {
            (config.x as Record<string, unknown>).modifier = x.modifier;
          }
        }
      }

      // Y-axis configuration
      if (y !== undefined) {
        if (typeof y === "boolean") {
          config.y = y;
        } else {
          config.y = { ...y };
          // Handle modifier
          if (y.modifier) {
            (config.y as Record<string, unknown>).modifier = y.modifier;
          }
        }
      }

      // Legacy axis support (deprecated but supported for backwards compatibility)
      if (axis !== undefined && x === undefined && y === undefined) {
        if (axis === "x") {
          config.y = false;
        } else if (axis === "y") {
          config.x = false;
        }
      }

      // Global snap
      if (snap !== undefined) {
        config.snap = snap;
      }

      // Global modifier
      if (modifier !== undefined) {
        config.modifier = modifier;
      }

      // Map to
      if (mapTo !== undefined) {
        config.mapTo = mapTo;
      }

      // ========================================================================
      // Settings
      // ========================================================================

      if (trigger !== undefined) config.trigger = trigger;
      if (container !== undefined) config.container = container;
      if (containerPadding !== undefined)
        config.containerPadding = containerPadding;
      if (containerFriction !== undefined)
        config.containerFriction = containerFriction;
      if (releaseContainerFriction !== undefined)
        config.releaseContainerFriction = releaseContainerFriction;
      if (releaseMass !== undefined) config.releaseMass = releaseMass;
      if (releaseStiffness !== undefined)
        config.releaseStiffness = releaseStiffness;
      if (releaseDamping !== undefined) config.releaseDamping = releaseDamping;
      if (velocityMultiplier !== undefined)
        config.velocityMultiplier = velocityMultiplier;
      if (releaseVelocity !== undefined)
        config.velocityMultiplier = releaseVelocity; // Legacy alias
      if (minVelocity !== undefined) config.minVelocity = minVelocity;
      if (maxVelocity !== undefined) config.maxVelocity = maxVelocity;
      if (releaseEase !== undefined) config.releaseEase = releaseEase;
      if (releaseDuration !== undefined)
        config.releaseDuration = releaseDuration;
      if (dragSpeed !== undefined) config.dragSpeed = dragSpeed;
      if (dragThreshold !== undefined) config.dragThreshold = dragThreshold;
      if (scrollThreshold !== undefined)
        config.scrollThreshold = scrollThreshold;
      if (scrollSpeed !== undefined) config.scrollSpeed = scrollSpeed;
      if (cursor !== undefined) config.cursor = cursor;

      // Handle spring config (builds a spring easing string)
      if (releaseSpring) {
        if (typeof releaseSpring === "string") {
          config.releaseEase = releaseSpring;
        } else {
          // Build spring string from object
          const { stiffness = 100, damping = 10, mass = 1 } = releaseSpring;
          config.releaseEase = `spring(${stiffness}, ${damping}, ${mass})`;
        }
      }

      // ========================================================================
      // Callbacks - Wrap with state updates
      // ========================================================================

      config.onGrab = (d: Draggable) => {
        setDraggableState(extractDraggableState(d));
        createSafeCallback(onGrab, "onGrab")?.(d);
      };

      config.onDrag = (d: Draggable) => {
        setDraggableState(extractDraggableState(d));
        createSafeCallback(onDrag, "onDrag")?.(d);
      };

      config.onRelease = (d: Draggable) => {
        setDraggableState(extractDraggableState(d));
        createSafeCallback(onRelease, "onRelease")?.(d);
      };

      if (onSnap) {
        config.onSnap = (d: Draggable) => {
          setDraggableState(extractDraggableState(d));
          createSafeCallback(onSnap, "onSnap")?.(d);
        };
      }

      if (onUpdate) {
        config.onUpdate = (d: Draggable) => {
          setDraggableState(extractDraggableState(d));
          createSafeCallback(onUpdate, "onUpdate")?.(d);
        };
      }

      if (onSettle) {
        config.onSettle = (d: Draggable) => {
          setDraggableState(extractDraggableState(d));
          createSafeCallback(onSettle, "onSettle")?.(d);
        };
      }

      if (onResize) {
        config.onResize = (d: Draggable) => {
          setDraggableState(extractDraggableState(d));
          createSafeCallback(onResize, "onResize")?.(d);
        };
      }

      if (onAfterResize) {
        config.onAfterResize = (d: Draggable) => {
          setDraggableState(extractDraggableState(d));
          createSafeCallback(onAfterResize, "onAfterResize")?.(d);
        };
      }

      // ========================================================================
      // Create Draggable
      // ========================================================================

       
      const draggables = createDraggable(targetRef.current, config as any);

      // createDraggable returns an array of draggables
      draggableRef.current = (Array.isArray(draggables)
        ? draggables[0]
        : draggables) as unknown as Draggable;

      // Update initial state
      if (draggableRef.current) {
        setDraggableState(extractDraggableState(draggableRef.current));
      }

      // Register cleanup with parent scope
      if (scopeContext.isScoped) {
        scopeContext.registerCleanup(() => {
          if (draggableRef.current) {
            try {
              draggableRef.current.revert();
            } catch {
              // Ignore cleanup errors
            }
          }
        });
      }
    } catch (error) {
      console.error("[react-animejs] Draggable creation error:", error);
    }

    // Cleanup
    return () => {
      if (draggableRef.current) {
        try {
          draggableRef.current.revert();
        } catch {
          // Ignore cleanup errors
        }
        draggableRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, disabled, optionsJson, scopeContext, ...deps]);

  // ==========================================================================
  // Control Methods
  // ==========================================================================

  /**
   * Set X position
   */
  const setX = useCallback((value: number, _animate = false) => {
    if (!draggableRef.current) return;
    draggableRef.current.setX(value);
    setDraggableState((prev) => ({
      ...prev,
      x: value,
    }));
  }, []);

  /**
   * Set Y position
   */
  const setY = useCallback((value: number, _animate = false) => {
    if (!draggableRef.current) return;
    draggableRef.current.setY(value);
    setDraggableState((prev) => ({
      ...prev,
      y: value,
    }));
  }, []);

  /**
   * Set both X and Y position
   */
  const setPosition = useCallback((x: number, y: number, _animate = false) => {
    if (!draggableRef.current) return;
    draggableRef.current.setX(x);
    draggableRef.current.setY(y);
    setDraggableState((prev) => ({
      ...prev,
      x,
      y,
    }));
  }, []);

  /**
   * Animate element into view within container
   */
  const animateInView = useCallback((params?: object) => {
    if (!draggableRef.current) return;
    draggableRef.current.animateInView(params);
  }, []);

  /**
   * Scroll element into view within container
   */
  const scrollInView = useCallback(() => {
    if (!draggableRef.current) return;
    draggableRef.current.scrollInView();
  }, []);

  /**
   * Stop current animation
   */
  const stop = useCallback(() => {
    if (!draggableRef.current) return;
    draggableRef.current.stop();
  }, []);

  /**
   * Reset to initial position
   */
  const reset = useCallback(
    (animate = true) => {
      if (!draggableRef.current) return;
      if (animate) {
        draggableRef.current.reset();
      } else {
        setPosition(0, 0, false);
      }
    },
    [setPosition],
  );

  /**
   * Enable the draggable
   */
  const enable = useCallback(() => {
    if (!draggableRef.current) return;
    draggableRef.current.enable();
    setDraggableState((prev) => ({
      ...prev,
      isDisabled: false,
    }));
  }, []);

  /**
   * Disable the draggable
   */
  const disableDraggable = useCallback(() => {
    if (!draggableRef.current) return;
    draggableRef.current.disable();
    setDraggableState((prev) => ({
      ...prev,
      isDisabled: true,
    }));
  }, []);

  /**
   * Enable/disable draggable (legacy method)
   */
  const setEnabled = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        enable();
      } else {
        disableDraggable();
      }
    },
    [enable, disableDraggable],
  );

  /**
   * Refresh draggable bounds and calculations
   */
  const refresh = useCallback(() => {
    if (!draggableRef.current) return;
    draggableRef.current.refresh();
  }, []);

  /**
   * Completely remove the draggable
   */
  const revert = useCallback(() => {
    if (!draggableRef.current) return;
    draggableRef.current.revert();
    draggableRef.current = null;
    setDraggableState(DEFAULT_DRAGGABLE_STATE);
  }, []);

  // ==========================================================================
  // Computed Values
  // ==========================================================================

  const position = useMemo(
    () => ({
      x: draggableState.x,
      y: draggableState.y,
    }),
    [draggableState.x, draggableState.y],
  );

  const progress = useMemo(
    () => ({
      x: draggableState.progressX,
      y: draggableState.progressY,
    }),
    [draggableState.progressX, draggableState.progressY],
  );

  const velocity = useMemo(
    () => ({
      x: draggableState.velocityX,
      y: draggableState.velocityY,
    }),
    [draggableState.velocityX, draggableState.velocityY],
  );

  // ==========================================================================
  // Return Value
  // ==========================================================================

  return {
    // Ref
    ref: targetRef,

    // State
    state: draggableState,
    isGrabbed: draggableState.isGrabbed,
    isDragging: draggableState.isDragging,
    isReleasing: draggableState.isReleasing,
    isDisabled: draggableState.isDisabled,

    // Position & Velocity
    position,
    progress,
    velocity,

    // Position Methods
    setX,
    setY,
    setPosition,

    // View Methods
    animateInView,
    scrollInView,

    // Control Methods
    stop,
    reset,
    enable,
    disable: disableDraggable,
    setEnabled,
    refresh,
    revert,

    // Instance Access
    draggable: draggableRef.current,
  };
}

export default useAnimeDraggable;
