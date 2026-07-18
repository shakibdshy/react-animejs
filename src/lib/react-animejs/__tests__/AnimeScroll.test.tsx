import { cleanup, render, screen } from '@testing-library/react';
import type { RefObject } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { useAnimeOnScrollMock } = vi.hoisted(() => ({
  useAnimeOnScrollMock: vi.fn(),
}));

vi.mock('../hooks/use-anime-onscroll', () => ({
  useAnimeOnScroll: useAnimeOnScrollMock,
}));

import { AnimeScroll, type AnimeScrollRef } from '../components/AnimeScroll';

describe('AnimeScroll', () => {
  const controls = {
    refresh: vi.fn(),
    revert: vi.fn(),
    link: vi.fn(),
  };

  beforeEach(() => {
    useAnimeOnScrollMock.mockReturnValue({
      ref: { current: null },
      targetRef: { current: null },
      containerRef: { current: null },
      controls,
      state: {
        id: 'test',
        progress: 0.4,
        scroll: 120,
        velocity: 2,
        backward: false,
        isInView: true,
        ready: true,
        began: true,
        completed: false,
        reverted: false,
        offset: 0,
        offsetStart: 0,
        offsetEnd: 300,
        distance: 300,
      },
      observer: { refresh: vi.fn() },
      isReady: true,
      isInView: true,
      progress: 0.4,
      scroll: 120,
      velocity: 2,
      backward: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('passes observer refs and state through the render prop', () => {
    render(
      <AnimeScroll<HTMLDivElement>>
        {({ ref, progress, state }: AnimeScrollRef<HTMLDivElement>) => (
          <div ref={ref} data-testid="target">
            {Math.round(progress * 100)}% / {state.scroll}
          </div>
        )}
      </AnimeScroll>
    );

    expect(screen.getByTestId('target').textContent).toBe('40% / 120');
  });

  it('notifies readiness and exposes imperative controls', () => {
    const onReady = vi.fn();
    const onControlsReady = vi.fn();
    const ref = { current: null } as RefObject<AnimeScrollRef<HTMLDivElement> | null>;

    render(
      <AnimeScroll<HTMLDivElement> ref={ref} onReady={onReady} onControlsReady={onControlsReady}>
        <div />
      </AnimeScroll>
    );

    expect(onReady).toHaveBeenCalledTimes(1);
    expect(onControlsReady).toHaveBeenCalledWith(controls);
    expect(ref.current?.controls).toBe(controls);
    expect(ref.current?.progress).toBe(0.4);
  });

  it('does not announce a disabled observer as ready', () => {
    const onReady = vi.fn();
    const onControlsReady = vi.fn();

    render(
      <AnimeScroll<HTMLDivElement>
        enabled={false}
        onReady={onReady}
        onControlsReady={onControlsReady}
      >
        <div />
      </AnimeScroll>
    );

    expect(onReady).not.toHaveBeenCalled();
    expect(onControlsReady).not.toHaveBeenCalled();
  });
});
