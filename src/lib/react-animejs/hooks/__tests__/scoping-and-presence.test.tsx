import React from "react";
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("animejs", () => {
  const animateCalls: Array<{
    target: unknown;
    config: Record<string, any>;
    instance: Record<string, any>;
  }> = [];
  const onScrollCalls: Array<{
    config: Record<string, any>;
    instance: Record<string, any>;
  }> = [];
  const timelineCalls: Array<{
    config: Record<string, any>;
    instance: Record<string, any>;
  }> = [];
  const waapiCalls: Array<{
    target: unknown;
    config: Record<string, any>;
    instance: Record<string, any>;
  }> = [];

  const createAnimationInstance = (config: Record<string, any> = {}) => {
    const instance: Record<string, any> = {
      id: "mock-animation",
      progress: 0,
      currentTime: 0,
      duration: Number(config.duration || 0),
      paused: config.autoplay === false,
      began: config.autoplay !== false,
      completed: false,
      reversed: false,
      backwards: false,
      deltaTime: 0,
      iterationCurrentTime: 0,
      iterationProgress: 0,
      speed: 1,
      fps: 60,
      labels: {},
      playbackRate: 1,
      play() {
        this.paused = false;
        this.began = true;
        return this;
      },
      pause() {
        this.paused = true;
        config.onPause?.(this);
        return this;
      },
      resume() {
        this.paused = false;
        return this;
      },
      restart() {
        this.paused = false;
        this.began = true;
        this.completed = false;
        this.currentTime = 0;
        return this;
      },
      reverse() {
        this.reversed = !this.reversed;
        return this;
      },
      alternate() {
        this.reversed = !this.reversed;
        return this;
      },
      complete() {
        this.completed = true;
        this.paused = true;
        config.onComplete?.(this);
        return this;
      },
      reset() {
        this.currentTime = 0;
        this.progress = 0;
        this.completed = false;
        this.paused = true;
        return this;
      },
      cancel() {
        this.paused = true;
        this.currentTime = 0;
        return this;
      },
      revert() {
        this.paused = true;
        this.currentTime = 0;
        return this;
      },
      refresh() {
        return this;
      },
      seek(time: number | string) {
        this.currentTime = typeof time === "number" ? time : Number.parseFloat(time);
        return this;
      },
      stretch(duration: number) {
        this.duration = duration;
        return this;
      },
      then(callback?: (anim: typeof instance) => void) {
        callback?.(this);
        return Promise.resolve(this);
      },
    };
    return instance;
  };

  const createScrollObserverInstance = (config: Record<string, any> = {}) => {
    const instance: Record<string, any> = {
      id: config.id ?? `observer-${onScrollCalls.length + 1}`,
      target: config.target ?? null,
      container: config.container ?? document.body,
      ready: true,
      began: false,
      completed: false,
      reverted: false,
      isInView: false,
      velocity: 0,
      backward: false,
      scroll: 0,
      progress: 0,
      offset: 0,
      offsetStart: 0,
      offsetEnd: 100,
      distance: 100,
      link: vi.fn(function (this: Record<string, any>) {
        return this;
      }),
      refresh: vi.fn(function (this: Record<string, any>) {
        return this;
      }),
      revert: vi.fn(function (this: Record<string, any>) {
        this.reverted = true;
        return this;
      }),
      trigger(callbackName: string, updates: Record<string, unknown> = {}) {
        Object.assign(this, updates);
        config[callbackName]?.(this);
        return this;
      },
    };

    onScrollCalls.push({ config, instance });
    return instance;
  };

  return {
    createScope: ({ root }: { root?: { current?: HTMLElement | null } | HTMLElement }) => {
      const resolvedRoot =
        root && typeof root === "object" && "current" in root
          ? root.current
          : root;
      return {
        root: resolvedRoot || document,
        matches: {},
        methods: {},
        add() {
          return this;
        },
        addOnce() {
          return this;
        },
        keepTime() {
          return this;
        },
        refresh() {
          return this;
        },
        revert() {
          return this;
        },
      };
    },
    animate: (target: unknown, config: Record<string, any>) => {
      const instance = createAnimationInstance(config);
      animateCalls.push({ target, config, instance });
      config.onBegin?.(instance);
      return instance;
    },
    createTimeline: (config: Record<string, any>) => {
      const instance: Record<string, any> = {
        ...createAnimationInstance(config),
        addCalls: [] as Array<{ target: unknown; params: unknown; position: unknown }>,
        setCalls: [] as Array<{ target: unknown; params: unknown; position: unknown }>,
        removeCalls: [] as Array<{ target: unknown; propertyOrPosition: unknown }>,
        syncCalls: [] as Array<{ target: unknown; position: unknown }>,
        add(targetOrParams: unknown, paramsOrPosition?: unknown, maybePosition?: unknown) {
          if (maybePosition !== undefined || arguments.length > 2) {
            this.addCalls.push({
              target: targetOrParams,
              params: paramsOrPosition,
              position: maybePosition,
            });
          } else {
            this.addCalls.push({
              target: null,
              params: targetOrParams,
              position: paramsOrPosition,
            });
          }
          return this;
        },
        set(target: unknown, params: unknown, position: unknown) {
          this.setCalls.push({ target, params, position });
          return this;
        },
        remove(target: unknown, propertyOrPosition: unknown) {
          this.removeCalls.push({ target, propertyOrPosition });
          return this;
        },
        sync(...args: [target: unknown, position: unknown]) {
          this.syncCalls.push({
            target: args[0],
            position: args[1],
          });
          return this;
        },
        call() {
          return this;
        },
        label() {
          return this;
        },
        init() {
          return this;
        },
      };
      timelineCalls.push({ config, instance });
      config.onBegin?.(instance);
      return instance;
    },
    waapi: {
      animate: (target: unknown, config: Record<string, any>) => {
        const instance = createAnimationInstance(config);
        waapiCalls.push({ target, config, instance });
        config.onBegin?.(instance);
        return instance;
      },
      convertEase: () => "linear()",
    },
    stagger: () => 0,
    onScroll: (config: Record<string, any>) =>
      createScrollObserverInstance(config),
    utils: {},
    __mock: {
      animateCalls,
      onScrollCalls,
      timelineCalls,
      waapiCalls,
      reset() {
        animateCalls.length = 0;
        onScrollCalls.length = 0;
        timelineCalls.length = 0;
        waapiCalls.length = 0;
      },
      completeAll() {
        animateCalls.forEach(({ instance, config }) => {
          instance.completed = true;
          instance.paused = true;
          config.onComplete?.(instance);
        });
      },
    },
  };
});

// Vitest mock helper — declared so TypeScript accepts the import
// even though animejs doesn't export __mock at runtime.
declare module "animejs" {
  interface AnimeMockCall {
    target: unknown;
    config: Record<string, any>;
    instance: Record<string, any>;
  }
  interface AnimeMockData {
    animateCalls: AnimeMockCall[];
    onScrollCalls: AnimeMockCall[];
    timelineCalls: AnimeMockCall[];
    waapiCalls: AnimeMockCall[];
    reset: () => void;
    completeAll: () => void;
  }
  const __mock: AnimeMockData;
}
import { __mock } from "animejs";
import { AnimeTimeline } from "../../components/AnimeTimeline";
import { AnimeWAAPI } from "../../components/AnimeWAAPI";
import { AnimePresence, AnimePresenceChild } from "../../components/AnimePresence";
import {
  AnimeProvider,
  ScopeContext,
  useScopeContext as useProviderScope,
} from "../../core/scope-context";
import { useAnime } from "../use-anime";
import { useAnimeControls } from "../use-anime-controls";
import { useAnimeTimeline } from "../use-anime-timeline";
import { useAnimeWAAPI } from "../use-anime-waapi";

afterEach(() => {
  __mock.reset();
  document.body.innerHTML = "";
});

function createScopedWrapper(root: HTMLElement) {
  const rootRef = { current: root };
  const registerCleanup = () => () => {};
  return function ScopedWrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <ScopeContext.Provider
        value={{
          scope: null,
          rootRef,
          isScoped: true,
          registerCleanup,
          matches: {},
        }}
      >
        {children}
      </ScopeContext.Provider>
    );
  };
}

describe("scoped selector handling", () => {
  it("unregisters replaced scoped cleanups", async () => {
    const root = document.createElement("div");
    const target = document.createElement("div");
    root.appendChild(target);
    document.body.appendChild(root);
    const cleanups = new Set<() => void>();

    function ScopedWrapper({ children }: { children: React.ReactNode }) {
      return (
        <ScopeContext.Provider
          value={{
            scope: null,
            rootRef: { current: root },
            isScoped: true,
            registerCleanup: (cleanup) => {
              cleanups.add(cleanup);
              return () => cleanups.delete(cleanup);
            },
            matches: {},
          }}
        >
          {children}
        </ScopeContext.Provider>
      );
    }

    const { rerender, unmount } = renderHook(
      ({ duration }) => useAnime({ targets: target, duration }),
      { initialProps: { duration: 200 }, wrapper: ScopedWrapper },
    );

    await waitFor(() => expect(cleanups.size).toBe(1));

    rerender({ duration: 400 });
    await waitFor(() => expect(cleanups.size).toBe(1));

    unmount();
    expect(cleanups.size).toBe(0);
  });

  it("registers useAnime instances with shared controllers", async () => {
    const target = document.createElement("div");
    document.body.appendChild(target);

    const { result, unmount } = renderHook(() => {
      const controller = useAnimeControls();
      const animation = useAnime({
        targets: target,
        duration: 300,
        controller,
      });

      return { controller, animation };
    });

    await waitFor(() => {
      expect(result.current.animation.isReady).toBe(true);
      expect(result.current.controller.getAnimations()).toHaveLength(1);
    });

    act(() => {
      result.current.controller.pause();
    });

    expect(result.current.animation.state.paused).toBe(true);

    unmount();

    expect(result.current.controller.getAnimations()).toHaveLength(0);
  });

  it("recreates useAnime animations when playback options change", async () => {
    const target = document.createElement("div");
    document.body.appendChild(target);

    const { result, rerender } = renderHook(
      ({ duration, ease }: { duration: number; ease: string }) =>
        useAnime({
          targets: target,
          autoplay: true,
          duration,
          ease,
        }),
      {
        initialProps: {
          duration: 300,
          ease: "linear",
        },
      },
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
      expect(__mock.animateCalls).toHaveLength(1);
    });

    rerender({ duration: 600, ease: "outQuad" });

    await waitFor(() => {
      expect(__mock.animateCalls).toHaveLength(2);
    });

    expect(__mock.animateCalls[1].config.duration).toBe(600);
    expect(__mock.animateCalls[1].config.ease).toBe("outQuad");
  });

  it("recreates useAnime animations when caller dependencies change shape", async () => {
    const target = document.createElement("div");
    document.body.appendChild(target);

    const { result, rerender } = renderHook(
      ({ deps }: { deps: unknown[] }) =>
        useAnime({ targets: target, duration: 300, deps }),
      { initialProps: { deps: ["initial"] } },
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
      expect(__mock.animateCalls).toHaveLength(1);
    });

    rerender({ deps: ["initial", "expanded"] });

    await waitFor(() => {
      expect(__mock.animateCalls).toHaveLength(2);
    });
  });

  it("supports official onScroll autoplay params in useAnime", async () => {
    const target = document.createElement("div");
    const container = document.createElement("div");
    document.body.append(container, target);

    const onEnter = vi.fn();

    const { result, unmount } = renderHook(() =>
      useAnime({
        targets: target,
        translateY: 80,
        duration: 400,
        autoplay: {
          container,
          enter: "bottom top",
          leave: "top bottom",
          sync: true,
          onEnter,
        },
      }),
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
      expect(__mock.animateCalls).toHaveLength(1);
      expect(__mock.onScrollCalls).toHaveLength(1);
    });

    const observer = __mock.onScrollCalls[0].instance;

    expect(__mock.onScrollCalls[0].config.target).toBe(target);
    expect(__mock.onScrollCalls[0].config.container).toBe(container);
    expect(__mock.animateCalls[0].config.autoplay).toBe(observer);
    expect(result.current.scrollObserver.current).toBe(observer);
    expect(observer.link).toHaveBeenCalledWith(__mock.animateCalls[0].instance);
    expect(observer.refresh).toHaveBeenCalled();

    act(() => {
      observer.trigger("onEnter", { isInView: true, progress: 0.3 });
    });

    expect(onEnter).toHaveBeenCalledTimes(1);

    unmount();

    expect(observer.revert).toHaveBeenCalled();
  });

  it("creates autoplay scroll observers from mounted refs", async () => {
    function Probe() {
      const containerRef = React.useRef<HTMLDivElement>(null);
      const { ref, isReady, scrollObserver } = useAnime<HTMLDivElement>({
        translateY: 80,
        autoplay: {
          container: containerRef,
          enter: "top bottom",
          leave: "bottom top",
          sync: true,
        },
      });

      return (
        <div ref={containerRef}>
          <div ref={ref} data-testid="target" />
          <span data-testid="ready">{String(isReady)}</span>
          <span data-testid="observer">{String(Boolean(scrollObserver.current))}</span>
        </div>
      );
    }

    render(<Probe />);

    await waitFor(() => {
      expect(__mock.animateCalls.length).toBeGreaterThan(0);
      expect(__mock.onScrollCalls.length).toBeGreaterThan(0);
    });

    const latestAnimation = __mock.animateCalls.at(-1)!;
    const latestObserver = __mock.onScrollCalls.at(-1)!;

    expect(latestObserver.config.target).toBeInstanceOf(HTMLDivElement);
    expect(latestObserver.config.container).toBeInstanceOf(HTMLDivElement);
    expect(latestObserver.instance.link).toHaveBeenCalledWith(
      latestAnimation.instance,
    );
  });

  it("reverts owned scroll observers when controls.revert is called", async () => {
    const target = document.createElement("div");
    document.body.appendChild(target);

    const { result } = renderHook(() =>
      useAnime({
        targets: target,
        autoplay: {
          enter: "bottom top",
          leave: "top bottom",
        },
      }),
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
      expect(__mock.onScrollCalls).toHaveLength(1);
    });

    const observer = __mock.onScrollCalls[0].instance;

    act(() => {
      result.current.controls.revert();
    });

    expect(observer.revert).toHaveBeenCalled();
    expect(result.current.scrollObserver.current).toBeNull();
  });

  it("scopes useAnime string targets to the active root", async () => {
    const root = document.createElement("div");
    root.innerHTML = '<div class="item" data-testid="inside"></div>';
    document.body.appendChild(root);

    const outside = document.createElement("div");
    outside.className = "item";
    outside.dataset.testid = "outside";
    document.body.appendChild(outside);

    const wrapper = createScopedWrapper(root);

    const { result } = renderHook(() => useAnime({ targets: ".item" }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    const [{ target }] = __mock.animateCalls;
    expect(Array.from(target as NodeListOf<Element>)).toEqual([
      root.querySelector(".item"),
    ]);
  });

  it("scopes timeline entries and dynamic additions to the active root", async () => {
    const root = document.createElement("div");
    root.innerHTML = '<div class="item" data-testid="inside"></div>';
    document.body.appendChild(root);

    const outside = document.createElement("div");
    outside.className = "item";
    document.body.appendChild(outside);

    const wrapper = createScopedWrapper(root);

    const { result } = renderHook(
      () =>
        useAnimeTimeline({}, [
          { targets: ".item", opacity: [0, 1], duration: 200 },
        ]),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    const timelineInstance = __mock.timelineCalls[0].instance;
    expect(Array.from(timelineInstance.addCalls[0].target as NodeListOf<Element>)).toEqual([
      root.querySelector(".item"),
    ]);

    act(() => {
      result.current.controls.add({
        targets: ".item",
        translateX: 50,
      });
    });

    expect(Array.from(timelineInstance.addCalls[1].target as NodeListOf<Element>)).toEqual([
      root.querySelector(".item"),
    ]);

    act(() => {
      result.current.controls.set(".item", { opacity: 1 });
      result.current.controls.remove(".item");
    });

    expect(Array.from(timelineInstance.setCalls[0].target as NodeListOf<Element>)).toEqual([
      root.querySelector(".item"),
    ]);
    expect(Array.from(timelineInstance.removeCalls[0].target as NodeListOf<Element>)).toEqual([
      root.querySelector(".item"),
    ]);
  });

  it("uses the latest timeline callback without recreating the timeline", async () => {
    const firstCallback = vi.fn();
    const latestCallback = vi.fn();

    const { result, rerender } = renderHook(
      ({ onComplete }) => useAnimeTimeline({ duration: 100, onComplete }),
      { initialProps: { onComplete: firstCallback } },
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    rerender({ onComplete: latestCallback });
    const [{ config, instance }] = __mock.timelineCalls;

    act(() => {
      config.onComplete?.(instance);
    });

    expect(__mock.timelineCalls).toHaveLength(1);
    expect(latestCallback).toHaveBeenCalledTimes(1);
    expect(firstCallback).not.toHaveBeenCalled();
  });

  it("unwraps sync targets passed as hook refs", async () => {
    const childTimeline = { current: { id: "child-timeline" } };

    const { result } = renderHook(() =>
      useAnimeTimeline({}, [{ target: childTimeline, position: 250 }]),
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    const timelineInstance = __mock.timelineCalls[0].instance;
    expect(timelineInstance.syncCalls).toEqual([
      { target: childTimeline.current, position: 250 },
    ]);

    act(() => {
      result.current.controls.sync(childTimeline, 500);
    });

    expect(timelineInstance.syncCalls[1]).toEqual({
      target: childTimeline.current,
      position: 500,
    });
  });

  it("scopes WAAPI string targets and keeps state in sync with controls", async () => {
    const root = document.createElement("div");
    root.innerHTML = '<div class="item" data-testid="inside"></div>';
    document.body.appendChild(root);

    const outside = document.createElement("div");
    outside.className = "item";
    document.body.appendChild(outside);

    const wrapper = createScopedWrapper(root);

    const { result } = renderHook(
      () => useAnimeWAAPI({ targets: ".item", autoplay: true, duration: 300 }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    const [{ target }] = __mock.waapiCalls;
    expect(Array.from(target as NodeListOf<Element>)).toEqual([
      root.querySelector(".item"),
    ]);

    act(() => {
      result.current.controls.pause();
    });
    expect(result.current.state.paused).toBe(true);
    expect(result.current.isPlaying).toBe(false);

    act(() => {
      result.current.controls.seek(120);
    });
    expect(result.current.state.currentTime).toBe(120);

    act(() => {
      result.current.controls.play();
    });
    expect(result.current.state.paused).toBe(false);

    act(() => {
      result.current.controls.setPlaybackRate(1.5);
      result.current.controls.setFrameRate(30);
    });
    expect(__mock.waapiCalls[0].instance.speed).toBe(1.5);
    expect(__mock.waapiCalls[0].instance.fps).toBe(30);
  });

  it("uses the latest WAAPI callback without recreating the animation", async () => {
    const root = document.createElement("div");
    root.innerHTML = '<div class="item"></div>';
    document.body.appendChild(root);

    const firstCallback = vi.fn();
    const latestCallback = vi.fn();
    const wrapper = createScopedWrapper(root);
    const { rerender } = renderHook(
      ({ onComplete }) =>
        useAnimeWAAPI({ targets: ".item", onComplete, autoplay: false }),
      { initialProps: { onComplete: firstCallback }, wrapper },
    );

    await waitFor(() => {
      expect(__mock.waapiCalls).toHaveLength(1);
    });

    rerender({ onComplete: latestCallback });
    const [{ config, instance }] = __mock.waapiCalls;

    act(() => {
      config.onComplete?.(instance);
    });

    expect(__mock.waapiCalls).toHaveLength(1);
    expect(latestCallback).toHaveBeenCalledTimes(1);
    expect(firstCallback).not.toHaveBeenCalled();
  });

  it("exposes the created provider scope through context consumers", async () => {
    function ScopeProbe() {
      const { scope } = useProviderScope();
      return (
        <div data-testid="scope-state">
          {scope ? "ready" : "missing"}
        </div>
      );
    }

    render(
      <AnimeProvider>
        <ScopeProbe />
      </AnimeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("scope-state").textContent).toBe("ready");
    });
  });
});

describe("AnimePresence modes", () => {
  it("keeps AnimePresenceChild props off the rendered child element", async () => {
    const receivedProps = vi.fn();

    const SpyChild = React.forwardRef<
      HTMLDivElement,
      { label: string }
    >(function SpyChild(props, ref) {
      receivedProps(props);
      return (
        <div ref={ref} data-testid="spy-child">
          {props.label}
        </div>
      );
    });

    render(
      <AnimePresence>
        <AnimePresenceChild
          key="spy"
          enter={{ opacity: [0, 1] }}
          exit={{ opacity: [1, 0] }}
          duration={300}
        >
          <SpyChild label="visible" />
        </AnimePresenceChild>
      </AnimePresence>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("spy-child")).not.toBeNull();
    });

    const lastProps = receivedProps.mock.lastCall?.[0];

    expect(lastProps?.label).toBe("visible");
    expect(lastProps?.enter).toBeUndefined();
    expect(lastProps?.exit).toBeUndefined();
  });

  it("wait mode delays entering children until exits finish", async () => {
    const { rerender } = render(
      <AnimePresence mode="wait">
        <AnimePresenceChild
          key="first"
          enter={{ opacity: [0, 1] }}
          exit={{ opacity: [1, 0] }}
          duration={300}
        >
          <div data-testid="first">first</div>
        </AnimePresenceChild>
      </AnimePresence>,
    );

    expect(screen.getByTestId("first")).not.toBeNull();

    rerender(
      <AnimePresence mode="wait">
        <AnimePresenceChild
          key="second"
          enter={{ opacity: [0, 1] }}
          exit={{ opacity: [1, 0] }}
          duration={300}
        >
          <div data-testid="second">second</div>
        </AnimePresenceChild>
      </AnimePresence>,
    );

    expect(screen.getByTestId("first")).not.toBeNull();
    expect(screen.queryByTestId("second")).toBeNull();

    act(() => {
      __mock.completeAll();
    });

    await waitFor(() => {
      expect(screen.queryByTestId("first")).toBeNull();
      expect(screen.getByTestId("second")).not.toBeNull();
    });
  });

  it("popLayout keeps exiting children mounted and visually anchored", async () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        x: 20,
        y: 40,
        top: 40,
        left: 20,
        bottom: 90,
        right: 120,
        width: 100,
        height: 50,
        toJSON: () => ({}),
      } as DOMRect);

    const { rerender } = render(
      <AnimePresence mode="popLayout">
        <AnimePresenceChild
          key="first"
          enter={{ opacity: [0, 1] }}
          exit={{ opacity: [1, 0] }}
          duration={300}
        >
          <div data-testid="first">first</div>
        </AnimePresenceChild>
      </AnimePresence>,
    );

    rerender(
      <AnimePresence mode="popLayout">
        <AnimePresenceChild
          key="second"
          enter={{ opacity: [0, 1] }}
          exit={{ opacity: [1, 0] }}
          duration={300}
        >
          <div data-testid="second">second</div>
        </AnimePresenceChild>
      </AnimePresence>,
    );

    await waitFor(() => {
      const first = screen.getByTestId("first") as HTMLDivElement;
      expect(first.style.position).toBe("fixed");
      expect(first.style.top).toBe("40px");
      expect(first.style.left).toBe("20px");
    });
    expect(screen.getByTestId("second")).not.toBeNull();

    rectSpy.mockRestore();
  });
});

describe("AnimeTimeline component", () => {
  it("exposes timeline state and controls through the render prop", async () => {
    const handleReady = vi.fn();

    render(
      <AnimeTimeline
        entries={[{ label: "start", position: 0 }]}
        onReady={handleReady}
      >
        {({ isReady, state }) => (
          <div data-testid="timeline-state">
            {isReady ? "ready" : "pending"}:{state.paused ? "paused" : "playing"}
          </div>
        )}
      </AnimeTimeline>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("timeline-state").textContent).toBe("ready:paused");
      expect(handleReady).toHaveBeenCalledTimes(1);
    });
  });
});

describe("AnimeWAAPI component", () => {
  it("exposes the WAAPI animation through onReady", async () => {
    const handleReady = vi.fn();

    render(
      <AnimeWAAPI autoplay={false} translateX="5rem" onReady={handleReady}>
        <div data-testid="waapi-box">box</div>
      </AnimeWAAPI>,
    );

    await waitFor(() => {
      expect(handleReady).toHaveBeenCalledTimes(1);
      expect(handleReady.mock.calls[0][0].isReady).toBe(true);
      expect(handleReady.mock.calls[0][0].animation).not.toBeNull();
    });
  });
});
