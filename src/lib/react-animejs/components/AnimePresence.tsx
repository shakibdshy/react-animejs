/**
 * AnimePresence - Enter/Exit animation controller
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
// Helpers
// =============================================================================

/**
 * Properties that represent size dimensions where 'auto' should be resolved to
 * a measured pixel value before being passed to anime.js (which can't
 * interpolate the string 'auto').
 */
const AUTO_SIZE_PROPS = ["height", "width", "maxHeight", "minHeight"] as const;
type AutoSizeProp = (typeof AUTO_SIZE_PROPS)[number];

/**
 * Scans an animation props object for size properties set to 'auto' and
 * replaces them with the measured pixel value from the target element.
 *
 * anime.js cannot interpolate to/from the string 'auto', so we measure the
 * element's natural content size (scrollHeight/scrollWidth) and substitute the
 * real number. This lets users write `enter={{ height: 'auto' }}` — the
 * component handles measurement transparently.
 *
 * Returns a new object; does not mutate the input.
 */
function resolveAutoSize(
  props: Record<string, unknown> | undefined,
  el: HTMLElement | null,
): Record<string, unknown> | undefined {
  if (!props || !el) return props;
  let resolved = props;
  for (const prop of AUTO_SIZE_PROPS) {
    const val = props[prop];
    if (val === "auto") {
      if (resolved === props) resolved = { ...props }; // lazy clone
      resolved[prop] =
        prop === "height" || prop === "maxHeight"
          ? el.scrollHeight
          : el.scrollWidth;
    } else if (Array.isArray(val)) {
      // Keyframe form [from, to] — resolve any 'auto' entries.
      let cloned = false;
      const newArr = val.map((v) => {
        if (v === "auto") {
          if (!cloned) {
            cloned = true;
            if (resolved === props) resolved = { ...props };
          }
          return prop === "height" || prop === "maxHeight"
            ? el.scrollHeight
            : el.scrollWidth;
        }
        return v;
      });
      if (cloned) {
        if (resolved === props) resolved = { ...props };
        (resolved as Record<string, unknown>)[prop] = newArr;
      }
    }
  }
  return resolved;
}

/**
 * Checks whether a props object contains any 'auto' size values that need
 * measuring before the animation can run.
 */
function hasAutoSize(props: Record<string, unknown> | undefined): boolean {
  if (!props) return false;
  return AUTO_SIZE_PROPS.some((prop) => {
    const val = props[prop];
    return val === "auto" || (Array.isArray(val) && val.includes("auto"));
  });
}

// =============================================================================
// Types
// =============================================================================

export interface AnimePresenceProps {
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

export interface AnimePresenceChildProps {
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
  const rawAnimationProps = isPresent ? enter : exit;

  // Resolve any 'auto' size values (height, width, etc.) to measured pixels.
  // anime.js can't interpolate 'auto', so we measure the element's natural
  // content size before the animation runs. The resolved props are re-derived
  // whenever isPresent flips (switching between enter/exit) or the node mounts.
  const [resolvedProps, setResolvedProps] = useState(rawAnimationProps);
  const needsAutoSize = hasAutoSize(rawAnimationProps);

  useLayoutEffect(() => {
    if (!needsAutoSize) {
      setResolvedProps(rawAnimationProps);
      return;
    }
    // Measure the node's natural size, then resolve 'auto' → pixels.
    // The node is rendered (shouldRender is true) by the time this runs.
    setResolvedProps(resolveAutoSize(rawAnimationProps, nodeRef.current));
    // Re-run when isPresent flips (enter↔exit) — the raw props change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent, needsAutoSize, rawAnimationProps]);

  const { ref, controls, state } = useAnime({
    ...(resolvedProps || {}),
    duration,
    ease,
    delay,
    autoplay: !needsAutoSize, // defer autoplay until measured props are ready
  });

  // Once resolved props are set (after measurement), play/restart the animation.
  // This handles both enter (mount) and exit (unmount) when auto-size is involved.
  useEffect(() => {
    if (needsAutoSize && resolvedProps !== rawAnimationProps) {
      controls.restart();
    }
  }, [needsAutoSize, resolvedProps, rawAnimationProps, controls]);

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

  // After the enter animation completes, release any auto-resolved size props
  // (height/width) back to 'auto' so layout stays fluid if content or the
  // viewport resizes later. The animation has already set the final value;
  // switching to 'auto' preserves the visual size while allowing reflow.
  useEffect(() => {
    if (isPresent && state.completed && needsAutoSize && nodeRef.current) {
      const el = nodeRef.current;
      for (const prop of AUTO_SIZE_PROPS) {
        const val = resolvedProps?.[prop as AutoSizeProp];
        // Only release if this prop was auto-resolved (it's now a number).
        if (typeof val === "number") {
          if (prop === "height" || prop === "maxHeight" || prop === "minHeight") {
            el.style.height = "auto";
          }
        }
      }
    }
  }, [isPresent, state.completed, needsAutoSize, resolvedProps]);

  // Handle exit animation completion
  useEffect(() => {
    if (!isPresent && state.completed) {
      setShouldRender(false);
      onExitComplete?.();
    }
  }, [isPresent, state.completed, onExitComplete]);

  // Play exit animation when removed. For auto-size exits, the resolution
  // effect above (line 207) handles playback after measuring. For normal
  // exits, restart the animation directly.
  useEffect(() => {
    if (!isPresent && shouldRender && !needsAutoSize) {
      controls.restart();
    }
  }, [isPresent, shouldRender, controls, needsAutoSize]);

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
// AnimePresence Component
// =============================================================================

export function AnimePresence({
  children,
  mode = "sync",
  onExitComplete,
  initial = true,
}: AnimePresenceProps) {
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
      const childProps = child.props as AnimePresenceChildProps;
      const isPresenceChild = child.type === AnimePresenceChild;

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
    const childProps = child.props as AnimePresenceChildProps;
    const isPresenceChild = child.type === AnimePresenceChild;

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
// AnimePresenceChild — declarative wrapper
// =============================================================================

export function AnimePresenceChild({
  children,
}: AnimePresenceChildProps & { children: ReactElement }) {
  return children;
}

export default AnimePresence;
