import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { useAnimeMock, useAnimeOnScrollMock } = vi.hoisted(() => ({
  useAnimeMock: vi.fn(),
  useAnimeOnScrollMock: vi.fn(),
}));

const animationControls = vi.hoisted(() => ({
  pause: vi.fn(),
  play: vi.fn(),
  seek: vi.fn(),
  setPlaybackRate: vi.fn(),
}));

vi.mock('@/lib/react-animejs', () => ({
  useAnime: useAnimeMock,
  useAnimeOnScroll: useAnimeOnScrollMock,
}));

import { ScrollImageSequence } from './ScrollImageSequence';

class FailedImage {
  complete = true;
  naturalWidth = 0;
  onerror: ((event: Event) => void) | null = null;
  onload: ((event: Event) => void) | null = null;

  set src(_value: string) {
    queueMicrotask(() => this.onerror?.(new Event('error')));
  }
}

class LoadedImage extends FailedImage {
  naturalWidth = 1158;
  naturalHeight = 770;

  set src(_value: string) {
    queueMicrotask(() => this.onload?.(new Event('load')));
  }
}

describe('ScrollImageSequence', () => {
  const originalImage = window.Image;
  const originalResizeObserver = window.ResizeObserver;
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  beforeEach(() => {
    useAnimeMock.mockReturnValue({
      animation: { current: {} },
      controls: animationControls,
      isReady: true,
    });
    useAnimeOnScrollMock.mockReturnValue({ ref: { current: null } });
    vi.stubGlobal('Image', FailedImage);
    vi.stubGlobal(
      'ResizeObserver',
      class {
        disconnect() {}
        observe() {}
      },
    );
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    window.Image = originalImage;
    window.ResizeObserver = originalResizeObserver;
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    vi.clearAllMocks();
  });

  it('keeps the sequence unavailable when image frames fail to load', async () => {
    render(<ScrollImageSequence />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load the image sequence.')).toBeTruthy();
    });

    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  });

  it('unlocks scrolling only after every frame has loaded', async () => {
    vi.stubGlobal('Image', LoadedImage);

    render(<ScrollImageSequence />);

    await waitFor(() => {
      expect(screen.queryByText('Preloading 147 frames')).toBeNull();
    });

    expect(screen.getByText('Scroll the card container to animate the model')).toBeTruthy();
  });

  it('uses a one-pass playhead for scrolling and loops only in autoplay mode', async () => {
    vi.stubGlobal('Image', LoadedImage);

    render(<ScrollImageSequence />);

    await waitFor(() => {
      expect(screen.queryByText('Preloading 147 frames')).toBeNull();
    });

    expect(useAnimeMock.mock.lastCall?.[0]).toMatchObject({ loop: false });

    fireEvent.click(screen.getByRole('button', { name: 'Autoplay' }));

    await waitFor(() => {
      expect(useAnimeMock.mock.lastCall?.[0]).toMatchObject({ loop: true });
    });
  });

  it('fades the introductory instruction after the sequence starts', async () => {
    vi.stubGlobal('Image', LoadedImage);

    render(<ScrollImageSequence />);

    await waitFor(() => {
      expect(screen.queryByText('Preloading 147 frames')).toBeNull();
    });

    const animationOptions = useAnimeMock.mock.lastCall?.[0] as {
      onUpdate: () => void;
      targets: { frame: number };
    };
    animationOptions.targets.frame = 12;
    animationOptions.onUpdate();

    expect(screen.getByText('Scroll the card container to animate the model').parentElement?.style.opacity).toBe(
      '0',
    );
  });
});
