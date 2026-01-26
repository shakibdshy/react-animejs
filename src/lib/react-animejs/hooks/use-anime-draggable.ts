/**
 * useAnimeDraggable - Draggable hook for React
 *
 * Makes elements draggable with physics-based release animations.
 */

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { createDraggable } from "animejs";
import type {
  UseAnimeDraggableOptions,
  UseAnimeDraggableReturn,
  DraggableState,
  Draggable,
} from "../types";
import { useAnimeScope, createSafeCallback, safeJsonStringify } from "../core";

// =============================================================================
// Default State
// =============================================================================

const DEFAULT_DRAGGABLE_STATE: DraggableState = {
  x: 0,
  y: 0,
  velocityX: 0,
  velocityY: 0,
  isDragging: false,
  isReleasing: false,
};

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
 *   const { ref, isDragging, position } = useAnimeDraggable({
 *     container: [0, 0, 0, 0],
 *     releaseEase: 'spring(0.7)',
 *     onDrag: (d) => console.log(d.x, d.y),
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
  // Track enabled state internally (may be used for future features)
  const [_isEnabled, _setIsEnabled] = useState(true);

  // ==========================================================================
  // Extract Options
  // ==========================================================================

  const {
    deps = [],
    enabled = true,
    disabled = false,

    // Draggable config
    trigger,
    container,
    axis,
    snap,
    releaseEase,
    releaseDuration,
    releaseSpring,
    releaseVelocity,

    // Callbacks
    onGrab,
    onDrag,
    onRelease,
    onSnap,
    onUpdate,
  } = options;

  // ==========================================================================
  // Draggable Lifecycle
  // ==========================================================================

  // Stability for options
  const optionsJson = useMemo(
    () =>
      safeJsonStringify({
        trigger,
        container,
        axis,
        snap,
        releaseEase,
        releaseDuration,
        releaseVelocity,
        releaseSpring,
      }),
    [
      trigger,
      container,
      axis,
      snap,
      releaseEase,
      releaseDuration,
      releaseVelocity,
      releaseSpring,
    ],
  );

  useEffect(() => {
    if (!enabled || disabled || !targetRef.current) {
      return;
    }

    try {
      // Build config
      const config: Record<string, unknown> = {
        trigger,
        container,
        axis,
        snap,
        releaseEase,
        releaseDuration,
        releaseVelocity,
      };

      // Handle spring config
      if (releaseSpring) {
        if (typeof releaseSpring === "string") {
          config.releaseEase = releaseSpring;
        } else {
          // Build spring string from object
          const { stiffness = 100, damping = 10, mass = 1 } = releaseSpring;
          config.releaseEase = `spring(${stiffness}, ${damping}, ${mass})`;
        }
      }

      // Wrap callbacks with state updates
      config.onGrab = (d: Draggable) => {
        setDraggableState({
          x: d.x,
          y: d.y,
          velocityX: d.velocityX,
          velocityY: d.velocityY,
          isDragging: true,
          isReleasing: false,
        });
        createSafeCallback(onGrab, "onGrab")?.(d);
      };

      config.onDrag = (d: Draggable) => {
        setDraggableState({
          x: d.x,
          y: d.y,
          velocityX: d.velocityX,
          velocityY: d.velocityY,
          isDragging: true,
          isReleasing: false,
        });
        createSafeCallback(onDrag, "onDrag")?.(d);
      };

      config.onRelease = (d: Draggable) => {
        setDraggableState({
          x: d.x,
          y: d.y,
          velocityX: d.velocityX,
          velocityY: d.velocityY,
          isDragging: false,
          isReleasing: true,
        });
        createSafeCallback(onRelease, "onRelease")?.(d);
      };

      if (onSnap) {
        config.onSnap = (d: Draggable) => {
          setDraggableState((prev) => ({
            ...prev,
            x: d.x,
            y: d.y,
            isReleasing: false,
          }));
          createSafeCallback(onSnap, "onSnap")?.(d);
        };
      }

      if (onUpdate) {
        config.onUpdate = (d: Draggable) => {
          setDraggableState({
            x: d.x,
            y: d.y,
            velocityX: d.velocityX,
            velocityY: d.velocityY,
            isDragging: d.isDragging,
            isReleasing: d.isReleasing,
          });
          createSafeCallback(onUpdate, "onUpdate")?.(d);
        };
      }

      // Clean undefined values
      Object.keys(config).forEach((key) => {
        if (config[key] === undefined) {
          delete config[key];
        }
      });

      // Create draggable
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const draggables = createDraggable(targetRef.current, config as any);

      // createDraggable returns an array of draggables
      draggableRef.current = (Array.isArray(draggables)
        ? draggables[0]
        : draggables) as unknown as Draggable;

      // Update initial state
      if (draggableRef.current) {
        setDraggableState({
          x: draggableRef.current.x || 0,
          y: draggableRef.current.y || 0,
          velocityX: 0,
          velocityY: 0,
          isDragging: false,
          isReleasing: false,
        });
      }

      _setIsEnabled(true);

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
   * Set position programmatically
   */
  const setPosition = useCallback((x: number, y: number, animate = false) => {
    if (!draggableRef.current) return;

    if (animate) {
      draggableRef.current.animateTo(x, y);
    } else {
      draggableRef.current.setPosition(x, y);
    }

    setDraggableState((prev) => ({
      ...prev,
      x,
      y,
    }));
  }, []);

  /**
   * Reset to initial position
   */
  const reset = useCallback(() => {
    setPosition(0, 0, true);
  }, [setPosition]);

  /**
   * Enable/disable draggable
   */
  const setEnabled = useCallback((enabled: boolean) => {
    if (!draggableRef.current) return;

    if (enabled) {
      draggableRef.current.enable();
    } else {
      draggableRef.current.disable();
    }

    _setIsEnabled(enabled);
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

  // ==========================================================================
  // Return Value
  // ==========================================================================

  return {
    ref: targetRef,
    state: draggableState,
    isDragging: draggableState.isDragging,
    position,
    setPosition,
    reset,
    setEnabled,
    draggable: draggableRef.current,
  };
}

export default useAnimeDraggable;
