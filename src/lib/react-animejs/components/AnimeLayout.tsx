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
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useAnimeLayout } from "../hooks";
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

/**
 * Animation parameters for enter/leave/swap states
 */
export interface AnimeLayoutStateParams {
  /** Initial state for entering elements */
  enterFrom?: Partial<CSSProperties> & {
    duration?: number;
    ease?: string;
    delay?: number;
  };
  /** Final state for leaving elements */
  leaveTo?: Partial<CSSProperties> & {
    duration?: number;
    ease?: string;
    delay?: number;
  };
  /** Intermediate state during swap */
  swapAt?: Partial<CSSProperties>;
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

  /** Callback when animation state changes */
  onStateChange?: (state: AnimationState) => void;

  /** Callback when elements enter/leave/swap */
  onLayoutChange?: (info: {
    entering: Element[];
    leaving: Element[];
    swapping: Element[];
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
    const id = useMemo(
      () => layoutId || `layout-item-${Math.random().toString(36).slice(2, 9)}`,
      [layoutId],
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

    // Notify on state changes
    useEffect(() => {
      onStateChange?.(state);
    }, [state, onStateChange]);

    // Notify on layout changes
    useEffect(() => {
      if (entering.length > 0 || leaving.length > 0 || swapping.length > 0) {
        onLayoutChange?.({ entering, leaving, swapping });
      }
    }, [entering, leaving, swapping, onLayoutChange]);

    // Auto-animate on children changes (when mode is 'auto')
    useEffect(() => {
      if (mode === "auto" && isReady && prevChildrenRef.current !== null) {
        // Children have changed, trigger animation
        refresh();
      }
      prevChildrenRef.current = children;
    }, [children, mode, isReady, refresh]);

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
