/**
 * AnimatePresence - Enter/Exit animation controller
 *
 * Manages mounted/unmounted states with animations.
 */

import {
  useState,
  useEffect,
  useRef,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { useAnime } from "../hooks/use-anime";
import type { AnimatableProperties } from "../types";

// =============================================================================
// Types
// =============================================================================

export interface AnimatePresenceProps {
  /**
   * Children to animate. Only direct children with a `key` prop will be tracked.
   */
  children: ReactNode;

  /**
   * Mode for handling multiple children
   * - 'sync': Exit and enter animations play at the same time
   * - 'wait': Wait for exit animation to complete before entering
   * - 'popLayout': Exit immediately, enter with layout animation
   * @default 'sync'
   */
  mode?: "sync" | "wait" | "popLayout";

  /**
   * Callback when all exit animations complete
   */
  onExitComplete?: () => void;

  /**
   * Initial animation state
   * If false, children will not animate on initial mount
   * @default true
   */
  initial?: boolean;
}

export interface AnimatePresenceChildProps {
  /**
   * Initial state (before entering)
   */
  initial?: Partial<AnimatableProperties>;

  /**
   * Animate to this state when mounted
   */
  animate?: Partial<AnimatableProperties>;

  /**
   * Animate to this state before unmounting
   */
  exit?: Partial<AnimatableProperties>;

  /**
   * Animation duration
   */
  duration?: number;

  /**
   * Easing function
   */
  ease?: string;

  /**
   * Delay before animation
   */
  delay?: number;
}

// =============================================================================
// AnimatedChild Component
// =============================================================================

interface AnimatedChildProps extends AnimatePresenceChildProps {
  children: ReactElement;
  isPresent: boolean;
  onExitComplete?: () => void;
  skipInitial?: boolean;
}

function AnimatedChild({
  children,
  isPresent,
  initial,
  animate,
  exit,
  duration = 300,
  ease = "outQuad",
  delay = 0,
  onExitComplete,
  skipInitial = false,
}: AnimatedChildProps) {
  const [shouldRender, setShouldRender] = useState(isPresent);
  const hasAnimated = useRef(false);

  // Determine current animation state
  const currentProps = isPresent
    ? (hasAnimated.current || skipInitial ? animate : initial) || animate
    : exit;

  const { ref, controls, state } = useAnime({
    ...currentProps,
    duration,
    ease,
    delay,
    autoplay: true,
  });

  // Handle mounting
  useEffect(() => {
    if (isPresent) {
      setShouldRender(true);
      hasAnimated.current = true;
    }
  }, [isPresent]);

  // Handle exit animation completion
  useEffect(() => {
    if (!isPresent && state.completed) {
      setShouldRender(false);
      onExitComplete?.();
    }
  }, [isPresent, state.completed, onExitComplete]);

  // Play exit animation when removed
  useEffect(() => {
    if (!isPresent && shouldRender) {
      controls.restart();
    }
  }, [isPresent, shouldRender, controls]);

  if (!shouldRender) {
    return null;
  }

  // Clone child with ref
  if (!isValidElement(children)) {
    return children;
  }

  return cloneElement(children, { ref } as Partial<unknown>);
}

// =============================================================================
// AnimatePresence Component
// =============================================================================

/**
 * AnimatePresence - Animate children entering and exiting the DOM
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, children }) {
 *   return (
 *     <AnimatePresence>
 *       {isOpen && (
 *         <AnimatePresenceChild
 *           key="modal"
 *           initial={{ opacity: 0, scale: 0.9 }}
 *           animate={{ opacity: 1, scale: 1 }}
 *           exit={{ opacity: 0, scale: 0.9 }}
 *           duration={300}
 *         >
 *           <div className="modal">{children}</div>
 *         </AnimatePresenceChild>
 *       )}
 *     </AnimatePresence>
 *   );
 * }
 * ```
 */
export function AnimatePresence({
  children,
  mode: _mode = "sync",
  onExitComplete,
  initial = true,
}: AnimatePresenceProps) {
  // Track which children are present
  const [presentChildren, setPresentChildren] = useState<
    Map<string | number, ReactElement>
  >(new Map());

  // Track exiting children
  const [exitingChildren, setExitingChildren] = useState<
    Map<string | number, ReactElement>
  >(new Map());

  // Track if this is the initial render
  const isInitialMount = useRef(true);

  // Process children changes
  useEffect(() => {
    const childArray = Children.toArray(children).filter(
      isValidElement,
    ) as ReactElement[];
    const newPresent = new Map<string | number, ReactElement>();
    const newExiting = new Map(exitingChildren);

    // Build map of currently present children
    childArray.forEach((child) => {
      const key = child.key;
      if (key != null) {
        newPresent.set(key, child);
        // Remove from exiting if it's back
        newExiting.delete(key);
      }
    });

    // Find children that have been removed (need to exit)
    presentChildren.forEach((child, key) => {
      if (!newPresent.has(key) && !newExiting.has(key)) {
        newExiting.set(key, child);
      }
    });

    setPresentChildren(newPresent);
    setExitingChildren(newExiting);

    // Update initial mount flag
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [children]);

  // Handle exit completion
  const handleExitComplete = (key: string | number) => {
    setExitingChildren((prev) => {
      const next = new Map(prev);
      next.delete(key);

      // Call onExitComplete when all exits are done
      if (next.size === 0 && onExitComplete) {
        onExitComplete();
      }

      return next;
    });
  };

  // Render all children (present + exiting)
  const allChildren: ReactElement[] = [];

  // Add present children
  presentChildren.forEach((child, key) => {
    const childProps = child.props as AnimatePresenceChildProps;

    allChildren.push(
      <AnimatedChild
        key={key}
        isPresent={true}
        initial={childProps.initial}
        animate={childProps.animate}
        exit={childProps.exit}
        duration={childProps.duration}
        ease={childProps.ease}
        delay={childProps.delay}
        skipInitial={!initial && isInitialMount.current}
      >
        {child}
      </AnimatedChild>,
    );
  });

  // Add exiting children
  exitingChildren.forEach((child, key) => {
    const childProps = child.props as AnimatePresenceChildProps;

    allChildren.push(
      <AnimatedChild
        key={key}
        isPresent={false}
        initial={childProps.initial}
        animate={childProps.animate}
        exit={childProps.exit}
        duration={childProps.duration}
        ease={childProps.ease}
        delay={childProps.delay}
        onExitComplete={() => handleExitComplete(key)}
      >
        {child}
      </AnimatedChild>,
    );
  });

  return <>{allChildren}</>;
}

/**
 * Helper component for AnimatePresence children
 * Use this to specify initial, animate, and exit props
 */
export function AnimatePresenceChild({
  children,
  ...props
}: AnimatePresenceChildProps & { children: ReactElement }) {
  // This component is just a marker - AnimatePresence reads its props
  return cloneElement(children, props as Partial<unknown>);
}

export default AnimatePresence;
