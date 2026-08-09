import { act, render, renderHook } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAnimeOnScrollPin } from '../use-anime-onscroll-pin';
import { __thresholds, createPinEngine } from '../pin-engine';

// jsdom polyfills: the engine reads scroll/viewport geometry that jsdom
// doesn't really lay out, so we stub the primitives and patch getBoundingClientRect
// per-test via Object.defineProperty on the target.
function defineClientHeight(el: HTMLElement, value: number) {
  Object.defineProperty(el, 'clientHeight', { configurable: true, value });
}
function defineRect(el: HTMLElement, rect: DOMRectInit) {
  el.getBoundingClientRect = () => new DOMRect(rect.x, rect.y, rect.width, rect.height);
}

beforeAll(() => {
  // rAF must flush synchronously inside act().
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(performance.now());
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
});

beforeEach(() => {
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
  // jsdom has no matchMedia by default.
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('pin-engine threshold parsing', () => {
  it('parses named edges into target-relative offsets', () => {
    const rect = new DOMRect(0, 1000, 320, 200);
    const containerRect = new DOMRect(0, 0, 320, 800);
    // start 'top top': container top (0) meets target top (1000) → 1000
    const start = __thresholds.resolveThreshold('top top', 'top top', rect, containerRect, 800);
    expect(start).toBe(1000);
    // end 'top bottom' (default): container top (0) meets target bottom (1200) → 1200
    const end = __thresholds.resolveThreshold('top bottom', 'top bottom', rect, containerRect, 800);
    expect(end).toBe(1200);
  });

  it('parses percent and relative tokens', () => {
    expect(__thresholds.parsePixelsOrPercent('50%', 800)).toBe(400);
    expect(__thresholds.parsePixelsOrPercent('120px', 800)).toBe(120);
    expect(__thresholds.parsePixelsOrPercent('160', 800)).toBe(160);
  });
});

describe('createPinEngine lifecycle', () => {
  function setupTarget(height = 200) {
    const target = document.createElement('div');
    target.style.height = `${height}px`;
    target.style.width = '320px';
    defineClientHeight(target, height);
    defineRect(target, { x: 0, y: 1000, width: 320, height });
    document.body.appendChild(target);
    return target;
  }

  it('does not pin before the start threshold and pins after crossing it', () => {
    const target = setupTarget();
    defineClientHeight(document.documentElement, 2000);

    const onPin = vi.fn();
    const onUnpin = vi.fn();
    const engine = createPinEngine({
      target,
      start: 'top top',
      end: 'bottom top',
      onPin,
      onUnpin,
    });

    // scrollY below start: nothing pinned
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    window.dispatchEvent(new Event('scroll'));
    expect(onPin).not.toHaveBeenCalled();

    // cross the start threshold
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1050 });
    window.dispatchEvent(new Event('scroll'));
    expect(onPin).toHaveBeenCalledTimes(1);
    expect(target.style.position).toBe('fixed');
    expect(target.getAttribute('data-anime-pin-pinned')).toBe('');

    engine.revert();
  });

  it('injects a spacer when pinSpacing is true and removes it on unpin', () => {
    const target = setupTarget();
    defineClientHeight(document.documentElement, 2000);

    const engine = createPinEngine({
      target,
      start: 'top top',
      end: 'top bottom',
      pinSpacing: true,
    });

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1050 });
    window.dispatchEvent(new Event('scroll'));

    const spacer = document.querySelector('[data-anime-pin-spacer]');
    expect(spacer).not.toBeNull();
    expect(spacer?.parentNode).toBe(target.parentNode);

    // unpin by scrolling past end
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1500 });
    window.dispatchEvent(new Event('scroll'));

    expect(document.querySelector('[data-anime-pin-spacer]')).toBeNull();
    expect(target.style.position).not.toBe('fixed');

    engine.revert();
  });

  it('skips the spacer when pinSpacing is false', () => {
    const target = setupTarget();
    defineClientHeight(document.documentElement, 2000);

    const engine = createPinEngine({
      target,
      start: 'top top',
      end: 'bottom top',
      pinSpacing: false,
    });

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1050 });
    window.dispatchEvent(new Event('scroll'));

    expect(document.querySelector('[data-anime-pin-spacer]')).toBeNull();
    expect(target.style.position).toBe('fixed');

    engine.revert();
  });

  it('revert restores styles and detaches', () => {
    const target = setupTarget();
    defineClientHeight(document.documentElement, 2000);

    const engine = createPinEngine({
      target,
      start: 'top top',
      end: 'bottom top',
    });

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1050 });
    window.dispatchEvent(new Event('scroll'));
    expect(target.style.position).toBe('fixed');

    engine.revert();
    expect(target.style.position).not.toBe('fixed');
    expect(target.getAttribute('data-anime-pin-pinned')).toBe(null);
    expect(document.querySelector('[data-anime-pin-spacer]')).toBeNull();

    // further scroll must not re-pin after revert
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1100 });
    window.dispatchEvent(new Event('scroll'));
    expect(target.style.position).not.toBe('fixed');
  });

  it('does not pin when prefers-reduced-motion is reduce', () => {
    const target = setupTarget();
    defineClientHeight(document.documentElement, 2000);

    const engine = createPinEngine({
      target,
      start: 'top top',
      end: 'bottom top',
      reducedMotion: true,
    });

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1050 });
    window.dispatchEvent(new Event('scroll'));
    expect(target.style.position).not.toBe('fixed');

    engine.revert();
  });
});

describe('useAnimeOnScrollPin hook', () => {
  it('delegates to the published observer when pin is falsy', () => {
    const { result } = renderHook(() => useAnimeOnScrollPin<HTMLDivElement>({ pin: false }));
    // delegated path always returns a usable ref and never claims to be pinned
    expect(result.current.ref).toBeDefined();
    expect(result.current.isPinned).toBe(false);
  });

  it('runs the pin engine when pin is true and pins on scroll', () => {
    function Probe() {
      const { ref, isPinned } = useAnimeOnScrollPin<HTMLDivElement>({
        pin: true,
        start: 'top top',
        end: 'top bottom',
      });
      return (
        <div>
          <div ref={ref} data-testid="target" style={{ height: 200, width: 320 }} />
          <span data-testid="pinned">{String(isPinned)}</span>
        </div>
      );
    }

    const { getByTestId } = render(<Probe />);
    const target = getByTestId('target') as HTMLElement;
    defineClientHeight(document.documentElement, 2000);
    defineRect(target, { x: 0, y: 1000, width: 320, height: 200 });

    // Recompute bounds now that the target's real rect is in place.
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // At scrollY 0 we are below the start threshold (1000), so not pinned.
    expect(getByTestId('pinned').textContent).toBe('false');

    act(() => {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 1050 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(target.style.position).toBe('fixed');
    expect(getByTestId('pinned').textContent).toBe('true');
  });

  it('enabled=false does not pin even when in range', () => {
    function Probe() {
      const { ref } = useAnimeOnScrollPin<HTMLDivElement>({
        pin: true,
        enabled: false,
        start: 'top top',
        end: 'top bottom',
      });
      return (
        <div ref={ref} data-testid="target" style={{ height: 200, width: 320 }} />
      );
    }

    const { getByTestId } = render(<Probe />);
    const target = getByTestId('target') as HTMLElement;
    defineRect(target, { x: 0, y: 1000, width: 320, height: 200 });

    act(() => {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 1050 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(target.style.position).not.toBe('fixed');
  });
});
