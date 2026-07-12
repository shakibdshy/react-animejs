/**
 * AnimeLayout - Extensive, robust, and reusable Layout Animation Component
 *
 * Built on top of useAnimeLayout hook, providing a declarative way to create
 * layout animations without needing to use the hook directly.
 *
 * Features:
 * - All layout settings (children, duration, ease, delay, properties)
 * - All states (enterFrom, leaveTo, swapAt)
 * - All methods exposed via ref (record, animate, update, revert)
 * - All callbacks (onBegin, onComplete, onUpdate, etc.)
 * - Automatic animation on children changes (optional)
 * - AnimeLayout.Item sub-component for individual items
 */

import React, {
  createContext,
  type CSSProperties,
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { animate } from "animejs";
import { useAnimeLayout } from "../hooks";
import { shallowEqual } from "../core";
import type {
  AutoLayout,
  LayoutAnimationParams,
  UseAnimeLayoutControls,
} from "../types";
import type { AnimationState } from "../types/common";
import type { Timeline } from "../types/timeline";

// =============================================================================
// Types
// =============================================================================

/**
 * Layout animation mode
 */
export type AnimeLayoutMode =
  | "manual" // User controls when animations happen
  | "auto"; // Auto-animate on children changes

export interface AnimeTransformProperties {
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotate?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  scale?: number | string;
  scaleX?: number | string;
  scaleY?: number | string;
  scaleZ?: number | string;
  skew?: number | string;
  skewX?: number | string;
  skewY?: number | string;
  perspective?: number | string;
}

/**
 * Animation parameters for enter/leave/swap states
 */
export interface AnimeLayoutStateParams {
  /** Initial state for entering elements */
  enterFrom?: Partial<CSSProperties> & AnimeTransformProperties & {
    duration?: number;
    ease?: string;
    delay?: number;
  };
  /** Final state for leaving elements */
  leaveTo?: Partial<CSSProperties> & AnimeTransformProperties & {
    duration?: number;
    ease?: string;
    delay?: number;
  };
  /** Intermediate state during swap */
  swapAt?: Partial<CSSProperties> & AnimeTransformProperties;
}

/**
 * Callback types for layout component
 */
export interface AnimeLayoutCallbacks {
  /** Called when animation begins */
  onBegin?: (timeline: Timeline) => void;
  /** Called when animation completes */
  onComplete?: (timeline: Timeline) => void;
  /** Called on each animation update */
  onUpdate?: (timeline: Timeline) => void;
  /** Called on each render frame */
  onRender?: (timeline: Timeline) => void;
  /** Called before animation update */
  onBeforeUpdate?: (timeline: Timeline) => void;
  /** Called when animation loops */
  onLoop?: (timeline: Timeline) => void;
  /** Called when animation pauses */
  onPause?: (timeline: Timeline) => void;
}

/**
 * Props for AnimeLayout component
 */
export interface AnimeLayoutProps
  extends AnimeLayoutStateParams, AnimeLayoutCallbacks {
  /** Child elements to animate */
  children: ReactNode;

  /** CSS selector for children to animate (default: '.anime-layout-item') */
  childrenSelector?: string;

  /** Animation mode: 'manual' or 'auto' */
  mode?: AnimeLayoutMode;

  /** Whether the layout animation is enabled */
  enabled?: boolean;

  /** Wrapper element type */
  as?: ElementType;

  /** Additional CSS class for wrapper */
  className?: string;

  /** Inline styles for wrapper */
  style?: CSSProperties;

  /** Animation duration in milliseconds */
  duration?: number;

  /** Easing function */
  ease?: string;

  /** Animation delay */
  delay?: number | ((el: Element, i: number, total: number) => number);

  /** Additional CSS properties to animate */
  properties?: string[];

  /** Autoplay the animation */
  autoplay?: boolean;

  /** Callback when layout is ready */
  onReady?: (controls: AnimeLayoutRef) => void;

  /**
   * Called whenever the reactive animation state *meaningfully* changes.
   *
   * Gated by shallow equality, so it fires on real transitions (begin,
   * complete, pause) — not on every animation frame. During playback this
   * still emits once per frame because `progress`/`currentTime` change each
   * tick; bind it to a ref or throttle if you drive React state from it.
   */
  onStateChange?: (state: AnimationState) => void;

  onLayoutChange?: (info: {
    entering: Element[];
    leaving: Element[];
    swapping: Element[];
    animating: Element[];
  }) => void;

  /** Additional HTML attributes for the wrapper */
  wrapperProps?: Omit<
    HTMLAttributes<HTMLElement>,
    "className" | "style" | "children"
  >;

  /** Dependencies to trigger re-initialization */
  deps?: unknown[];
}

/**
 * Ref interface for AnimeLayout - exposes all controls and state
 */
export interface AnimeLayoutRef extends UseAnimeLayoutControls {
  /** Current animation state */
  state: AnimationState;

  /** Whether the layout is ready */
  isReady: boolean;

  /** Whether animation is currently running */
  isAnimating: boolean;

  /** The underlying AutoLayout instance */
  layout: AutoLayout | null;

  /** Current animation timeline */
  timeline: Timeline | null;

  /** Elements currently entering */
  entering: Element[];

  /** Elements currently leaving */
  leaving: Element[];

  /** Elements currently swapping position */
  swapping: Element[];

  /** Elements currently animating */
  animating: Element[];

  /** Force a layout animation with current settings */
  refresh: (params?: LayoutAnimationParams) => Timeline | null;

  /** Get the root DOM element */
  getElement: () => HTMLElement | null;
}

/**
 * Context for AnimeLayout.Item components
 */
interface AnimeLayoutContextValue {
  registerItem: (element: HTMLElement | null, id: string) => void;
  unregisterItem: (id: string) => void;
}

const AnimeLayoutContext = createContext<AnimeLayoutContextValue | null>(null);

// =============================================================================
// AnimeLayout.Item Component
// =============================================================================

export interface AnimeLayoutItemProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "className" | "style" | "children"
> {
  children: ReactNode;
  /** Unique identifier for this item (used for layout-id tracking) */
  layoutId?: string;
  /** CSS class for the item */
  className?: string;
  /** Inline styles for the item */
  style?: CSSProperties;
  /** Element type to render */
  as?: ElementType;
}

/**
 * AnimeLayout.Item - Individual item within an AnimeLayout
 *
 * Use this to wrap items that should participate in layout animations.
 */
export const AnimeLayoutItem = forwardRef<HTMLElement, AnimeLayoutItemProps>(
  function AnimeLayoutItem(
    {
      children,
      layoutId,
      className = "",
      style,
      as: Component = "div",
      ...rest
    },
    ref,
  ) {
    const context = useContext(AnimeLayoutContext);
    const internalRef = useRef<HTMLElement>(null);
    // SSR-safe stable id (React 18+). Falls back to a per-instance suffix only
    // when no explicit layoutId is provided, avoiding server/client mismatch.
    const reactId = useId();
    const id = useMemo(
      () => layoutId || `layout-item-${reactId}`,
      [layoutId, reactId],
    );

    // Register with parent AnimeLayout
    useEffect(() => {
      const element = internalRef.current;
      if (element && context) {
        // Set layout-id data attribute for Anime.js tracking
        if (layoutId) {
          element.dataset.layoutId = layoutId;
        }
        context.registerItem(element, id);
        return () => context.unregisterItem(id);
      }
    }, [context, id, layoutId]);

    // Merge refs
    const mergedRef = useCallback(
      (node: HTMLElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      [ref],
    );

    const Element = Component as React.ElementType;

    return (
      <Element
        ref={mergedRef}
        className={`anime-layout-item ${className}`.trim()}
        style={style}
        data-layout-id={layoutId}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);

// =============================================================================
// AnimeLayout Component
// =============================================================================

/**
 * AnimeLayout - Extensive layout animation component
 *
 * @example
 * ```tsx
 * // Basic usage with automatic animations
 * function Gallery({ items }) {
 *   return (
 *     <AnimeLayout
 *       mode="auto"
 *       duration={600}
 *       ease="outExpo"
 *       enterFrom={{ opacity: 0, transform: 'scale(0.8)' }}
 *       leaveTo={{ opacity: 0, transform: 'scale(0.8)' }}
 *       className="grid grid-cols-3 gap-4"
 *     >
 *       {items.map(item => (
 *         <AnimeLayout.Item key={item.id} layoutId={item.id}>
 *           <div className="card">{item.content}</div>
 *         </AnimeLayout.Item>
 *       ))}
 *     </AnimeLayout>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Manual control with ref
 * function ControlledLayout() {
 *   const layoutRef = useRef<AnimeLayoutRef>(null);
 *   const [cols, setCols] = useState(3);
 *
 *   const changeColumns = (newCols: number) => {
 *     layoutRef.current?.update(
 *       (layout) => {
 *         const root = layout.root as HTMLElement;
 *         root.style.gridTemplateColumns = `repeat(${newCols}, 1fr)`;
 *       },
 *       { duration: 500, ease: 'outExpo' }
 *     );
 *     setCols(newCols);
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={() => changeColumns(2)}>2 Columns</button>
 *       <button onClick={() => changeColumns(4)}>4 Columns</button>
 *       <AnimeLayout ref={layoutRef} className="grid gap-4">
 *         {items.map(item => (
 *           <AnimeLayout.Item key={item.id}>{item.name}</AnimeLayout.Item>
 *         ))}
 *       </AnimeLayout>
 *     </>
 *   );
 * }
 * ```
 */
export const AnimeLayout = forwardRef<AnimeLayoutRef, AnimeLayoutProps>(
  function AnimeLayout(
    {
      children,
      childrenSelector,
      mode = "manual",
      enabled = true,
      as: Component = "div",
      className = "",
      style,
      wrapperProps,
      deps = [],
      onReady,
      onStateChange,
      onLayoutChange,
      // Layout settings
      duration,
      ease,
      delay,
      properties,
      autoplay,
      // States
      enterFrom,
      leaveTo,
      swapAt,
      // Callbacks
      onBegin,
      onComplete,
      onUpdate,
      onRender,
      onBeforeUpdate,
      onLoop,
      onPause,
    },
    ref,
  ) {
    // Track registered items
    const itemsRef = useRef<Map<string, HTMLElement>>(new Map());
    const prevChildrenRef = useRef<ReactNode>(null);
    const readyNotifiedRef = useRef(false);

    // Use the layout hook
    const {
      ref: rootRef,
      controls,
      state,
      layout,
      timeline,
      isReady,
      isAnimating,
      entering,
      leaving,
      swapping,
      animating,
    } = useAnimeLayout<HTMLDivElement>({
      children: childrenSelector || ".anime-layout-item",
      duration,
      ease,
      delay: delay as number | undefined,
      properties,
      autoplay,
      enabled,
      deps,
      onBegin: onBegin as ((instance: unknown) => void) | undefined,
      onComplete: onComplete as ((instance: unknown) => void) | undefined,
      onUpdate: onUpdate as ((instance: unknown) => void) | undefined,
      onRender: onRender as ((instance: unknown) => void) | undefined,
      onBeforeUpdate: onBeforeUpdate as
        | ((instance: unknown) => void)
        | undefined,
      onLoop: onLoop as ((instance: unknown) => void) | undefined,
      onPause: onPause as ((instance: unknown) => void) | undefined,
    });

    // Build animation params with states
    const buildAnimationParams = useCallback(
      (overrides?: LayoutAnimationParams): LayoutAnimationParams => {
        const params: LayoutAnimationParams = { ...overrides };

        if (enterFrom && !params.enterFrom) {
          params.enterFrom = enterFrom as LayoutAnimationParams["enterFrom"];
        }
        if (leaveTo && !params.leaveTo) {
          params.leaveTo = leaveTo as LayoutAnimationParams["leaveTo"];
        }
        if (swapAt && !params.swapAt) {
          params.swapAt = swapAt as LayoutAnimationParams["swapAt"];
        }

        return params;
      },
      [enterFrom, leaveTo, swapAt],
    );

    // Extended controls with state params
    const extendedUpdate = useCallback(
      (
        callback: (layout: AutoLayout) => void,
        params?: LayoutAnimationParams,
      ) => {
        return controls.update(callback, buildAnimationParams(params));
      },
      [controls, buildAnimationParams],
    );

    const extendedAnimate = useCallback(
      (params?: LayoutAnimationParams) => {
        return controls.animate(buildAnimationParams(params));
      },
      [controls, buildAnimationParams],
    );

    // Refresh method - force animation with current state
    const refresh = useCallback(
      (params?: LayoutAnimationParams) => {
        return controls.update(() => {
          // No DOM changes, just re-calculate positions
        }, buildAnimationParams(params));
      },
      [controls, buildAnimationParams],
    );

    // Get element method
    const getElement = useCallback(() => rootRef.current, [rootRef]);

    // Build the ref object
    const refValue: AnimeLayoutRef = useMemo(
      () => ({
        record: controls.record,
        animate: extendedAnimate,
        update: extendedUpdate,
        revert: controls.revert,
        state,
        isReady,
        isAnimating,
        layout,
        timeline,
        entering,
        leaving,
        swapping,
        animating,
        refresh,
        getElement,
      }),
      [
        controls,
        extendedAnimate,
        extendedUpdate,
        state,
        isReady,
        isAnimating,
        layout,
        timeline,
        entering,
        leaving,
        swapping,
        animating,
        refresh,
        getElement,
      ],
    );

    // Expose ref
    useImperativeHandle(ref, () => refValue, [refValue]);

    // Notify when ready
    useEffect(() => {
      if (isReady && onReady && !readyNotifiedRef.current) {
        onReady(refValue);
        readyNotifiedRef.current = true;
      }
    }, [isReady, onReady, refValue]);

    // Reset ready notification when disabled
    useEffect(() => {
      if (!enabled) {
        readyNotifiedRef.current = false;
      }
    }, [enabled]);

    // Notify on meaningful state changes. Shallow equality suppresses the
    // reference-only updates that `extractAnimationState` produces on internal
    // ticks where nothing observable changed (e.g. an idle layout re-render).
    const lastNotifiedStateRef = useRef<AnimationState>(state);
    useEffect(() => {
      if (!onStateChange) return;
      if (shallowEqual(lastNotifiedStateRef.current, state)) return;
      lastNotifiedStateRef.current = state;
      onStateChange(state);
    }, [state, onStateChange]);

    // Notify on layout changes
    useEffect(() => {
      if (entering.length > 0 || leaving.length > 0 || swapping.length > 0 || animating.length > 0) {
        onLayoutChange?.({ entering, leaving, swapping, animating });
      }
    }, [entering, leaving, swapping, animating, onLayoutChange]);

    // FLIP baseline: each item's position from the previous commit. Captured
    // at the END of every layout effect (with transforms cleared, so leftover
    // translate from the previous animation can't pollute the measurement),
    // giving the next children change a valid "first" state to diff against.
    const prevRectsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

    const measureBaseline = useCallback(() => {
      const baseline = new Map<string, { x: number; y: number }>();
      itemsRef.current.forEach((el, id) => {
        // Clear any leftover transform from a prior FLIP play so the rect we
        // record reflects the element's true committed position. anime.js may
        // write either `transform` or the individual `translate` property.
        el.style.transform = "";
        el.style.translate = "";
        const r = el.getBoundingClientRect();
        baseline.set(id, { x: r.x, y: r.y });
      });
      return baseline;
    }, []);

    // Auto-animate on children changes (when mode is 'auto').
    //
    // The previous implementation used `useEffect` + `refresh()`, but that runs
    // AFTER the browser has painted the reordered DOM, so anime.js recorded
    // identical "old" and "new" positions → zero delta → no animation. This
    // implementation does a real FLIP: diff the previous-commit rects against
    // the just-committed positions inside `useLayoutEffect` (pre-paint), invert
    // each moved item back to its old spot, then play it to its new spot.
    useLayoutEffect(() => {
      const isFirstCommit = prevChildrenRef.current === null;
      prevChildrenRef.current = children;

      // Always capture the clean baseline first (also clears stale transforms).
      const baseline = measureBaseline();

      if (mode !== "auto" || !isReady || isFirstCommit) {
        prevRectsRef.current = baseline;
        return;
      }

      const prev = prevRectsRef.current;
      const animDuration = duration ?? 500;
      const animEase = ease ?? "outExpo";

      itemsRef.current.forEach((el, id) => {
        const oldPos = prev.get(id);
        const newPos = baseline.get(id);
        if (!oldPos || !newPos) return;
        const dx = oldPos.x - newPos.x;
        const dy = oldPos.y - newPos.y;
        if (dx === 0 && dy === 0) return;

        // Play: the element is already at its new (committed) position. Animate
        // its translate from the old-position offset back to 0, so it appears
        // to glide from oldPos → newPos. Explicit keyframes keep the start
        // value unambiguous (no reliance on anime reading an inline transform).
        animate(el, {
          translateX: [dx, 0],
          translateY: [dy, 0],
          duration: animDuration,
          ease: animEase,
        });
      });

      prevRectsRef.current = baseline;
    }, [children, mode, isReady, duration, ease, measureBaseline]);

    // Context for AnimeLayout.Item
    const contextValue = useMemo<AnimeLayoutContextValue>(
      () => ({
        registerItem: (element, id) => {
          if (element) {
            itemsRef.current.set(id, element);
          }
        },
        unregisterItem: (id) => {
          itemsRef.current.delete(id);
        },
      }),
      [],
    );

    const Element = Component as React.ElementType;

    return (
      <AnimeLayoutContext.Provider value={contextValue}>
        <Element
          ref={rootRef}
          className={`anime-layout ${className}`.trim()}
          style={style}
          {...wrapperProps}
        >
          {children}
        </Element>
      </AnimeLayoutContext.Provider>
    );
  },
);

// Attach Item as a static property
(AnimeLayout as typeof AnimeLayout & { Item: typeof AnimeLayoutItem }).Item =
  AnimeLayoutItem;

// =============================================================================
// Exports
// =============================================================================

export default AnimeLayout as typeof AnimeLayout & {
  Item: typeof AnimeLayoutItem;
};
