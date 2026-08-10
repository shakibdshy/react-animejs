/**
 * Framework-agnostic scroll-pin engine.
 *
 * This is the core of pin mode. It owns geometry capture, the spacer lifecycle,
 * the rAF scroll loop, threshold parsing, progress math, and reduced-motion
 * short-circuiting. It is deliberately free of React so it can be unit-tested
 * in isolation.
 *
 * Mechanism (fixed + spacer, NOT sticky):
 * Any ancestor with `overflow: hidden` (e.g. Tailwind `overflow-x-hidden`,
 * which computes to `overflow: hidden auto`) silently breaks `position:
 * sticky`. `position: fixed` has no such failure mode as long as no ancestor
 * establishes a containing block (`transform`/`filter`/`perspective`/
 * `will-change`/`contain`). The captured viewport rect + spacer give us a
 * document-flow-preserving pin that survives those hostile layouts.
 */

import type { PinEngine, PinEngineOptions, PinObserverLike, ScrollThreshold } from '../types';

const RAISED_Z_INDEX = 9001;
const SPACER_ATTR = 'data-anime-pin-spacer';
const PINNED_ATTR = 'data-anime-pin-pinned';

/**
 * Isolates every axis-specific bit of pin geometry behind one interface so the
 * engine body reads the same for vertical and horizontal pin. Two concrete
 * instances: `verticalDim` (the historical default) and `horizontalDim`.
 *
 * `rectStart`/`rectSize` are the *primary axis* (the pin axis); the cross axis
 * is handled directly via `rect.left`/`rect.top` in `computeBounds`, exactly as
 * today. Threshold tokens mean "primary-axis start" / "primary-axis end".
 */
interface PinDimension {
  /** Scroll position along this axis. Window → scrollY|scrollX; container → scrollTop|scrollLeft. */
  scroll(container: HTMLElement | null | undefined): number;
  /** Viewport/container size along this axis. Window → innerHeight|innerWidth; container → clientHeight|clientWidth. */
  size(container: HTMLElement | null | undefined): number;
  /** Primary-axis start of a rect: rect.top (vertical) | rect.left (horizontal). */
  rectStart(rect: DOMRect): number;
  /** Primary-axis size of a rect: rect.height (vertical) | rect.width (horizontal). */
  rectSize(rect: DOMRect): number;
  /** Threshold tokens meaning "primary-axis start". */
  startTokens: readonly string[];
  /** Threshold tokens meaning "primary-axis end". */
  endTokens: readonly string[];
}

const verticalDim: PinDimension = {
  // pageYOffset is an alias for scrollY in all modern browsers; kept for exact
  // parity with the previous getContainerScroll() implementation.
  scroll: (c) =>
    !c ? (typeof window !== 'undefined' ? window.scrollY || window.pageYOffset || 0 : 0) : c.scrollTop,
  size: (c) => (!c ? (typeof window !== 'undefined' ? window.innerHeight : 0) : c.clientHeight),
  rectStart: (r) => r.top,
  rectSize: (r) => r.height,
  startTokens: ['top', 'start'],
  endTokens: ['bottom', 'end'],
};

const horizontalDim: PinDimension = {
  scroll: (c) =>
    !c
      ? typeof window !== 'undefined'
        ? window.scrollX || window.pageXOffset || 0
        : 0
      : c.scrollLeft,
  size: (c) => (!c ? (typeof window !== 'undefined' ? window.innerWidth : 0) : c.clientWidth),
  rectStart: (r) => r.left,
  rectSize: (r) => r.width,
  startTokens: ['left', 'start'],
  endTokens: ['right', 'end'],
};

/**
 * Resolve an effective pinType ('fixed' | 'sticky') from the user's `pinType`
 * option by walking ancestors. Detection rules:
 *  - transformed/perspective/filter/backdrop-filter/will-change/contain ancestor
 *    → breaks `position: fixed` (wrong containing block) → prefer sticky.
 *  - overflow:hidden/clip ancestor → breaks `position: sticky` → prefer fixed.
 *  - neither → fixed (the robust default).
 *  - both (conflict) → sticky + dev warning (transform is the silent failure).
 *
 * Returns only 'fixed' | 'sticky'; 'auto' is resolved here.
 */
function resolvePinType(
  target: HTMLElement,
  pinType: 'auto' | 'fixed' | 'sticky',
): 'fixed' | 'sticky' {
  if (pinType === 'fixed') return 'fixed';
  if (pinType === 'sticky') return 'sticky';
  // 'auto': walk ancestors up to <body>.
  let hasTransformedAncestor = false;
  let hasOverflowClipAncestor = false;
  let node: Node | null = target.parentNode;
  while (node && node !== document.body && node.nodeType === 1) {
    const el = node as HTMLElement;
    if (typeof window !== 'undefined' && typeof el.style !== 'undefined') {
      const cs = window.getComputedStyle(el);
      const transform = cs.getPropertyValue('transform');
      const perspective = cs.getPropertyValue('perspective');
      const filter = cs.getPropertyValue('filter');
      const backdrop = cs.getPropertyValue('backdrop-filter');
      const willChange = cs.getPropertyValue('will-change');
      const contain = cs.getPropertyValue('contain');
      const overflow = cs.getPropertyValue('overflow');
      const overflowX = cs.getPropertyValue('overflow-x');
      const overflowY = cs.getPropertyValue('overflow-y');
      if (
        (transform && transform !== 'none') ||
        (perspective && perspective !== 'none') ||
        (filter && filter !== 'none') ||
        (backdrop && backdrop !== 'none') ||
        /\b(transform|filter|perspective)\b/.test(willChange) ||
        /\b(paint|layout|strict)\b/.test(contain)
      ) {
        hasTransformedAncestor = true;
      }
      if (
        overflow === 'hidden' ||
        overflow === 'clip' ||
        overflowX === 'hidden' ||
        overflowX === 'clip' ||
        overflowY === 'hidden' ||
        overflowY === 'clip'
      ) {
        hasOverflowClipAncestor = true;
      }
    }
    node = node.parentNode;
  }
  if (hasTransformedAncestor && hasOverflowClipAncestor) {
    // Conflict: both positioning strategies have a failure mode. Sticky is the
    // safer tiebreak (transform failure is silent; overflow failure is visible).
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(
        '[react-animejs] pinType "auto": both a transformed ancestor and an overflow-clip ancestor were detected. ' +
          'Falling back to sticky. Consider pinReparent or restructuring the layout.',
      );
    }
    return 'sticky';
  }
  if (hasTransformedAncestor) return 'sticky';
  return 'fixed'; // default + overflow-clip-only → fixed
}

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
  dim: PinDimension = verticalDim,
): number {
  let containerToken: string | number;
  let targetToken: string | number;

  if (threshold == null) {
    const parts = fallback.split(' ');
    containerToken = parts[0];
    targetToken = parts[1] ?? dim.startTokens[0];
  } else if (typeof threshold === 'string') {
    const parts = threshold.split(' ');
    containerToken = parts[0];
    targetToken = parts[1] ?? dim.startTokens[0];
  } else if (typeof threshold === 'number') {
    containerToken = threshold;
    targetToken = dim.startTokens[0];
  } else {
    containerToken = threshold.container ?? dim.startTokens[0];
    targetToken = threshold.target ?? dim.startTokens[0];
  }

  // The container token is expressed relative to the container's own box.
  const containerEdge = resolveContainerEdge(containerToken, containerRect, containerSize, dim);
  // The target token selects which edge of the target aligns with the container edge.
  const targetEdge = resolveTargetEdge(targetToken, targetRect, containerSize, dim);

  return targetEdge - containerEdge;
}

function resolveContainerEdge(
  token: string | number,
  containerRect: DOMRect,
  containerSize: number,
  dim: PinDimension = verticalDim,
): number {
  if (typeof token === 'number') return token;
  const trimmed = token.trim();
  if (dim.startTokens.includes(trimmed)) return dim.rectStart(containerRect);
  if (trimmed === 'center') return dim.rectStart(containerRect) + containerSize / 2;
  if (dim.endTokens.includes(trimmed)) return dim.rectStart(containerRect) + containerSize;
  return parsePixelsOrPercent(trimmed, containerSize);
}

function resolveTargetEdge(
  token: string | number,
  targetRect: DOMRect,
  containerSize: number,
  dim: PinDimension = verticalDim,
): number {
  if (typeof token === 'number') return token;
  const trimmed = token.trim();

  const relativeMatch = /^([+-])=(.+)$/.exec(trimmed);
  if (relativeMatch) {
    const sign = relativeMatch[1] === '-' ? -1 : 1;
    return dim.rectStart(targetRect) + sign * parsePixelsOrPercent(relativeMatch[2], containerSize);
  }

  if (dim.startTokens.includes(trimmed)) return dim.rectStart(targetRect);
  if (trimmed === 'center') return dim.rectStart(targetRect) + dim.rectSize(targetRect) / 2;
  if (dim.endTokens.includes(trimmed)) return dim.rectStart(targetRect) + dim.rectSize(targetRect);
  return dim.rectStart(targetRect) + parsePixelsOrPercent(trimmed, containerSize);
}

export function createPinEngine(options: PinEngineOptions): PinEngine {
  const {
    target,
    container = null,
    start,
    end,
    pinSpacing = true,
    endSpacing = 0,
    axis = 'y',
    anticipatePin = 0,
    pinType = "auto",
    invalidateOnRefresh = false,
    onRefresh,
    scrub = false,
    linked = null,
    snap,
    snapDuration = 0.3,
    reducedMotion = false,
    onPin,
    onUnpin,
    onUpdate,
  } = options;

  const dim: PinDimension = axis === 'x' ? horizontalDim : verticalDim;

  let reverted = false;
  let listening = false;
  let rafId = 0;
  let resizeObserver: ResizeObserver | null = null;
  let lastScroll = 0;
  let lastTickTime = 0; // for anticipatePin frame-time → px/sec velocity
  let scrubbedProgress = 0; // for scrub smoothing; equals raw progress when scrub === true
  // snap state: scroll-end detection + cancellable lerp toward nearest point.
  let snapping = false;
  let snapTarget = 0;
  let snapEndTimer: ReturnType<typeof setTimeout> | 0 = 0;
  let snapRafId = 0;
  let snapStartTime = 0;
  let snapFromProgress = 0;
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
  // Sticky path uses a wrapper element (the spacer is fixed-path only). The
  // resolved pinType is computed in attach()/refresh() via resolvePinType().
  let resolvedPinType: "fixed" | "sticky" = "fixed";
  let wrapper: HTMLDivElement | null = null;
  let stickyOffset = 0;
  let stickyRange = 0;

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

  // --- snap helpers ---
  function computeSnapPoints(): number[] {
    if (!snap) return [];
    if (Array.isArray(snap)) {
      return snap.filter((p) => p >= 0 && p <= 1).sort((a, b) => a - b);
    }
    if (typeof snap === 'number' && snap > 0 && snap <= 1) {
      const points: number[] = [];
      for (let p = 0; p <= 1.0000001; p += snap) points.push(Math.min(1, p));
      return points;
    }
    return [];
  }

  function nearestSnapPoint(progress: number): number | null {
    const points = computeSnapPoints();
    if (points.length === 0) return null;
    let nearest = points[0];
    let minDist = Math.abs(progress - points[0]);
    for (let i = 1; i < points.length; i++) {
      const d = Math.abs(progress - points[i]);
      if (d < minDist) {
        minDist = d;
        nearest = points[i];
      }
    }
    return nearest;
  }

  function cancelSnap() {
    snapping = false;
    if (snapEndTimer) {
      clearTimeout(snapEndTimer);
      snapEndTimer = 0;
    }
    if (snapRafId) {
      window.cancelAnimationFrame(snapRafId);
      snapRafId = 0;
    }
  }

  function startSnap(fromProgress: number, toProgress: number) {
    cancelSnap();
    snapping = true;
    snapTarget = toProgress;
    snapFromProgress = fromProgress;
    snapStartTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    snapRafId = window.requestAnimationFrame(snapTick);
  }

  function snapTick() {
    snapRafId = 0;
    if (!snapping || reverted) return;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = (now - snapStartTime) / 1000; // seconds
    const t = snapDuration > 0 ? Math.min(elapsed / snapDuration, 1) : 1;
    // easeOutCubic — smooth settle, no overshoot.
    const eased = 1 - Math.pow(1 - t, 3);
    const snapped = snapFromProgress + (snapTarget - snapFromProgress) * eased;
    state.progress = clamp(snapped, 0, 1);
    // Drive the linked instance if scrub is also set, so snap feeds scrub.
    if (scrub && linked && typeof linked.seek === 'function' && linked.duration > 0) {
      const seekTime = Math.max(0, Math.min(state.progress * linked.duration, linked.duration));
      linked.seek(seekTime);
    }
    emitUpdate();
    if (t >= 1) {
      snapping = false;
    } else {
      snapRafId = window.requestAnimationFrame(snapTick);
    }
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
    spacer.style.height = `${pinnedHeight + (axis === 'x' ? 0 : endSpacing)}px`;
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

  function applyStickyPinnedStyles() {
    if (!captured) return;
    target.setAttribute(PINNED_ATTR, "");
    target.style.position = "sticky";
    target.style.top = `${stickyOffset}px`;
    // Sticky preserves flow, so width/height/margins stay natural (captured
    // values are restored on unpin). We only override position + top.
  }

  function insertStickyWrapper() {
    if (!captured || wrapper || !pinSpacing) return;
    const cs = window.getComputedStyle(target);
    wrapper = document.createElement("div");
    wrapper.setAttribute(SPACER_ATTR, "");
    // Wrapper sized to the stick range + target height so the sticky element
    // has room to stick across the full pin range.
    wrapper.style.height = `${stickyRange + pinnedHeight}px`;
    wrapper.style.width = `${pinnedWidth}px`;
    wrapper.style.marginTop = cs.marginTop;
    wrapper.style.marginRight = cs.marginRight;
    wrapper.style.marginBottom = cs.marginBottom;
    wrapper.style.marginLeft = cs.marginLeft;
    wrapper.style.flexBasis = cs.flexBasis;
    wrapper.style.flexShrink = "0";
    wrapper.style.flexGrow = "0";
    wrapper.style.pointerEvents = "none";
    target.parentNode?.insertBefore(wrapper, target);
    wrapper.appendChild(target);
  }

  function removeStickyWrapper() {
    if (!wrapper) return;
    const parent = wrapper.parentNode;
    if (parent) {
      parent.insertBefore(target, wrapper);
    }
    wrapper.parentNode?.removeChild(wrapper);
    wrapper = null;
  }

  function restoreStickyStyles() {
    if (!captured) return;
    target.removeAttribute(PINNED_ATTR);
    target.style.position = captured.position;
    target.style.top = captured.top;
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
    const containerRect = !container
      ? new DOMRect(0, 0, dim.size(container), dim.size(container))
      : container.getBoundingClientRect();
    const containerSize = dim.size(container);

    let startScroll = resolveThreshold(start, 'top top', targetRect, containerRect, containerSize, dim);
    let endScroll = resolveThreshold(end, 'top bottom', targetRect, containerRect, containerSize, dim);

    // Thresholds resolve to absolute coords; convert to scroll positions by
    // removing the container's own offset (for the window that offset is 0).
    const containerOrigin = dim.rectStart(containerRect) + dim.scroll(container);
    startScroll -= containerOrigin;
    endScroll -= containerOrigin;

    if (endScroll <= startScroll) {
      // Degenerate range: fall back to a single-viewport pin window.
      endScroll = startScroll + Math.max(1, containerSize);
    }

    boundsStart = startScroll;
    // endSpacing is inert on axis x (horizontal scroll room comes from the user's
    // overflow-x container, not synthesized by the engine). On axis y it adds
    // trailing room below the pinned element, as today.
    boundsEnd = endScroll + (axis === 'x' ? 0 : endSpacing);

    // Fixed position the element will occupy while pinned, computed from the
    // natural document geometry so it is independent of the current scroll.
    const scroll = dim.scroll(container);
    const naturalDocStart = dim.rectStart(targetRect) + scroll + (container ? dim.rectStart(containerRect) : 0);
    const offsetInContainerAtStart = naturalDocStart - boundsStart;
    const fixedPrimary = container ? dim.rectStart(containerRect) + offsetInContainerAtStart : offsetInContainerAtStart;

    // Assign to fixedTop/fixedLeft based on axis. Cross-axis uses the target's
    // natural cross position (rect.left for vertical, rect.top for horizontal).
    if (axis === 'x') {
      fixedTop = targetRect.top;
      fixedLeft = fixedPrimary;
    } else {
      fixedTop = fixedPrimary;
      fixedLeft = targetRect.left;
    }
    pinnedWidth = targetRect.width;
    pinnedHeight = targetRect.height;

    state.offsetStart = boundsStart;
    state.offsetEnd = boundsEnd;
    state.distance = Math.max(0, boundsEnd - boundsStart);

    // Sticky-path geometry: the offset the target sticks at within its wrapper,
    // and the total scroll range the wrapper must span.
    stickyOffset = fixedTop; // for 'top top' this is 0; container-relative otherwise
    stickyRange = Math.max(0, boundsEnd - boundsStart);

    if (wasPinned) reapplyPinnedStylesAfterMeasurement();
  }

  // During bounds recomputation we may be currently pinned. Temporarily
  // restoring styles lets getBoundingClientRect() report the natural position,
  // then we re-pin. Kept private; only called from computeBounds.
  let measuringWhilePinned = false;
  function restoreStylesTemporarilyForMeasurement() {
    if (!captured || measuringWhilePinned) return;
    measuringWhilePinned = true;
    if (resolvedPinType === "sticky") {
      removeStickyWrapper();
      target.removeAttribute(PINNED_ATTR);
      target.style.position = captured.position;
      target.style.top = captured.top;
    } else {
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
      target.style.willChange = "";
    }
  }

  function reapplyPinnedStylesAfterMeasurement() {
    if (!measuringWhilePinned) return;
    measuringWhilePinned = false;
    if (resolvedPinType === "sticky") {
      applyStickyPinnedStyles();
      insertStickyWrapper();
    } else {
      applyPinnedStyles();
      insertSpacer();
    }
  }

  function pin() {
    if (isPinned || reverted || reducedMotion) return;
    if (!captured) captureGeometry();
    isPinned = true;
    state.isInView = true;
    state.began = true;
    if (resolvedPinType === "sticky") {
      insertStickyWrapper();
      applyStickyPinnedStyles();
    } else {
      insertSpacer();
      applyPinnedStyles();
    }
    onPin?.(buildState());
    emitUpdate();
  }

  function unpin() {
    if (!isPinned) return;
    isPinned = false;
    state.isInView = false;
    if (resolvedPinType === "sticky") {
      removeStickyWrapper();
      restoreStickyStyles();
    } else {
      removeSpacer();
      restoreStyles();
    }
    onUnpin?.(buildState());
  }

  function tick() {
    rafId = 0;
    if (reverted) return;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const dt = lastTickTime > 0 ? Math.min(now - lastTickTime, 100) : 16.67;
    lastTickTime = now;

    const currentScroll = dim.scroll(container);
    const velocity = currentScroll - lastScroll;
    lastScroll = currentScroll;

    // A real scroll event cancels any in-flight snap tween.
    if (snapping && velocity !== 0) {
      cancelSnap();
    }

    state.scroll = currentScroll;
    state.velocity = velocity;
    state.backward = velocity > 0 ? false : velocity < 0;

    const distance = state.distance || 1;
    const raw = (currentScroll - boundsStart) / distance;
    const progress = clamp(raw, 0, 1);
    state.progress = progress;
    state.offset = currentScroll - boundsStart;

    // anticipatePin: pre-pin on fast FORWARD entry only. Derive px/sec velocity
    // (frame-rate independent), shift effectiveStart forward by the anticipated
    // distance. Reverse/exit uses the real boundsStart — applying anticipation
    // to unpin would cause a reverse-direction flash. Forward-only = GSAP semantics.
    let effectiveStart = boundsStart;
    if (anticipatePin > 0 && velocity > 0) {
      const velocityPerSec = dt > 0 ? (velocity / dt) * 1000 : 0;
      const anticipatePx = Math.abs(velocityPerSec) * anticipatePin;
      effectiveStart = boundsStart - anticipatePx;
    }
    const shouldPin = currentScroll >= effectiveStart && currentScroll < boundsEnd;

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

    // scrub: drive the linked anime.js instance's playhead from progress.
    // `true`/`1` = 1:1 (direct seek). A number in (0,1) = exponential smoothing
    // toward the raw scroll progress (frame-rate independent).
    if (scrub && linked && typeof linked.seek === 'function' && linked.duration > 0) {
      if (scrub === true || scrub === 1) {
        scrubbedProgress = progress;
      } else {
        const smoothing = typeof scrub === 'number' && scrub > 0 && scrub < 1 ? scrub : 1;
        const t = 1 - Math.pow(1 - smoothing, dt / 16.67);
        scrubbedProgress += (progress - scrubbedProgress) * t;
      }
      // seek takes milliseconds; clamp to [0, duration].
      const seekTime = Math.max(0, Math.min(scrubbedProgress * linked.duration, linked.duration));
      linked.seek(seekTime);
    }

    // snap: detect scroll-end (velocity ≈ 0) and settle to nearest snap point.
    if (snap && !snapping && Math.abs(velocity) < 0.5) {
      // Debounce: settle after ~120ms of zero velocity.
      if (snapEndTimer) clearTimeout(snapEndTimer);
      snapEndTimer = setTimeout(() => {
        snapEndTimer = 0;
        if (snapping || reverted) return;
        const snapTo = nearestSnapPoint(state.progress);
        if (snapTo !== null && Math.abs(snapTo - state.progress) > 0.001) {
          startSnap(state.progress, snapTo);
        }
      }, 120);
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
      if (resolvedPinType === "sticky") {
        removeStickyWrapper();
        restoreStickyStyles();
      } else {
        removeSpacer();
        restoreStyles();
      }
      captured = null;
      captureGeometry();
      if (resolvedPinType === "sticky") {
        insertStickyWrapper();
        applyStickyPinnedStyles();
      } else {
        insertSpacer();
        applyPinnedStyles();
      }
    }
    onScrollOrResize();
  }

  /** Pick the element/window to listen for scroll on, guarding against a
   *  container that isn't a real event target (e.g. an unresolved ref). */
  function resolveScrollTarget(): Window | HTMLElement {
    if (container && typeof container.addEventListener === 'function') {
      return container;
    }
    return typeof window !== 'undefined' ? window : (container as HTMLElement);
  }

  function attach() {
    if (listening || reverted) return;
    listening = true;
    // Resolve the effective pinType via ancestor-walk for 'auto', or honor the
    // explicit 'fixed'/'sticky' choice.
    resolvedPinType = resolvePinType(target, pinType);
    // Defensive: a container that isn't a real Element (e.g. an unresolved ref
    // object) must never reach addEventListener — fall back to the window.
    const resolvedScrollTarget: Window | HTMLElement = resolveScrollTarget();
    resolvedScrollTarget.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    // Seed an initial measurement so state is correct before the first scroll.
    computeBounds();
    state.ready = true;
    onScrollOrResize();
    // When invalidateOnRefresh is true, watch the target for size changes
    // (dynamic content: accordions, lazy images, font swaps).
    if (invalidateOnRefresh && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        refresh();
      });
      resizeObserver.observe(target);
    }
  }

  function detach() {
    listening = false;
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    cancelSnap();
    const resolvedScrollTarget: Window | HTMLElement = resolveScrollTarget();
    resolvedScrollTarget.removeEventListener('scroll', onScrollOrResize);
    window.removeEventListener('resize', onResize);
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function refresh(): PinObserverLike {
    if (reverted) return buildState();
    if (!listening) attach();
    resolvedPinType = resolvePinType(target, pinType);
    if (invalidateOnRefresh) {
      // Force a full re-capture so the pinned box tracks new target geometry.
      if (isPinned) {
        if (resolvedPinType === "sticky") {
          removeStickyWrapper();
          restoreStickyStyles();
        } else {
          removeSpacer();
          restoreStyles();
        }
        captured = null;
      }
      computeBounds();
      if (isPinned) {
        captureGeometry();
        if (resolvedPinType === "sticky") {
          insertStickyWrapper();
          applyStickyPinnedStyles();
        } else {
          insertSpacer();
          applyPinnedStyles();
        }
      }
    } else {
      computeBounds();
    }
    onRefresh?.(buildState());
    onScrollOrResize();
    return buildState();
  }

  function revert() {
    if (reverted) return;
    reverted = true;
    state.reverted = true;
    state.ready = false;
    cancelSnap();
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
