import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("animejs", () => {
  const onScrollCalls: Array<{
    config: Record<string, any>;
    instance: Record<string, any>;
  }> = [];

  const createObserverInstance = (config: Record<string, any> = {}) => {
    const instance: Record<string, any> = {
      id: config.id ?? `observer-${onScrollCalls.length + 1}`,
      target: config.target ?? null,
      container: config.container ?? document.body,
      linked: null,
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
      link: vi.fn(function (this: Record<string, any>, linked: unknown) {
        this.linked = linked;
        this.target =
          this.target ??
          ((linked as { targets?: unknown[] } | null)?.targets?.[0] ?? document.body);
        return this;
      }),
      refresh: vi.fn(function (this: Record<string, any>) {
        this.ready = true;
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
    onScroll: (config: Record<string, any> = {}) => createObserverInstance(config),
    createScope: () => ({
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
    }),
    stagger: () => 0,
    waapi: {
      convertEase: () => "linear()",
    },
    __mock: {
      onScrollCalls,
      reset() {
        onScrollCalls.length = 0;
      },
    },
  };
});

import * as animejs from "animejs";
import { useAnimeOnScroll } from "../use-anime-onscroll";

const __mock = (animejs as unknown as {
  __mock: {
    onScrollCalls: Array<{
      config: Record<string, any>;
      instance: Record<string, any>;
    }>;
    reset: () => void;
  };
}).__mock;

afterEach(() => {
  __mock.reset();
  document.body.innerHTML = "";
});

describe("useAnimeOnScroll", () => {
  it("creates a ScrollObserver for a provided target and tracks callback state", async () => {
    const target = document.createElement("div");
    document.body.appendChild(target);

    const onEnter = vi.fn();

    const { result, unmount } = renderHook(() =>
      useAnimeOnScroll({
        id: "hero-scroll",
        target,
        sync: true,
        onEnter,
      }),
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
      expect(result.current.observer).not.toBeNull();
    });

    expect(__mock.onScrollCalls).toHaveLength(1);
    expect(__mock.onScrollCalls[0].config.target).toBe(target);
    expect(__mock.onScrollCalls[0].config.sync).toBe(true);

    await act(async () => {
      __mock.onScrollCalls[0].instance.trigger("onEnter", {
        isInView: true,
        progress: 0.5,
        scroll: 240,
        velocity: 1.25,
      });
    });

    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(result.current.state.isInView).toBe(true);
    expect(result.current.progress).toBe(0.5);
    expect(result.current.scroll).toBe(240);
    expect(result.current.velocity).toBe(1.25);

    unmount();

    expect(__mock.onScrollCalls[0].instance.revert).toHaveBeenCalled();
  });

  it("links to a provided animation instance and can infer the target from it", async () => {
    const target = document.createElement("div");
    document.body.appendChild(target);

    const linked = {
      pause: vi.fn(),
      targets: [target],
    } as any;

    const { result } = renderHook(() =>
      useAnimeOnScroll({
        linked,
        sync: "play pause",
      }),
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
      expect(result.current.observer).not.toBeNull();
    });

    const observer = __mock.onScrollCalls[0].instance;

    expect(observer.link).toHaveBeenCalledWith(linked);
    expect(result.current.observer?.linked).toBe(linked);
    expect(result.current.observer?.target).toBe(target);

    const nextLinked = {
      pause: vi.fn(),
      targets: [document.createElement("div")],
    } as any;

    act(() => {
      result.current.controls.link(nextLinked);
    });

    expect(observer.link).toHaveBeenLastCalledWith(nextLinked);
  });

  it("reverts the observer through controls and resets hook state", async () => {
    const target = document.createElement("div");
    document.body.appendChild(target);

    const { result } = renderHook(() =>
      useAnimeOnScroll({
        target,
      }),
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    act(() => {
      result.current.controls.revert();
    });

    expect(result.current.observer).toBeNull();
    expect(result.current.isReady).toBe(false);
    expect(result.current.state).toEqual({
      id: "",
      progress: 0,
      scroll: 0,
      velocity: 0,
      backward: false,
      isInView: false,
      ready: false,
      began: false,
      completed: false,
      reverted: false,
      offset: 0,
      offsetStart: 0,
      offsetEnd: 0,
      distance: 0,
    });
  });
});
