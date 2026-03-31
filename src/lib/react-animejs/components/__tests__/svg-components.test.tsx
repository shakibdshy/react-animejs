import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  animateCalls,
  morphToMock,
  createDrawableMock,
  createMotionPathMock,
  resetMock,
} = vi.hoisted(() => {
  const animateCalls: Array<{
    target: unknown;
    config: Record<string, unknown>;
  }> = [];

  return {
    animateCalls,
    morphToMock: vi.fn(),
    createDrawableMock: vi.fn(),
    createMotionPathMock: vi.fn(),
    resetMock: () => {
      animateCalls.length = 0;
    },
  };
});

vi.mock("animejs", () => {
  const createAnimationInstance = (config: Record<string, unknown> = {}) => {
    const instance: Record<string, any> = {
      id: "svg-animation",
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
      play() {
        this.paused = false;
        return this;
      },
      pause() {
        this.paused = true;
        (config.onPause as ((anim: typeof instance) => void) | undefined)?.(this);
        return this;
      },
      resume() {
        this.paused = false;
        return this;
      },
      restart() {
        this.paused = false;
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
        (config.onComplete as ((anim: typeof instance) => void) | undefined)?.(this);
        return this;
      },
      reset() {
        this.currentTime = 0;
        return this;
      },
      cancel() {
        this.paused = true;
        return this;
      },
      revert() {
        this.paused = true;
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
    animate: (target: unknown, config: Record<string, unknown>) => {
      animateCalls.push({ target, config });
      const instance = createAnimationInstance(config);
      (config.onBegin as ((anim: typeof instance) => void) | undefined)?.(instance);
      return instance;
    },
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
    svg: {
      morphTo: morphToMock,
      createDrawable: createDrawableMock,
      createMotionPath: createMotionPathMock,
    },
    waapi: {
      convertEase: () => "linear()",
    },
    stagger: () => 0,
  };
});

import { AnimeDraw } from "../AnimeDraw";
import { AnimeMorph } from "../AnimeMorph";
import { AnimeMotionPath } from "../AnimeMotionPath";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

beforeEach(() => {
  resetMock();
  morphToMock.mockReset();
  createDrawableMock.mockReset();
  createMotionPathMock.mockReset();

  morphToMock.mockReturnValue(["from-shape", "to-shape"]);
  createDrawableMock.mockImplementation((target: unknown) => ({
    target,
    draw: "0 0",
  }));
  createMotionPathMock.mockReturnValue({
    translateX: { value: 24 },
    translateY: { value: 48 },
    rotate: { value: 90 },
  });
});

describe("SVG wrapper components", () => {
  it("AnimeMorph accepts a path string via the non-hybrid to prop", async () => {
    render(
      <svg>
        <AnimeMorph
          to="M5 5L15 15"
          precision={0.5}
          duration={1200}
          autoplay
        >
          <path d="M0 0L10 10" data-testid="morph-source" />
        </AnimeMorph>
      </svg>,
    );

    await waitFor(() => {
      expect(animateCalls.length).toBeGreaterThan(0);
    });

    expect(morphToMock).not.toHaveBeenCalled();
    expect(animateCalls.at(-1)?.config).toEqual(
      expect.objectContaining({
        d: ["M0 0L10 10", "M5 5L15 15"],
        duration: 1200,
        autoplay: true,
      }),
    );
  });

  it("AnimeDraw wraps the child with svg.createDrawable()", async () => {
    render(
      <svg>
        <AnimeDraw duration={900} draw={["0 0", "0 1"]} autoplay>
          <path d="M0 0L10 10" data-testid="draw-source" />
        </AnimeDraw>
      </svg>,
    );

    await waitFor(() => {
      expect(createDrawableMock).toHaveBeenCalledTimes(1);
      expect(animateCalls.length).toBeGreaterThan(0);
    });

    expect(createDrawableMock).toHaveBeenCalledWith(
      document.querySelector('[data-testid="draw-source"]'),
    );
    expect(animateCalls.at(-1)?.config).toEqual(
      expect.objectContaining({
        draw: ["0 0", "0 1"],
        duration: 900,
        autoplay: true,
      }),
    );
  });

  it("AnimeMotionPath accepts a path string and renders the guide internally", async () => {
    render(
      <svg>
        <AnimeMotionPath
          path="M0 0L100 100"
          offset={0.125}
          duration={2600}
          autoplay
          showPath
          pathProps={{ "data-testid": "motion-guide" }}
        >
          <g data-testid="motion-source">
            <circle cx="0" cy="0" r="4" />
          </g>
        </AnimeMotionPath>
      </svg>,
    );

    await waitFor(() => {
      expect(createMotionPathMock).toHaveBeenCalledWith(
        document.querySelector('[data-testid="motion-guide"]'),
        0.125,
      );
      expect(animateCalls.length).toBeGreaterThan(0);
    });

    expect(animateCalls.at(-1)?.config).toEqual(
      expect.objectContaining({
        translateX: { value: 24 },
        translateY: { value: 48 },
        rotate: { value: 90 },
        duration: 2600,
        autoplay: true,
      }),
    );
  });
});
