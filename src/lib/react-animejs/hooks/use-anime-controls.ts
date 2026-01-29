/**
 * useAnimeControls - Shared animation controller
 *
 * Allows controlling multiple animations from a single controller instance.
 */

import { useRef, useCallback, useMemo } from "react";
import type { PlaybackControls, JSAnimation } from "../types";

// =============================================================================
// Types
// =============================================================================

/**
 * Animation controller that can manage multiple animations
 */
export interface AnimeController extends PlaybackControls {
  /**
   * Register an animation with this controller
   */
  register: (animation: JSAnimation) => () => void;

  /**
   * Get all registered animations
   */
  getAnimations: () => JSAnimation[];

  /**
   * Clear all registered animations
   */
  clear: () => void;
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useAnimeControls - Create a shared animation controller
 *
 * Use this hook to control multiple animations with a single set of controls.
 *
 * @returns A controller object with playback methods
 *
 * @example
 * ```tsx
 * function ControlledAnimations() {
 *   const controller = useAnimeControls();
 *
 *   const { ref: ref1 } = useAnime({
 *     translateX: 100,
 *     controller,
 *   });
 *
 *   const { ref: ref2 } = useAnime({
 *     translateY: 100,
 *     controller,
 *   });
 *
 *   return (
 *     <div>
 *       <div ref={ref1} />
 *       <div ref={ref2} />
 *       <button onClick={() => controller.play()}>Play All</button>
 *       <button onClick={() => controller.pause()}>Pause All</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnimeControls(): AnimeController {
  // Store registered animations
  const animationsRef = useRef<Set<JSAnimation>>(new Set());

  /**
   * Register an animation with this controller
   */
  const register = useCallback((animation: JSAnimation) => {
    animationsRef.current.add(animation);

    // Return unregister function
    return () => {
      animationsRef.current.delete(animation);
    };
  }, []);

  /**
   * Get all registered animations
   */
  const getAnimations = useCallback(() => {
    return Array.from(animationsRef.current);
  }, []);

  /**
   * Clear all registered animations
   */
  const clear = useCallback(() => {
    animationsRef.current.clear();
  }, []);

  /**
   * Execute a method on all registered animations
   */
  const forEachAnimation = useCallback(
    (method: (anim: JSAnimation) => void) => {
      animationsRef.current.forEach((anim) => {
        try {
          method(anim);
        } catch (error) {
          console.warn("[react-animejs] Controller method error:", error);
        }
      });
    },
    [],
  );

  // Build controller with all playback methods
  const controller: AnimeController = useMemo(
    () => ({
      // Registration methods
      register,
      getAnimations,
      clear,

      // Playback methods
      play: () => forEachAnimation((a) => a.play()),
      pause: () => forEachAnimation((a) => a.pause()),
      resume: () => forEachAnimation((a) => a.resume()),
      restart: () => forEachAnimation((a) => a.restart()),
      reverse: () => forEachAnimation((a) => a.reverse()),
      alternate: () => forEachAnimation((a) => a.alternate()),
      complete: () => forEachAnimation((a) => a.complete()),
      reset: () => forEachAnimation((a) => a.reset()),
      cancel: () => forEachAnimation((a) => a.cancel()),

      seek: (time: number | string) => {
        forEachAnimation((a) => a.seek(time));
      },

      stretch: (duration: number) => {
        forEachAnimation((a) => a.stretch(duration));
      },

      setPlaybackRate: (rate: number) => {
        forEachAnimation((a) => {
          (a as unknown as Record<string, unknown>).playbackRate = rate;
        });
      },
      setFrameRate: (fps: number) => {
        forEachAnimation((a) => {
          (a as unknown as Record<string, unknown>).fps = fps;
        });
      },
    }),
    [register, getAnimations, clear, forEachAnimation],
  );

  return controller;
}

export default useAnimeControls;
