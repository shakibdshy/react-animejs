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
  const needsAutoSize = hasAutoSize(rawAnimationProps);

  // Resolve 'auto' size values synchronously during render. nodeRef.current is
  // valid on every render after the first commit (the ref callback fires during
  // commit). So when isPresent flips (triggering a re-render), the measured
  // height is immediately available — no async state round-trip, no race
  // between resolution and controls.restart().
  //
  // On the very first render nodeRef.current is null, so we can't measure yet.
  // We use a tick state to force one re-render after mount, which gives the ref
  // a chance to populate. After that, all renders have a valid measurement.
  const [measured, setMeasured] = useState(false);
  useLayoutEffect(() => {
    if (needsAutoSize && !measured) setMeasured(true);
  }, [needsAutoSize, measured]);

  const animationProps = needsAutoSize
    ? resolveAutoSize(rawAnimationProps, measured ? nodeRef.current : null)
    : rawAnimationProps;

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

  // After the enter animation completes, release any auto-resolved size props
  // (height/width) back to 'auto' so layout stays fluid if content or the
  // viewport resizes later. The animation has already set the final value;
  // switching to 'auto' preserves the visual size while allowing reflow.
  useEffect(() => {
    if (isPresent && state.completed && needsAutoSize && nodeRef.current) {
      const el = nodeRef.current;
      for (const prop of AUTO_SIZE_PROPS) {
        const val = animationProps?.[prop as AutoSizeProp];
        // Only release if this prop was auto-resolved (it's now a number).
        if (typeof val === "number") {
          if (prop === "height" || prop === "maxHeight" || prop === "minHeight") {
            el.style.height = "auto";
          }
        }
      }
    }
  }, [isPresent, state.completed, needsAutoSize, animationProps]);

  // Track whether the exit animation has started. state.completed carries over
  // from the enter animation, so we can't rely on it alone to know the EXIT
  // finished. We reset this ref when isPresent flips to false, and set it
  // once controls.restart() fires the exit animation.
  const exitStartedRef = useRef(false);

  // Reset exit tracking when the child becomes present again (re-entering).
  useEffect(() => {
    if (isPresent) {
      exitStartedRef.current = false;
    }
  }, [isPresent]);

  // Handle exit animation completion — only unmount after the EXIT animation
  // has actually started AND completed, not from stale enter-completed state.
  useEffect(() => {
    if (!isPresent && exitStartedRef.current && state.completed) {
      setShouldRender(false);
      onExitComplete?.();
    }
  }, [isPresent, state.completed, onExitComplete]);

  // Play exit animation when removed. The animation props have already been
  // resolved synchronously during render (including 'auto' → measured pixels
  // for the exit keyframes), so just restart to play them.
  useEffect(() => {
    if (!isPresent && shouldRender) {
      exitStartedRef.current = true;
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
