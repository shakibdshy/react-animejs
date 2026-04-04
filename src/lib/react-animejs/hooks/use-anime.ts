/**
 * useAnime - Main animation hook for React
 *
 * Provides a declarative way to create animations in React components.
 * Handles lifecycle, cleanup, and state management automatically.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, createScope, onScroll } from "animejs";
import type { ScrollObserver } from "animejs";
import type {
  AnimationState,
  JSAnimation,
  PlaybackControls,
  UseAnimeOptions,
  UseAnimeReturn,
  UseAnimeScrollTriggerOptions,
} from "../types";
import {
  buildCallbackConfig,
  cleanUndefinedValues,
  DEFAULT_ANIMATION_STATE,
  extractAnimationState,
  isPlainObject,
  resolveTarget,
  safeJsonStringify,
  useAnimeScope,
} from "../core";

type ScrollObserverCallbackKey =
  | "onEnter"
  | "onLeave"
  | "onEnterForward"
  | "onLeaveForward"
  | "onEnterBackward"
  | "onLeaveBackward"
  | "onSyncEnter"
  | "onSyncLeave"
  | "onUpdate"
  | "onResize"
  | "onSyncComplete";

function normalizeSingleElement(
  target:
    | HTMLElement
    | SVGElement
    | NodeList
    | (HTMLElement | SVGElement)[]
    | null,
): HTMLElement | SVGElement | null {
  if (!target) return null;

  if (Array.isArray(target)) {
    return (target[0] as HTMLElement | SVGElement) ?? null;
  }

  if (typeof NodeList !== "undefined" && target instanceof NodeList) {
    return (target[0] as HTMLElement | SVGElement) ?? null;
  }

  return target as HTMLElement | SVGElement;
}

function isScrollObserverInstance(value: unknown): value is ScrollObserver {
  return Boolean(
    value &&
      typeof value === "object" &&
      "link" in value &&
      "refresh" in value &&
      "revert" in value,
  );
}

function isScrollTriggerOptions(
  value: UseAnimeOptions["autoplay"],
): value is UseAnimeScrollTriggerOptions {
  if (!isPlainObject(value)) return false;

  return [
    "id",
    "sync",
    "container",
    "target",
    "axis",
    "enter",
    "leave",
    "repeat",
    "debug",
    "onEnter",
    "onLeave",
    "onEnterForward",
    "onLeaveForward",
    "onEnterBackward",
    "onLeaveBackward",
    "onSyncEnter",
    "onSyncLeave",
    "onUpdate",
    "onResize",
    "onSyncComplete",
  ].some((key) => key in value);
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useAnime - Create and control animations declaratively
 *
 * @param options - Animation options including properties, playback settings, and callbacks
 * @returns Object containing ref, controls, state, and animation instance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ref, controls, state } = useAnime({
 *     translateX: 250,
 *     rotate: '1turn',
 *     duration: 1000,
 *     loop: true,
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       <button onClick={controls.play}>Play</button>
 *       <p>Progress: {Math.round(state.progress * 100)}%</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnime<T extends HTMLElement | SVGElement = HTMLElement>(
  options: UseAnimeOptions = {},
): UseAnimeReturn<T> {
  // ==========================================================================
  // Refs
  // ==========================================================================

  // Target element ref
  const targetRef = useRef<T | null>(null);

  // Animation instance ref
  const animationRef = useRef<JSAnimation | null>(null);

  // Scroll observer ref for `autoplay: onScroll(...)`
  const scrollObserverRef = useRef<ScrollObserver | null>(null);
  const ownsScrollObserverRef = useRef(false);

  // Scope ref for cleanup
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);

  // ==========================================================================
  // Context
  // ==========================================================================

  // Get parent scope context (if inside AnimeProvider)
  const scopeContext = useAnimeScope();

  // ==========================================================================
  // State
  // ==========================================================================

  // Animation state with reactive updates
  const [animationState, setAnimationState] = useState<AnimationState>(
    DEFAULT_ANIMATION_STATE,
  );

  // Ready state
  const [isReady, setIsReady] = useState(false);

  // ==========================================================================
  // Extract Options
  // ==========================================================================

  const {
    // Hook-specific options
    selector,
    targets: externalTargets,
    deps = [],
    enabled = true,
    controller,

    // Callbacks
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onBeforeUpdate,
    onLoop,
    onPause,

    // Playback settings
    delay,
    duration,
    loop,
    loopDelay,
    alternate,
    reversed,
    autoplay = false,
    frameRate,
    playbackRate,
    playbackEase,
    persist,

    // Tween params
    ease,
    round,
    modifier,
    composition,

    // Stagger
    stagger,

    // Keyframes
    keyframes,

    // Rest are animatable properties
    ...animatableProps
  } = options;

  const callbackRefs = useRef({
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onBeforeUpdate,
    onLoop,
    onPause,
  });
  callbackRefs.current = {
    onBegin,
    onComplete,
    onUpdate,
    onRender,
    onBeforeUpdate,
    onLoop,
    onPause,
  };

  const scrollObserverCallbackRefs = useRef<
    Partial<
      Record<
        ScrollObserverCallbackKey,
        ((observer: ScrollObserver) => void) | undefined
      >
    >
  >({});
  if (isScrollTriggerOptions(autoplay)) {
    scrollObserverCallbackRefs.current = {
      onEnter: autoplay.onEnter,
      onLeave: autoplay.onLeave,
      onEnterForward: autoplay.onEnterForward,
      onLeaveForward: autoplay.onLeaveForward,
      onEnterBackward: autoplay.onEnterBackward,
      onLeaveBackward: autoplay.onLeaveBackward,
      onSyncEnter: autoplay.onSyncEnter,
      onSyncLeave: autoplay.onSyncLeave,
      onUpdate: autoplay.onUpdate,
      onResize: autoplay.onResize,
      onSyncComplete: autoplay.onSyncComplete,
    };
  } else {
    scrollObserverCallbackRefs.current = {};
  }

  // ==========================================================================
  // Memoized Options
  // ==========================================================================

  // Use a ref to store the latest options without triggering re-renders
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Stability for animatable props and config
  const animatablePropsJson = useMemo(
    () => safeJsonStringify(animatableProps),
    [animatableProps],
  );
  const configJson = useMemo(
    () =>
      safeJsonStringify({
        delay,
        duration,
        loop,
        loopDelay,
        alternate,
        reversed,
        frameRate,
        playbackRate,
        persist,
        round,
        composition,
        stagger,
        keyframes,
      }),
    [
      delay,
      duration,
      loop,
      loopDelay,
      alternate,
      reversed,
      frameRate,
      playbackRate,
      persist,
      round,
      composition,
      stagger,
      keyframes,
    ],
  );
  const autoplayDependency = useMemo(() => {
    if (isScrollTriggerOptions(autoplay)) {
      return safeJsonStringify(autoplay);
    }

    return autoplay;
  }, [autoplay]);

  /**
   * Build the anime.js configuration object
   */
  const buildConfig = useCallback(() => {
    const currentOptions = optionsRef.current;
    const {
      targets: externalTargets,
      selector,
      delay,
      duration,
      loop,
      loopDelay,
      alternate,
      reversed,
      autoplay = false,
      frameRate,
      playbackRate,
      playbackEase,
      persist,
      ease,
      round,
      modifier,
      composition,
      stagger,
      keyframes,
      ...props
    } = currentOptions;

    // Resolve target
    let target: unknown = resolveTarget(
      externalTargets || targetRef,
      scopeContext.rootRef.current,
    );

    if (!target && selector && scopeContext.rootRef.current) {
      target = scopeContext.rootRef.current.querySelectorAll(selector);
    }

    if (!target) return null;

    let resolvedAutoplay = autoplay;
    let ownedScrollObserver: ScrollObserver | null = null;

    if (isScrollTriggerOptions(autoplay)) {
      const {
        container: scrollContainer,
        target: scrollTarget,
        onEnter: _onEnter,
        onLeave: _onLeave,
        onEnterForward: _onEnterForward,
        onLeaveForward: _onLeaveForward,
        onEnterBackward: _onEnterBackward,
        onLeaveBackward: _onLeaveBackward,
        onSyncEnter: _onSyncEnter,
        onSyncLeave: _onSyncLeave,
        onUpdate: _onUpdate,
        onResize: _onResize,
        onSyncComplete: _onSyncComplete,
        ...scrollObserverOptions
      } = autoplay;

      void _onEnter;
      void _onLeave;
      void _onEnterForward;
      void _onLeaveForward;
      void _onEnterBackward;
      void _onLeaveBackward;
      void _onSyncEnter;
      void _onSyncLeave;
      void _onUpdate;
      void _onResize;
      void _onSyncComplete;

      const resolvedScrollTarget = normalizeSingleElement(
        (scrollTarget
          ? resolveTarget(scrollTarget, scopeContext.rootRef.current)
          : target) as
          | HTMLElement
          | SVGElement
          | NodeList
          | (HTMLElement | SVGElement)[]
          | null,
      );
      const resolvedScrollContainer = normalizeSingleElement(
        (scrollContainer
          ? resolveTarget(scrollContainer, scopeContext.rootRef.current)
          : null) as
          | HTMLElement
          | SVGElement
          | NodeList
          | (HTMLElement | SVGElement)[]
          | null,
      );

      const wrapScrollObserverCallback = (key: ScrollObserverCallbackKey) => {
        return (observer: ScrollObserver) => {
          scrollObserverCallbackRefs.current[key]?.(observer);
        };
      };

      const observerConfig: Record<string, unknown> = {
        ...scrollObserverOptions,
        target: resolvedScrollTarget ?? undefined,
        container: resolvedScrollContainer ?? undefined,
        onEnter: wrapScrollObserverCallback("onEnter"),
        onLeave: wrapScrollObserverCallback("onLeave"),
        onEnterForward: wrapScrollObserverCallback("onEnterForward"),
        onLeaveForward: wrapScrollObserverCallback("onLeaveForward"),
        onEnterBackward: wrapScrollObserverCallback("onEnterBackward"),
        onLeaveBackward: wrapScrollObserverCallback("onLeaveBackward"),
        onSyncEnter: wrapScrollObserverCallback("onSyncEnter"),
        onSyncLeave: wrapScrollObserverCallback("onSyncLeave"),
        onUpdate: wrapScrollObserverCallback("onUpdate"),
        onResize: wrapScrollObserverCallback("onResize"),
        onSyncComplete: wrapScrollObserverCallback("onSyncComplete"),
      };

      cleanUndefinedValues(observerConfig);

      ownedScrollObserver = onScroll(observerConfig as any) as ScrollObserver;
      resolvedAutoplay = ownedScrollObserver;
    }

    // Build config object
    const config: Record<string, unknown> = {
      ...props,

      // Playback settings
      delay,
      duration,
      loop,
      loopDelay,
      alternate,
      reversed,
      autoplay: resolvedAutoplay,
      frameRate,
      playbackRate,
      playbackEase,
      persist,

      // Tween params
      ease,
      round,
      modifier,
      composition,
    };

    // Add stagger if provided
    if (stagger !== undefined) {
      config.delay = stagger;
    }

    // Add keyframes if provided
    if (keyframes) {
      config.keyframes = keyframes;
    }

    // Wrap callbacks with state updates
    const callbackConfig = buildCallbackConfig(
      setAnimationState,
      extractAnimationState,
      {
        onBegin: (anim) => callbackRefs.current.onBegin?.(anim as JSAnimation),
        onComplete: (anim) =>
          callbackRefs.current.onComplete?.(anim as JSAnimation),
        onUpdate: (anim) => callbackRefs.current.onUpdate?.(anim as JSAnimation),
        onRender: (anim) => callbackRefs.current.onRender?.(anim as JSAnimation),
        onBeforeUpdate: (anim) =>
          callbackRefs.current.onBeforeUpdate?.(anim as JSAnimation),
        onLoop: (anim) => callbackRefs.current.onLoop?.(anim as JSAnimation),
        onPause: (anim) => callbackRefs.current.onPause?.(anim as JSAnimation),
      },
      DEFAULT_ANIMATION_STATE,
    );

    // Merge callback config
    Object.assign(config, callbackConfig);

    // Clean undefined values
    cleanUndefinedValues(config);

    return {
      target,
      config,
      scrollObserver:
        ownedScrollObserver ??
        (isScrollObserverInstance(resolvedAutoplay) ? resolvedAutoplay : null),
      ownsScrollObserver: Boolean(ownedScrollObserver),
    };
  }, [scopeContext.rootRef]);

  // ==========================================================================
  // Animation Lifecycle
  // ==========================================================================

  useEffect(() => {
    // Skip if disabled
    if (!enabled) {
      scrollObserverRef.current = null;
      ownsScrollObserverRef.current = false;
      setIsReady(false);
      return;
    }

    // Wait for target to be available (if using ref)
    if (!externalTargets && !selector && !targetRef.current) {
      return;
    }

    // Create the animation
    const result = buildConfig();
    if (!result) return;

    const { target, config, scrollObserver, ownsScrollObserver } = result;
    let unregisterController: (() => void) | undefined;

    try {
      // Create animation within a scope for proper cleanup
      scopeRef.current = createScope({
        root: scopeContext.rootRef.current || undefined,
      });

      scrollObserverRef.current = scrollObserver;
      ownsScrollObserverRef.current = ownsScrollObserver;

      // Create the animation
       
      const anim = animate(target, config as any) as unknown as JSAnimation;
      animationRef.current = anim;
      unregisterController = controller?.register(anim);

      if (scrollObserver) {
        try {
          scrollObserver.link(anim as any);
          scrollObserver.refresh();
        } catch {
          // Ignore observer linking errors and let Anime.js fallback behavior apply.
        }
      }

      // Update initial state
      setAnimationState(extractAnimationState(anim));
      setIsReady(true);

      // Register cleanup with parent scope if available
      if (scopeContext.isScoped) {
        scopeContext.registerCleanup(() => {
          if (animationRef.current) {
            try {
              animationRef.current.revert();
            } catch {
              // Ignore cleanup errors
            }
          }
        });
      }
    } catch (error) {
      console.error("[react-animejs] Animation creation error:", error);
      if (ownsScrollObserver) {
        try {
          scrollObserver?.revert();
        } catch {
          // Ignore cleanup errors
        }
      }
      scrollObserverRef.current = null;
      ownsScrollObserverRef.current = false;
      setIsReady(false);
    }

    // Cleanup
    return () => {
      if (animationRef.current) {
        try {
          animationRef.current.revert();
        } catch {
          // Ignore cleanup errors
        }
        animationRef.current = null;
      }

      unregisterController?.();

      if (scopeRef.current) {
        try {
          scopeRef.current.revert();
        } catch {
          // Ignore cleanup errors
        }
        scopeRef.current = null;
      }

      if (ownsScrollObserver) {
        try {
          scrollObserver?.revert();
        } catch {
          // Ignore cleanup errors
        }
      }

      if (scrollObserverRef.current === scrollObserver) {
        scrollObserverRef.current = null;
      }
      ownsScrollObserverRef.current = false;

      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    externalTargets,
    selector,
    controller,
    scopeContext.isScoped,
    scopeContext.registerCleanup,
    scopeContext.rootRef,
    animatablePropsJson,
    configJson,
    autoplayDependency,
    ease,
    modifier,
    playbackEase,
    ...deps,
  ]);

  // ==========================================================================
  // Dynamic frameRate update
  // ==========================================================================

  useEffect(() => {
    if (animationRef.current && frameRate !== undefined) {
      // Dynamically update fps on the existing animation instance
      (animationRef.current as unknown as Record<string, unknown>).fps =
        frameRate;
    }
  }, [frameRate]);

  // ==========================================================================
  // Playback Controls
  // ==========================================================================

  const controls: PlaybackControls = useMemo(
    () => ({
      play: () => {
        if (animationRef.current) {
          animationRef.current.play();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      pause: () => {
        if (animationRef.current) {
          animationRef.current.pause();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      resume: () => {
        if (animationRef.current) {
          animationRef.current.resume();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      restart: () => {
        if (animationRef.current) {
          animationRef.current.restart();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      reverse: () => {
        if (animationRef.current) {
          animationRef.current.reverse();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      alternate: () => {
        if (animationRef.current) {
          animationRef.current.alternate();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      complete: () => {
        if (animationRef.current) {
          animationRef.current.complete();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      reset: () => {
        if (animationRef.current) {
          animationRef.current.reset();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      cancel: () => {
        if (animationRef.current) {
          animationRef.current.cancel();
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      revert: () => {
        if (animationRef.current) {
          animationRef.current.revert();
          setAnimationState(extractAnimationState(animationRef.current));
        }
        if (ownsScrollObserverRef.current) {
          try {
            scrollObserverRef.current?.revert();
          } catch {
            // Ignore cleanup errors
          }
          scrollObserverRef.current = null;
          ownsScrollObserverRef.current = false;
        }
      },
      seek: (time: number | string) => {
        if (animationRef.current) {
          animationRef.current.seek(time);
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      stretch: (newDuration: number) => {
        animationRef.current?.stretch(newDuration);
      },
      refresh: () => {
        animationRef.current?.refresh();
        if (animationRef.current) {
          setAnimationState(extractAnimationState(animationRef.current));
        }
      },
      setPlaybackRate: (rate: number) => {
        if (animationRef.current) {
          (
            animationRef.current as unknown as Record<string, unknown>
          ).playbackRate = rate;
        }
      },
      setFrameRate: (fps: number) => {
        if (animationRef.current) {
          (
            animationRef.current as unknown as Record<string, unknown>
          ).fps = fps;
        }
      },
    }),
    [],
  );

  // ==========================================================================
  // Return Value
  // ==========================================================================

  return {
    ref: targetRef,
    controls,
    state: animationState,
    // Return the ref so consumers can always access the latest animation instance
    animation: animationRef,
    scrollObserver: scrollObserverRef,
    isPlaying:
      !animationState.paused &&
      animationState.began &&
      !animationState.completed,
    isReady,
  };
}

export default useAnime;
