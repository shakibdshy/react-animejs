/**
 * Animate - Declarative animation component
 *
 * A component wrapper that provides a declarative way to animate children.
 */

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  useEffect,
  useRef,
} from "react";
import { useAnime } from "../hooks/use-anime";
import type {
  AnimationState,
  PlaybackControls,
  UseAnimeOptions,
} from "../types";

// =============================================================================
// Types
// =============================================================================

export interface AnimateProps extends Omit<
  UseAnimeOptions,
  "targets" | "selector"
> {
  /**
   * Child element to animate
   * Must be a single element that accepts a ref
   */
  children: ReactElement;

  /**
   * Callback when animation controls change
   */
  onControlsReady?: (controls: PlaybackControls) => void;

  /**
   * Callback when animation state changes
   */
  onStateChange?: (state: AnimationState) => void;

  /**
   * Whether to play on mount
   * @default false (uses autoplay from UseAnimeOptions)
   */
  playOnMount?: boolean;

  /**
   * Custom className to add to the child
   */
  className?: string;
}

// =============================================================================
// Component Implementation
// =============================================================================

/**
 * Animate - Declarative animation wrapper
 *
 * Wraps a child element and applies animations to it declaratively.
 *
 * @example
 * ```tsx
 * function Hero() {
 *   return (
 *     <Animate
 *       translateY={[-50, 0]}
 *       opacity={[0, 1]}
 *       duration={800}
 *       ease="outExpo"
 *       autoplay
 *     >
 *       <h1>Hello World</h1>
 *     </Animate>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With controls
 * function ControlledAnimation() {
 *   const controlsRef = useRef<PlaybackControls>(null);
 *
 *   return (
 *     <div>
 *       <Animate
 *         translateX={250}
 *         duration={1000}
 *         onControlsReady={(controls) => {
 *           controlsRef.current = controls;
 *         }}
 *       >
 *         <div className="box" />
 *       </Animate>
 *       <button onClick={() => controlsRef.current?.play()}>
 *         Play
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function Animate({
  children,
  onControlsReady,
  onStateChange,
  playOnMount = false,
  className,
  ...animationProps
}: AnimateProps) {
  // Get animation controls
  const { ref, controls, state } = useAnime({
    ...animationProps,
    autoplay: animationProps.autoplay ?? playOnMount,
  });

  // Track if we've notified about controls
  const notifiedRef = useRef(false);

  // Notify when controls are ready
  useEffect(() => {
    if (onControlsReady && !notifiedRef.current) {
      onControlsReady(controls);
      notifiedRef.current = true;
    }
  }, [controls, onControlsReady]);

  // Notify on state changes
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Validate child
  if (!isValidElement(children)) {
    console.warn(
      "[react-animejs] Animate requires a single valid React element as child",
    );
    return children;
  }

  // Clone child with ref and additional props
  return cloneElement(children, {
    ref,
    className: className
      ? `${(children.props as { className?: string }).className || ""} ${className}`.trim()
      : (children.props as { className?: string }).className,
  } as Partial<unknown>);
}

export default Animate;
