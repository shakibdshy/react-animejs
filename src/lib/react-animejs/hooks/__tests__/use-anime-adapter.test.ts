/**
 * Tests for useAnimeAdapter hook and the adapter registry
 */

import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { animate } from "animejs";
import { useAnimeAdapter } from "../use-anime-adapter";
import {
  clearAdapterRegistryForTesting,
  getRegisteredAdapter,
  registerAnimeAdapter,
} from "../../core/adapter-registry";

// Reset the react-animejs adapter registry between tests so idempotency
// assertions are deterministic. (anime.js's own global registry can't be
// reset — it has no unregister — so we test react-animejs's dedupe layer.)
afterEach(() => {
  clearAdapterRegistryForTesting();
});

describe("adapter registry (registerAnimeAdapter)", () => {
  it("registers an adapter and stores it by id", () => {
    const adapter = registerAnimeAdapter({
      id: "test-basic",
      detect: (t) => t?.isTestTarget,
      targets: [
        {
          detect: (t) => t.isTestTarget,
          properties: {
            value: {
              get: (t) => t.value,
              set: (t, v) => {
                t.value = v;
              },
            },
          },
        },
      ],
    });

    expect(adapter).toBeDefined();
    expect(getRegisteredAdapter("test-basic")).toBe(adapter);
  });

  it("returns the same adapter for duplicate id (idempotent)", () => {
    const config = {
      id: "test-dedupe",
      detect: (t: unknown) => Boolean((t as { isX?: boolean })?.isX),
      targets: [
        {
          detect: (t: unknown) => Boolean((t as { isX?: boolean })?.isX),
          properties: {
            x: {
              get: (t: any) => t.x,
              set: (t: any, v: number) => {
                t.x = v;
              },
            },
          },
        },
      ],
    };

    const first = registerAnimeAdapter(config);
    const second = registerAnimeAdapter(config);

    expect(second).toBe(first);
  });

  it("creates separate adapters for different ids", () => {
    const a = registerAnimeAdapter({ id: "alpha", targets: [] });
    const b = registerAnimeAdapter({ id: "beta", targets: [] });

    expect(a).not.toBe(b);
    expect(getRegisteredAdapter("alpha")).toBe(a);
    expect(getRegisteredAdapter("beta")).toBe(b);
  });

  it("registers properties that anime.js routes animated values through", () => {
    // A fake target object that the adapter claims via detect()
    const target = { isMockNode: true, score: 0 };

    registerAnimeAdapter({
      id: "test-routing",
      detect: (t) => t?.isMockNode,
      targets: [
        {
          detect: (t) => t.isMockNode,
          properties: {
            score: {
              get: (t) => t.score,
              set: (t, v) => {
                t.score = v;
              },
            },
          },
        },
      ],
    });

    // anime.js should now resolve `score` through our adapter instead of
    // treating it as a DOM property. A zero-duration animate should write the
    // final value via our setter.
    animate(target, { score: 42, duration: 0 });

    expect(target.score).toBe(42);
  });
});

describe("useAnimeAdapter hook", () => {
  it("registers an adapter and exposes it via the hook", async () => {
    const { result } = renderHook(() =>
      useAnimeAdapter({
        id: "hook-basic",
        detect: (t) => t?.isHookTarget,
        targets: [
          {
            detect: (t) => t.isHookTarget,
            properties: {
              val: {
                get: (t) => t.val,
                set: (t, v) => {
                  t.val = v;
                },
              },
            },
          },
        ],
      }),
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
      expect(result.current.adapter).not.toBeNull();
    });

    expect(getRegisteredAdapter("hook-basic")).toBe(result.current.adapter);
  });

  it("does not duplicate registration across multiple hook instances", async () => {
    const config = {
      id: "hook-dedupe",
      detect: (t: unknown) => Boolean((t as { isD?: boolean })?.isD),
      targets: [
        {
          detect: (t: unknown) => Boolean((t as { isD?: boolean })?.isD),
          properties: {
            v: {
              get: (t: any) => t.v,
              set: (t: any, v: number) => {
                t.v = v;
              },
            },
          },
        },
      ],
    };

    const { result: first } = renderHook(() => useAnimeAdapter(config));
    const { result: second } = renderHook(() => useAnimeAdapter(config));

    await waitFor(() => {
      expect(first.current.isReady).toBe(true);
      expect(second.current.isReady).toBe(true);
    });

    // Both hook instances should resolve to the same underlying adapter —
    // no duplicate registration, even with two consumers.
    expect(second.current.adapter).toBe(first.current.adapter);
  });
});
