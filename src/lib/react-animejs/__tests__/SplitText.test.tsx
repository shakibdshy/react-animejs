import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SplitText } from '../components/SplitText';

const splitTextMock = vi.hoisted(() => vi.fn());

vi.mock('animejs', () => ({
  splitText: splitTextMock,
}));

describe('SplitText', () => {
  let frames: Array<{ id: number; callback: FrameRequestCallback }>;
  let nextFrameId: number;

  beforeEach(() => {
    frames = [];
    nextFrameId = 1;
    splitTextMock.mockReset();
    splitTextMock.mockImplementation(() => ({
      chars: [],
      words: [],
      lines: [],
      revert: vi.fn(),
      refresh: vi.fn(),
    }));
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      const id = nextFrameId++;
      frames.push({ id, callback });
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      frames = frames.filter((frame) => frame.id !== id);
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('passes function-valued splitter params without JSON conversion', () => {
    const lineTemplate = vi.fn(() => document.createElement('span'));

    render(
      <SplitText params={{ lines: true, lineTemplate } as never}>
        <p>Hello</p>
      </SplitText>
    );

    expect(splitTextMock).toHaveBeenCalledTimes(1);
    expect(splitTextMock.mock.calls[0][1].lineTemplate).toBe(lineTemplate);
  });

  it('cancels deferred onReady callbacks during unmount', () => {
    const onReady = vi.fn();
    const { unmount } = render(
      <SplitText onReady={onReady}>
        <p>Hello</p>
      </SplitText>
    );

    expect(frames).toHaveLength(1);
    unmount();

    act(() => {
      frames[0]?.callback(0);
    });

    expect(onReady).not.toHaveBeenCalled();
  });

  it('re-splits when the additive deps prop changes', () => {
    const { rerender } = render(
      <SplitText deps={[0]}>
        <p>Hello</p>
      </SplitText>,
    );

    expect(splitTextMock).toHaveBeenCalledTimes(1);

    rerender(
      <SplitText deps={[1]}>
        <p>Hello</p>
      </SplitText>,
    );

    expect(splitTextMock).toHaveBeenCalledTimes(2);
  });
});
