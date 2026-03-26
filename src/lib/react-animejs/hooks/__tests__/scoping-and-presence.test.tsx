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
    config: Record<string, unknown>;
    instance: Record<string, any>;
  }> = [];
  const timelineCalls: Array<{
    config: Record<string, unknown>;
    instance: Record<string, any>;
  }> = [];
  const waapiCalls: Array<{
    target: unknown;
    config: Record<string, unknown>;
    instance: Record<string, any>;
  }> = [];

  const createAnimationInstance = (config: Record<string, unknown> = {}) => {
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
    animate: (target: unknown, config: Record<string, unknown>) => {
      const instance = createAnimationInstance(config);
      animateCalls.push({ target, config, instance });
      config.onBegin?.(instance);
      return instance;
    },
    createTimeline: (config: Record<string, unknown>) => {
      const instance: Record<string, any> = {
        ...createAnimationInstance(config),
        addCalls: [] as Array<{ target: unknown; params: unknown; position: unknown }>,
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
        set() {
          return this;
        },
        remove() {
          return this;
        },
        sync() {
          this.syncCalls.push({
            target: arguments[0],
            position: arguments[1],
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
      animate: (target: unknown, config: Record<string, unknown>) => {
        const instance = createAnimationInstance(config);
        waapiCalls.push({ target, config, instance });
        config.onBegin?.(instance);
        return instance;
      },
      convertEase: () => "linear()",
    },
    stagger: () => 0,
    utils: {},
    __mock: {
      animateCalls,
      timelineCalls,
      waapiCalls,
      reset() {
        animateCalls.length = 0;
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

import { __mock } from "animejs";
import { AnimeTimeline } from "../../components/AnimeTimeline";
import { AnimatePresence, AnimatePresenceChild } from "../../components/AnimatePresence";
import { ScopeContext } from "../../core/scope-context";
import { useAnime } from "../use-anime";
import { useAnimeTimeline } from "../use-anime-timeline";
import { useAnimeWAAPI } from "../use-anime-waapi";

afterEach(() => {
  __mock.reset();
  document.body.innerHTML = "";
});

function createScopedWrapper(root: HTMLElement) {
  return function ScopedWrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <ScopeContext.Provider
        value={{
          scope: null,
          rootRef: { current: root },
          isScoped: true,
          registerCleanup: () => {},
          matches: {},
        }}
      >
        {children}
      </ScopeContext.Provider>
    );
  };
}

describe("scoped selector handling", () => {
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
  });
});

describe("AnimatePresence modes", () => {
  it("wait mode delays entering children until exits finish", async () => {
    const { rerender } = render(
      <AnimatePresence mode="wait">
        <AnimatePresenceChild
          key="first"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          duration={300}
        >
          <div data-testid="first">first</div>
        </AnimatePresenceChild>
      </AnimatePresence>,
    );

    expect(screen.getByTestId("first")).not.toBeNull();

    rerender(
      <AnimatePresence mode="wait">
        <AnimatePresenceChild
          key="second"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          duration={300}
        >
          <div data-testid="second">second</div>
        </AnimatePresenceChild>
      </AnimatePresence>,
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
      <AnimatePresence mode="popLayout">
        <AnimatePresenceChild
          key="first"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          duration={300}
        >
          <div data-testid="first">first</div>
        </AnimatePresenceChild>
      </AnimatePresence>,
    );

    rerender(
      <AnimatePresence mode="popLayout">
        <AnimatePresenceChild
          key="second"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          duration={300}
        >
          <div data-testid="second">second</div>
        </AnimatePresenceChild>
      </AnimatePresence>,
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
