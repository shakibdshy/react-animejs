/**
 * Unit tests for useAnimeTimer hook
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { engine } from "animejs";
import { useAnimeTimer } from "../use-anime-timer";

afterEach(() => {
  engine.pause();
});

describe("useAnimeTimer", () => {
  describe("Basic Functionality", () => {
    it("should initialize with default state", async () => {
      const { result } = renderHook(() => useAnimeTimer({}));

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      expect(result.current.isMounted).toBe(true);
      expect(result.current.state.paused).toBe(true);
      expect(result.current.timer).not.toBeNull();
    });

    it("should become mounted after mount effect", async () => {
      const { result } = renderHook(() => useAnimeTimer({}));

      await waitFor(() => {
        expect(result.current.isMounted).toBe(true);
      });
    });

    it("should create timer instance when enabled", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({ duration: 1000, autoplay: false }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
        expect(result.current.timer).not.toBeNull();
      });
    });

    it("should not create timer when disabled", () => {
      const { result } = renderHook(() =>
        useAnimeTimer({ duration: 1000, enabled: false }),
      );

      expect(result.current.isReady).toBe(false);
      expect(result.current.timer).toBeNull();
    });
  });

  describe("Loop Count Tracking", () => {
    it("should track loop count when trackLoopCount is true", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: 3,
          autoplay: true,
          trackLoopCount: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      expect(result.current.count).toBe(0);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
      });

      expect(result.current.count).toBeGreaterThan(0);
    });

    it("should increment loop count on each loop", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 50,
          loop: 3,
          autoplay: true,
          trackLoopCount: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      const initialCount = result.current.count;

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
      });

      expect(result.current.count).toBeGreaterThan(initialCount);
    });

    it("should not track loop count when trackLoopCount is false", () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: true,
          autoplay: true,
          trackLoopCount: false,
        }),
      );

      expect(result.current.count).toBe(0);
    });

    it("should update display ref when autoUpdateRefs is true", async () => {
      const mockElement = document.createElement("span");
      document.body.appendChild(mockElement);

      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: 2,
          autoplay: true,
          trackLoopCount: true,
          autoUpdateRefs: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      act(() => {
        if (result.current.countRef.current) {
          result.current.countRef.current = mockElement;
        }
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
      });

      expect(mockElement.textContent).not.toBe("0");

      document.body.removeChild(mockElement);
    });
  });

  describe("Iteration Time Tracking", () => {
    it("should track iteration time when trackIterationTime is true", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 1000,
          loop: true,
          alternate: true,
          autoplay: true,
          trackIterationTime: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(result.current.iterationTime).toBeGreaterThan(0);
      expect(result.current.iterationTime).toBeLessThanOrEqual(1000);
    });

    it("should track iteration time correctly with alternating", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 500,
          loop: true,
          alternate: true,
          autoplay: true,
          trackIterationTime: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      const times: number[] = [];

      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
        });
        times.push(result.current.iterationTime);
      }

      times.forEach((time) => {
        expect(time).toBeGreaterThanOrEqual(0);
        expect(time).toBeLessThanOrEqual(500);
      });
    });

    it("should not track iteration time when trackIterationTime is false", () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: true,
          autoplay: true,
          trackIterationTime: false,
        }),
      );

      expect(result.current.iterationTime).toBe(0);
    });

    it("should update display ref when autoUpdateRefs is true", async () => {
      const mockElement = document.createElement("span");
      document.body.appendChild(mockElement);

      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 1000,
          loop: true,
          autoplay: true,
          trackIterationTime: true,
          autoUpdateRefs: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      act(() => {
        if (result.current.iterationTimeRef.current) {
          result.current.iterationTimeRef.current = mockElement;
        }
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(mockElement.textContent).not.toBe("0");

      document.body.removeChild(mockElement);
    });
  });

  describe("Mount State Management", () => {
    it("should handle mount state correctly", async () => {
      const { result, unmount } = renderHook(() =>
        useAnimeTimer({ duration: 1000 }),
      );

      await waitFor(() => {
        expect(result.current.isMounted).toBe(true);
      });

      unmount();
    });

    it("should prevent updates after unmount", async () => {
      const { result, unmount } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: true,
          autoplay: true,
          trackLoopCount: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      const countBeforeUnmount = result.current.count;

      unmount();

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
      });

      expect(result.current.count).toBe(countBeforeUnmount);
    });
  });

  describe("Memory Leak Prevention", () => {
    it("should clean up timer on unmount", async () => {
      const { result, unmount } = renderHook(() =>
        useAnimeTimer({ duration: 1000, autoplay: true }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      const timerBeforeUnmount = result.current.timer;

      expect(timerBeforeUnmount).not.toBeNull();
      const timer = timerBeforeUnmount as any;
      const originalCancel = timer.cancel;
      const cancelSpy = vi.fn(() => {
        originalCancel.call(timer);
      });
      timer.cancel = cancelSpy;

      unmount();

      expect(cancelSpy).toHaveBeenCalled();
    });

    it("should cancel timer on unmount", async () => {
      let cancelCalled = false;

      const { unmount } = renderHook(() =>
        useAnimeTimer({
          duration: 1000,
          autoplay: true,
          onBegin: (timer: any) => {
            const originalCancel = timer.cancel;
            timer.cancel = () => {
              cancelCalled = true;
              originalCancel.call(timer);
            };
          },
        }),
      );

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      unmount();

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(cancelCalled).toBe(true);
    });

    it("should handle multiple mount/unmount cycles", async () => {
      const { result, unmount } = renderHook(() =>
        useAnimeTimer({ duration: 100, autoplay: true, trackLoopCount: true }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      unmount();

      const { result: result2 } = renderHook(() =>
        useAnimeTimer({ duration: 100, autoplay: true, trackLoopCount: true }),
      );

      await waitFor(() => {
        expect(result2.current.isReady).toBe(true);
      });

      expect(result2.current.count).toBe(0);
      expect(result2.current.isMounted).toBe(true);
    });
  });

  describe("Backward Compatibility", () => {
    it("should work without any tracking options", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 1000,
          loop: true,
          autoplay: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      expect(result.current.count).toBe(0);
      expect(result.current.iterationTime).toBe(0);
      expect(result.current.countRef.current).toBeNull();
      expect(result.current.iterationTimeRef.current).toBeNull();
      expect(result.current.isMounted).toBe(true);
    });

    it("should support existing callback patterns", async () => {
      let updateCalled = false;
      let loopCalled = false;

      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: 2,
          autoplay: true,
          onUpdate: () => {
            updateCalled = true;
          },
          onLoop: () => {
            loopCalled = true;
          },
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
      });

      expect(updateCalled).toBe(true);
      expect(loopCalled).toBe(true);
    });

    it("should return all original properties", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({ duration: 1000, autoplay: false }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      expect(result.current.controls).toBeDefined();
      expect(result.current.controls.play).toBeInstanceOf(Function);
      expect(result.current.controls.pause).toBeInstanceOf(Function);
      expect(result.current.controls.restart).toBeInstanceOf(Function);
      expect(result.current.controls.seek).toBeInstanceOf(Function);

      expect(result.current.state).toBeDefined();
      expect(result.current.state.progress).toBe(0);
      expect(result.current.state.paused).toBe(true);
      expect(result.current.state.began).toBe(false);

      expect(result.current.isRunning).toBe(false);
      expect(result.current.isReady).toBe(true);
    });
  });

  describe("Playback Controls", () => {
    it("should provide working play control", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({ duration: 1000, autoplay: false }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      expect(result.current.state.paused).toBe(true);

      act(() => {
        result.current.controls.play();
      });

      expect(result.current.state.paused).toBe(false);
    });

    it("should provide working pause control", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({ duration: 1000, autoplay: true }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(result.current.state.paused).toBe(false);

      act(() => {
        result.current.controls.pause();
      });

      expect(result.current.state.paused).toBe(true);
    });

    it("should provide working restart control", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 500,
          loop: 2,
          autoplay: true,
          trackLoopCount: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
      });

      const countBeforeRestart = result.current.count;

      act(() => {
        result.current.controls.restart();
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(result.current.count).toBe(0);
      expect(result.current.count).toBeLessThan(countBeforeRestart);
    });
  });

  describe("Timer Accuracy", () => {
    it("should track loop count accurately", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: 5,
          autoplay: true,
          trackLoopCount: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
      });

      expect(result.current.count).toBe(5);
    });

    it("should track iteration time accurately", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 1000,
          loop: true,
          alternate: true,
          autoplay: true,
          trackIterationTime: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 250));
      });

      const time = result.current.iterationTime;
      expect(time).toBeGreaterThanOrEqual(200);
      expect(time).toBeLessThanOrEqual(300);
    });

    it("should handle property fallback chain correctly", async () => {
      const { result } = renderHook(() =>
        useAnimeTimer({
          duration: 1000,
          loop: true,
          alternate: true,
          autoplay: true,
          trackIterationTime: true,
        }),
      );

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      const time = result.current.iterationTime;
      expect(time).toBeGreaterThan(0);
      expect(typeof time).toBe("number");
      expect(Number.isInteger(time)).toBe(true);
    });
  });

  describe("Concurrent Timer Instances", () => {
    it("should handle multiple independent timer instances", async () => {
      const { result: result1 } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: 2,
          autoplay: true,
          trackLoopCount: true,
        }),
      );

      const { result: result2 } = renderHook(() =>
        useAnimeTimer({
          duration: 200,
          loop: 2,
          autoplay: true,
          trackLoopCount: true,
        }),
      );

      await waitFor(() => {
        expect(result1.current.isReady).toBe(true);
        expect(result2.current.isReady).toBe(true);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
      });

      expect(result1.current.count).toBeGreaterThan(result2.current.count);
    });

    it("should not interfere with each other's state", async () => {
      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: true,
          autoplay: true,
          trackLoopCount: true,
        }),
      );

      const { result: result2 } = renderHook(() =>
        useAnimeTimer({
          duration: 100,
          loop: true,
          autoplay: true,
          trackLoopCount: true,
        }),
      );

      await waitFor(() => {
        expect(result1.current.isReady).toBe(true);
        expect(result2.current.isReady).toBe(true);
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
      });

      const count2Before = result2.current.count;

      unmount1();

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
      });

      expect(result2.current.count).toBeGreaterThan(count2Before);
    });
  });
});
