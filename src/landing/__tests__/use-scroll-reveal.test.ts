import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useScrollReveal } from "../hooks/use-scroll-reveal";

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
const mockUnobserve = vi.fn();

beforeEach(() => {
  mockObserve.mockClear();
  mockDisconnect.mockClear();
  mockUnobserve.mockClear();

  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: mockUnobserve,
      root: null,
      rootMargin: "",
      thresholds: [],
      takeRecords: () => [],
    })),
  );
});

describe("useScrollReveal", () => {
  it("returns a ref and false visibility initially", () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current[0].current).toBeNull();
    expect(result.current[1]).toBe(false);
  });

  it("does not observe when ref is null", () => {
    renderHook(() => useScrollReveal());
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it("accepts custom threshold and rootMargin options", () => {
    const { result } = renderHook(() =>
      useScrollReveal({ threshold: 0.3, rootMargin: "20px" }),
    );
    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBe(false);
  });

  it("returns the same ref object across rerenders", () => {
    const { result, rerender } = renderHook(() => useScrollReveal());
    const firstRef = result.current[0];
    rerender();
    expect(result.current[0]).toBe(firstRef);
  });
});
