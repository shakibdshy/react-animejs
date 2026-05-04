import type { ReactNode } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  animeMorphMock,
  animeDrawMock,
  animeMotionPathMock,
} = vi.hoisted(() => ({
  animeMorphMock: vi.fn(),
  animeDrawMock: vi.fn(),
  animeMotionPathMock: vi.fn(),
}));

vi.mock("@/lib/react-animejs/components", () => ({
  AnimeMorph: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => {
    animeMorphMock(props);
    return <>{children}</>;
  },
  AnimeDraw: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => {
    animeDrawMock(props);
    return <>{children}</>;
  },
  AnimeMotionPath: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => {
    animeMotionPathMock(props);
    return <>{children}</>;
  },
}));

import { SvgUtilitiesDemo } from "@/demo/components/SvgUtilitiesDemo";

describe("SvgUtilitiesDemo", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    animeMorphMock.mockReset();
    animeDrawMock.mockReset();
    animeMotionPathMock.mockReset();
  });

  it("renders a value-first AnimeMorph demo", () => {
    render(<SvgUtilitiesDemo />);

    expect(animeMorphMock).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.any(Object),
        duration: 750,
        ease: "inOutQuad",
        alternate: true,
        loop: true,
        autoplay: true,
        deps: [expect.any(String)],
      }),
    );
  });

  it("renders the draw demo with staggered AnimeDraw wrappers", () => {
    render(<SvgUtilitiesDemo />);

    expect(animeDrawMock).toHaveBeenCalledTimes(DRAWABLE_CALLS_COUNT);
    expect(animeDrawMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        draw: ["0 0", "0 1", "1 1"],
        delay: 0,
        loop: true,
        duration: 2000,
        ease: "inOutQuad",
        autoplay: true,
      }),
    );
    expect(animeDrawMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        draw: "0 1",
        loop: true,
        duration: 5000,
        ease: "linear",
        autoplay: true,
      }),
    );
  });

  it("renders a value-first AnimeMotionPath demo", () => {
    render(<SvgUtilitiesDemo />);

    expect(animeMotionPathMock).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.any(Object),
        duration: 5000,
        loop: true,
        ease: "linear",
        autoplay: true,
      }),
    );
  });
});

const DRAWABLE_CALLS_COUNT = 11;
