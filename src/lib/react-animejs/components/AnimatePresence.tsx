/**
 * AnimatePresence - Enter/Exit animation controller
 *
 * Manages mounted/unmounted states with animations.
 * Uses native anime.js animation format with [from, to] array syntax.
 */

import {
  Children,
  cloneElement,
  type CSSProperties,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAnime } from "../hooks/use-anime";

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
   * - 'wait' / 'exitBeforeEnter': Wait for exit animation to complete before entering
   * - 'popLayout': Exit immediately, enter with layout animation
   * @default 'sync'
   */
  mode?: "sync" | "wait" | "exitBeforeEnter" | "popLayout";

  /**
   * Callback when all exit animations complete
   */
  onExitComplete?: () => void;

  /**
   * If false, children will not animate on initial mount
   * @default true
   */
  initial?: boolean;
}

export interface AnimatePresenceChildProps {
  /**
   * Enter animation using native anime.js format.
   * Supports [from, to] arrays: { opacity: [0, 1], scale: [0.6, 1] }
   * Or single values to animate from current: { opacity: 1, translateY: 0 }
   */
  enter?: Record<string, unknown>;
  /**
   * Exit animation using native anime.js format.
   * Supports [from, to] arrays: { opacity: [1, 0], scale: [1, 0.8] }
   * Or single values: { opacity: 0, translateY: 20 }
   */
  exit?: Record<string, unknown>;
  duration?: number;
  ease?: string;
  delay?: number;
}

// =============================================================================
// AnimatedChild Component
// =============================================================================

interface AnimatedChildProps {
  children: ReactElement;
  isPresent: boolean;
  enter?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  duration?: number;
  ease?: string;
  delay?: number;
  onExitComplete?: () => void;
  popLayout?: boolean;
}

function AnimatedChild({
  children,
  isPresent,
  enter,
  exit,
  duration,
  ease,
  delay,
  onExitComplete,
  popLayout = false,
}: AnimatedChildProps) {
  const [shouldRender, setShouldRender] = useState(isPresent);
  const [popLayoutStyle, setPopLayoutStyle] = useState<CSSProperties>();
  const hasMeasuredPopLayout = useRef(false);
  const nodeRef = useRef<HTMLElement | null>(null);

  // Pick the animation for the current state — enter or exit
  const animationProps = isPresent ? enter : exit;

  const { ref, controls, state } = useAnime({
    ...(animationProps || {}),
    duration,
    ease,
    delay,
    autoplay: true,
  });

  // Handle mounting
  useEffect(() => {
    if (isPresent) {
      setShouldRender(true);
    }
  }, [isPresent]);

  useLayoutEffect(() => {
    if (isPresent || !popLayout || !shouldRender) {
      hasMeasuredPopLayout.current = false;
      if (popLayoutStyle) {
        setPopLayoutStyle(undefined);
      }
      return;
    }

    if (hasMeasuredPopLayout.current || !nodeRef.current) {
      return;
    }

    hasMeasuredPopLayout.current = true;
    const rect = nodeRef.current.getBoundingClientRect();
    setPopLayoutStyle({
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: 0,
      pointerEvents: "none",
    });
  }, [isPresent, popLayout, shouldRender, popLayoutStyle]);

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

  if (!isValidElement(children)) {
    return children;
  }

  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      nodeRef.current = node;
      (ref as { current: HTMLElement | null }).current = node;
    },
    style: popLayoutStyle
      ? {
          ...((children.props as { style?: CSSProperties }).style || {}),
          ...popLayoutStyle,
        }
      : (children.props as { style?: CSSProperties }).style,
  } as Partial<unknown>);
}

// =============================================================================
// AnimatePresence Component
// =============================================================================

export function AnimatePresence({
  children,
  mode = "sync",
  onExitComplete,
  initial = true,
}: AnimatePresenceProps) {
  const isInitialRender = useRef(true);
  const presentChildren = useRef(new Map<string | number, ReactElement>());
  const exitingChildren = useRef(new Map<string | number, ReactElement>());

  const [, forceRender] = useState({});

  const childArray = Children.toArray(children).filter(isValidElement) as ReactElement[];

  // Render-phase diffing
  const newPresent = new Map<string | number, ReactElement>();

  childArray.forEach((child) => {
    const key = child.key;
    if (key != null) {
      newPresent.set(key, child);
    }
  });

  // Detect removed children → add to exiting
  presentChildren.current.forEach((child, key) => {
    if (!newPresent.has(key)) {
      exitingChildren.current.set(key, child);
    }
  });

  // Detect returning children → remove from exiting
  newPresent.forEach((_, key) => {
    if (exitingChildren.current.has(key)) {
      exitingChildren.current.delete(key);
    }
  });

  presentChildren.current = newPresent;

  useEffect(() => {
    isInitialRender.current = false;
  }, []);

  const handleExitComplete = (key: string | number) => {
    exitingChildren.current.delete(key);
    forceRender({});

    if (exitingChildren.current.size === 0 && onExitComplete) {
      onExitComplete();
    }
  };

  const isWaitMode = mode === "wait" || mode === "exitBeforeEnter";
  const shouldWaitForExit = isWaitMode && exitingChildren.current.size > 0;

  const allChildren: ReactElement[] = [];

  // Render present children
  if (!shouldWaitForExit) {
    presentChildren.current.forEach((child, key) => {
      const childProps = child.props as AnimatePresenceChildProps;
      const isPresenceChild = child.type === AnimatePresenceChild;

      const presenceProps = isPresenceChild ? childProps : (childProps as any);
      const renderedChild =
        isPresenceChild && isValidElement((childProps as any).children)
          ? ((childProps as any).children as ReactElement)
          : child;

      // Skip enter animation on first render if initial={false}
      const shouldSkipEnter = !initial && isInitialRender.current;

      allChildren.push(
        <AnimatedChild
          key={key}
          isPresent={true}
          enter={shouldSkipEnter ? undefined : presenceProps.enter}
          exit={presenceProps.exit}
          duration={presenceProps.duration}
          ease={presenceProps.ease}
          delay={presenceProps.delay}
        >
          {renderedChild}
        </AnimatedChild>,
      );
    });
  }

  // Render exiting children
  exitingChildren.current.forEach((child, key) => {
    const childProps = child.props as AnimatePresenceChildProps;
    const isPresenceChild = child.type === AnimatePresenceChild;

    const presenceProps = isPresenceChild ? childProps : (childProps as any);
    const renderedChild =
      isPresenceChild && isValidElement((childProps as any).children)
        ? ((childProps as any).children as ReactElement)
        : child;

    allChildren.push(
      <AnimatedChild
        key={key}
        isPresent={false}
        enter={presenceProps.enter}
        exit={presenceProps.exit}
        duration={presenceProps.duration}
        ease={presenceProps.ease}
        delay={presenceProps.delay}
        onExitComplete={() => handleExitComplete(key)}
        popLayout={mode === "popLayout"}
      >
        {renderedChild}
      </AnimatedChild>,
    );
  });

  return <>{allChildren}</>;
}

// =============================================================================
// AnimatePresenceChild — declarative wrapper
// =============================================================================

export function AnimatePresenceChild({
  children,
}: AnimatePresenceChildProps & { children: ReactElement }) {
  return children;
}

export default AnimatePresence;
