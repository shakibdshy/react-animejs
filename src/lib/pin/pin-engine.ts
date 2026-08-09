/**
 * Framework-agnostic scroll-pin engine.
 *
 * This is the core of pin mode. It owns geometry capture, the spacer lifecycle,
 * the rAF scroll loop, threshold parsing, progress math, and reduced-motion
 * short-circuiting. It is deliberately free of React so it can be unit-tested
 * in isolation and ported verbatim to `react-animejs-package/src/core/` in
 * phase 2.
 *
 * Mechanism (fixed + spacer, NOT sticky):
 * Any ancestor with `overflow: hidden` (e.g. Tailwind `overflow-x-hidden`,
 * which computes to `overflow: hidden auto`) silently breaks `position:
 * sticky`. `position: fixed` has no such failure mode as long as no ancestor
 * establishes a containing block (`transform`/`filter`/`perspective`/
 * `will-change`/`contain`). The captured viewport rect + spacer give us a
 * document-flow-preserving pin that survives those hostile layouts.
 */

import type { PinEngine, PinEngineOptions, PinObserverLike, ScrollThreshold } from './types';

const RAISED_Z_INDEX = 9001;
const SPACER_ATTR = 'data-anime-pin-spacer';
const PINNED_ATTR = 'data-anime-pin-pinned';

const DEFAULT_STATE: PinObserverLike = {
  id: '',
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
};

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function parsePixelsOrPercent(value: string, containerSize: number): number {
  const percentMatch = /^(-?\d+(?:\.\d+)?)%$/.exec(value.trim());
  if (percentMatch) return (Number(percentMatch[1]) / 100) * containerSize;
  const pxMatch = /^(-?\d+(?:\.\d+)?)px$/.exec(value.trim());
  if (pxMatch) return Number(pxMatch[1]);
  const raw = Number(value.trim());
  return Number.isFinite(raw) ? raw : 0;
}

/**
 * Parse a threshold into a single scroll-Y position (in container-scroll
 * coordinates). Accepts the `'container target'` form (mirroring anime.js'
 * ScrollObserver convention, where the first token names a container edge and
 * the second a target edge), a single token, or a `{ target, container }`
 * object.
 */
function resolveThreshold(
  threshold: ScrollThreshold | undefined,
  fallback: string,
  targetRect: DOMRect,
  containerRect: DOMRect,
  containerSize: number,
): number {
  let containerToken: string | number;
  let targetToken: string | number;

  if (threshold == null) {
    const parts = fallback.split(' ');
    containerToken = parts[0];
    targetToken = parts[1] ?? 'top';
  } else if (typeof threshold === 'string') {
    const parts = threshold.split(' ');
    containerToken = parts[0];
    targetToken = parts[1] ?? 'top';
  } else if (typeof threshold === 'number') {
    containerToken = threshold;
    targetToken = 'top';
  } else {
    containerToken = threshold.container ?? 'top';
    targetToken = threshold.target ?? 'top';
  }

  // The container token is expressed relative to the container's own box:
  // e.g. 'top' = container top, 'bottom' = container bottom. For the window
  // (containerTop === 0), this matches GSAP's viewport-edge semantics.
  const containerEdge = resolveContainerEdge(
    containerToken,
    containerRect,
    containerSize,
  );

  // The target token selects which edge of the target aligns with the
  // container edge, plus an optional relative offset.
  const targetEdge = resolveTargetEdge(targetToken, targetRect, containerSize);

  // Pin starts/ends when the chosen target edge meets the chosen container
  // edge. Because the target rect is already absolute, the trigger scroll
  // equals the target edge minus the container edge.
  return targetEdge - containerEdge;
}

function resolveContainerEdge(
  token: string | number,
  containerRect: DOMRect,
  containerSize: number,
): number {
  if (typeof token === 'number') return token;
  const trimmed = token.trim();
  switch (trimmed) {
    case 'top':
    case 'start':
      return containerRect.top;
    case 'center':
      return containerRect.top + containerSize / 2;
    case 'bottom':
    case 'end':
      return containerRect.top + containerSize;
    default:
      return parsePixelsOrPercent(trimmed, containerSize);
  }
}

function resolveTargetEdge(
  token: string | number,
  targetRect: DOMRect,
  containerSize: number,
): number {
  if (typeof token === 'number') return token;
  const trimmed = token.trim();

  const relativeMatch = /^([+-])=(.+)$/.exec(trimmed);
  if (relativeMatch) {
    // A bare relative token (no base) anchors on the target top.
    const sign = relativeMatch[1] === '-' ? -1 : 1;
    return targetRect.top + sign * parsePixelsOrPercent(relativeMatch[2], containerSize);
  }

  switch (trimmed) {
    case 'top':
    case 'start':
      return targetRect.top;
    case 'center':
      return targetRect.top + targetRect.height / 2;
    case 'bottom':
    case 'end':
      return targetRect.top + targetRect.height;
    default:
      return targetRect.top + parsePixelsOrPercent(trimmed, containerSize);
  }
}

function getContainerScroll(container: HTMLElement | null | undefined): number {
  if (!container) {
    return typeof window !== 'undefined' ? window.scrollY || window.pageYOffset || 0 : 0;
  }
  return container.scrollTop;
}

function getContainerSize(container: HTMLElement | null | undefined): number {
  if (!container) {
    return typeof window !== 'undefined' ? window.innerHeight : 0;
  }
  return container.clientHeight;
}

function getContainerRect(container: HTMLElement | null | undefined): DOMRect {
  if (!container) {
    // For the window, the "container" is the viewport anchored at 0,0.
    return new DOMRect(0, 0, getContainerSize(null), getContainerSize(null));
  }
  return container.getBoundingClientRect();
}

export function createPinEngine(options: PinEngineOptions): PinEngine {
  const {
    target,
    container = null,
    start,
    end,
    pinSpacing = true,
    endSpacing = 0,
    reducedMotion = false,
    onPin,
    onUnpin,
    onUpdate,
  } = options;

  let reverted = false;
  let listening = false;
  let rafId = 0;
  let lastScroll = 0;
  let boundsStart = 0;
  let boundsEnd = 0;
  let isPinned = false;
  let completed = false;
  // Viewport coordinates the element should fix at while pinned. Computed in
  // computeBounds() from the natural document position and the start threshold,
  // so they are correct regardless of the scroll position at pin time.
  let fixedTop = 0;
  let fixedLeft = 0;
  let pinnedWidth = 0;
  let pinnedHeight = 0;

  // Captured geometry + inline styles, restored on unpin/revert.
  let captured: {
    rect: DOMRect;
    position: string;
    top: string;
    left: string;
    right: string;
    bottom: string;
    width: string;
    height: string;
    marginTop: string;
    marginRight: string;
    marginBottom: string;
    marginLeft: string;
    zIndex: string;
  } | null = null;

  let spacer: HTMLDivElement | null = null;

  const state: PinObserverLike = { ...DEFAULT_STATE, id: target.id || '' };

  function buildState(): PinObserverLike {
    return {
      id: state.id,
      progress: state.progress,
      scroll: state.scroll,
      velocity: state.velocity,
      backward: state.backward,
      isInView: state.isInView,
      ready: state.ready,
      began: state.began,
      completed: state.completed,
      reverted: state.reverted,
      offset: state.offset,
      offsetStart: state.offsetStart,
      offsetEnd: state.offsetEnd,
      distance: state.distance,
    };
  }

  function emitUpdate() {
    onUpdate?.(buildState());
  }

  function applyPinnedStyles() {
    if (!captured) return;
    const cs = window.getComputedStyle(target);
    target.setAttribute(PINNED_ATTR, '');
    target.style.position = 'fixed';
    // Use the precomputed fixed coords (from computeBounds), NOT a live rect
    // read — by the time pin() runs the element has already scrolled, so a
    // live getBoundingClientRect().top would capture the wrong anchor.
    target.style.top = `${fixedTop}px`;
    target.style.left = `${fixedLeft}px`;
    target.style.width = `${pinnedWidth}px`;
    target.style.height = `${pinnedHeight}px`;
    target.style.marginTop = '0px';
    target.style.marginRight = '0px';
    target.style.marginBottom = '0px';
    target.style.marginLeft = '0px';
    target.style.zIndex = String(RAISED_Z_INDEX);
    // Avoid sub-pixel jitter / GPU thrash while fixed.
    if (cs.willChange !== 'transform') {
      target.style.willChange = 'transform';
    }
  }

  function insertSpacer() {
    if (!captured || spacer || !pinSpacing) return;
    const cs = window.getComputedStyle(target);
    spacer = document.createElement('div');
    spacer.setAttribute(SPACER_ATTR, '');
    spacer.style.width = `${pinnedWidth}px`;
    spacer.style.height = `${pinnedHeight + endSpacing}px`;
    spacer.style.marginTop = cs.marginTop;
    spacer.style.marginRight = cs.marginRight;
    spacer.style.marginBottom = cs.marginBottom;
    spacer.style.marginLeft = cs.marginLeft;
    spacer.style.flexBasis = cs.flexBasis;
    spacer.style.flexShrink = '0';
    spacer.style.flexGrow = '0';
    // Placeholder must not consume pointer events or change the stacking order.
    spacer.style.pointerEvents = 'none';
    spacer.style.visibility = 'hidden';
    target.parentNode?.insertBefore(spacer, target);
  }

  function removeSpacer() {
    if (spacer) {
      spacer.parentNode?.removeChild(spacer);
      spacer = null;
    }
  }

  function restoreStyles() {
    if (!captured) return;
    target.removeAttribute(PINNED_ATTR);
    target.style.position = captured.position;
    target.style.top = captured.top;
    target.style.left = captured.left;
    target.style.right = captured.right;
    target.style.bottom = captured.bottom;
    target.style.width = captured.width;
    target.style.height = captured.height;
    target.style.marginTop = captured.marginTop;
    target.style.marginRight = captured.marginRight;
    target.style.marginBottom = captured.marginBottom;
    target.style.marginLeft = captured.marginLeft;
    target.style.zIndex = captured.zIndex;
    target.style.willChange = '';
    captured = null;
  }

  function captureGeometry() {
    const rect = target.getBoundingClientRect();
    const cs = window.getComputedStyle(target);
    captured = {
      rect,
      position: cs.position,
      top: cs.top,
      left: cs.left,
      right: cs.right,
      bottom: cs.bottom,
      width: cs.width,
      height: cs.height,
      marginTop: cs.marginTop,
      marginRight: cs.marginRight,
      marginBottom: cs.marginBottom,
      marginLeft: cs.marginLeft,
      zIndex: cs.zIndex,
    };
  }

  function computeBounds() {
    // Measure against the element in its natural (unpinned) position so the
    // thresholds reflect document flow, not the fixed state.
    const wasPinned = isPinned;
    if (wasPinned) restoreStylesTemporarilyForMeasurement();

    const targetRect = target.getBoundingClientRect();
    const containerRect = getContainerRect(container);
    const containerSize = getContainerSize(container);

    let startScroll = resolveThreshold(
      start,
      'top top',
      targetRect,
      containerRect,
      containerSize,
    );
    let endScroll = resolveThreshold(
      end,
      'top bottom',
      targetRect,
      containerRect,
      containerSize,
    );

    // Thresholds resolve to absolute Y coords; convert to scroll positions by
    // removing the container's own offset (for the window that offset is 0).
    const containerTop = containerRect.top + getContainerScroll(container);
    startScroll -= containerTop;
    endScroll -= containerTop;

    if (endScroll <= startScroll) {
      // Degenerate range: fall back to a single-viewport pin window.
      endScroll = startScroll + Math.max(1, containerSize);
    }

    boundsStart = startScroll;
    boundsEnd = endScroll + endSpacing;

    // Fixed position the element will occupy while pinned, computed from the
    // natural document geometry so it is independent of the current scroll.
    // For a window container with start 'top top', this resolves to top:0.
    const scroll = getContainerScroll(container);
    // Element's document-top in natural flow (rect is viewport-relative, so add
    // the current scroll; for a container, add the container's page offset).
    const naturalDocTop = targetRect.top + scroll + (container ? containerRect.top : 0);
    // At pin start the container has scrolled by `boundsStart`; the element's
    // offset within the container viewport is therefore:
    const offsetInContainerAtStart = naturalDocTop - boundsStart;
    fixedTop = container
      ? containerRect.top + offsetInContainerAtStart
      : offsetInContainerAtStart;
    fixedLeft = targetRect.left;
    pinnedWidth = targetRect.width;
    pinnedHeight = targetRect.height;

    state.offsetStart = boundsStart;
    state.offsetEnd = boundsEnd;
    state.distance = Math.max(0, boundsEnd - boundsStart);

    if (wasPinned) reapplyPinnedStylesAfterMeasurement();
  }

  // During bounds recomputation we may be currently pinned. Temporarily
  // restoring styles lets getBoundingClientRect() report the natural position,
  // then we re-pin. Kept private; only called from computeBounds.
  let measuringWhilePinned = false;
  function restoreStylesTemporarilyForMeasurement() {
    if (!captured || measuringWhilePinned) return;
    measuringWhilePinned = true;
    removeSpacer();
    target.removeAttribute(PINNED_ATTR);
    target.style.position = captured.position;
    target.style.top = captured.top;
    target.style.left = captured.left;
    target.style.width = captured.width;
    target.style.height = captured.height;
    target.style.marginTop = captured.marginTop;
    target.style.marginRight = captured.marginRight;
    target.style.marginBottom = captured.marginBottom;
    target.style.marginLeft = captured.marginLeft;
    target.style.zIndex = captured.zIndex;
    target.style.willChange = '';
  }

  function reapplyPinnedStylesAfterMeasurement() {
    if (!measuringWhilePinned) return;
    measuringWhilePinned = false;
    applyPinnedStyles();
    insertSpacer();
  }

  function pin() {
    if (isPinned || reverted || reducedMotion) return;
    if (!captured) captureGeometry();
    isPinned = true;
    state.isInView = true;
    state.began = true;
    insertSpacer();
    applyPinnedStyles();
    onPin?.(buildState());
    emitUpdate();
  }

  function unpin() {
    if (!isPinned) return;
    isPinned = false;
    state.isInView = false;
    removeSpacer();
    restoreStyles();
    onUnpin?.(buildState());
  }

  function tick() {
    rafId = 0;
    if (reverted) return;

    const currentScroll = getContainerScroll(container);
    const velocity = currentScroll - lastScroll;
    lastScroll = currentScroll;

    state.scroll = currentScroll;
    state.velocity = velocity;
    state.backward = velocity > 0 ? false : velocity < 0;

    const distance = state.distance || 1;
    const raw = (currentScroll - boundsStart) / distance;
    const progress = clamp(raw, 0, 1);
    state.progress = progress;
    state.offset = currentScroll - boundsStart;

    const shouldPin = currentScroll >= boundsStart && currentScroll < boundsEnd;

    if (shouldPin && !isPinned) {
      pin();
    } else if (!shouldPin && isPinned) {
      unpin();
    } else if (isPinned) {
      // Already pinned: just emit progress updates.
      if (progress >= 1 && !completed) {
        completed = true;
        state.completed = true;
      } else if (progress < 1 && completed) {
        completed = false;
        state.completed = false;
      }
      emitUpdate();
    } else {
      // Not pinned: still surface progress so handlers driving nearby content
      // (e.g. the next card entering) keep firing across the whole range.
      emitUpdate();
    }
  }

  function onScrollOrResize() {
    if (reverted) return;
    if (rafId) return;
    rafId = window.requestAnimationFrame(tick);
  }

  function onResize() {
    if (reverted) return;
    // On resize the element's natural geometry changes; recompute bounds and
    // re-capture if currently pinned so the fixed box tracks the new size.
    computeBounds();
    if (isPinned) {
      removeSpacer();
      restoreStyles();
      captured = null;
      captureGeometry();
      insertSpacer();
      applyPinnedStyles();
    }
    onScrollOrResize();
  }

  function attach() {
    if (listening || reverted) return;
    listening = true;
    // Defensive: a container that isn't a real Element (e.g. an unresolved ref
    // object) must never reach addEventListener — fall back to the window.
    const resolvedScrollTarget: Window | HTMLElement = resolveScrollTarget();
    resolvedScrollTarget.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    // Seed an initial measurement so state is correct before the first scroll.
    computeBounds();
    state.ready = true;
    onScrollOrResize();
  }

  function detach() {
    listening = false;
    const resolvedScrollTarget: Window | HTMLElement = resolveScrollTarget();
    resolvedScrollTarget.removeEventListener('scroll', onScrollOrResize);
    window.removeEventListener('resize', onResize);
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  /** Pick the element/window to listen for scroll on, guarding against a
   *  container that isn't a real event target (e.g. an unresolved ref). */
  function resolveScrollTarget(): Window | HTMLElement {
    if (container && typeof container.addEventListener === 'function') {
      return container;
    }
    return typeof window !== 'undefined' ? window : (container as HTMLElement);
  }

  function refresh(): PinObserverLike {
    if (reverted) return buildState();
    if (!listening) attach();
    computeBounds();
    onScrollOrResize();
    return buildState();
  }

  function revert() {
    if (reverted) return;
    reverted = true;
    state.reverted = true;
    state.ready = false;
    unpin();
    detach();
  }

  function getState(): PinObserverLike {
    return buildState();
  }

  // Public surface.
  const engine: PinEngine = {
    refresh,
    revert,
    pin,
    unpin,
    getState,
  };

  // Reduced motion: never attach the pin loop; expose natural-flow progress.
  if (reducedMotion) {
    state.ready = true;
    return engine;
  }

  attach();
  return engine;
}

/** Convenience for tests / callers that want the default state shape. */
export const PIN_DEFAULT_STATE = DEFAULT_STATE;

// Re-export threshold helpers for unit testing of edge parsing.
export const __thresholds = {
  resolveThreshold,
  parsePixelsOrPercent,
};
