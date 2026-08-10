import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { animate } from 'animejs';
import type {
  AnimationParams,
  JSAnimation,
  StaggerFunction,
} from 'animejs';
import type {
  AnimatableProperties,
  Easing,
  PlaybackSettings,
  TweenParameters,
} from '../types';

/** Animation configuration applied to each entering batch. */
export type AnimeBatchAnimation =
  Omit<
    Partial<AnimatableProperties> &
      Omit<PlaybackSettings, 'autoplay' | 'delay'> &
      TweenParameters,
    'autoplay'
  > & {
    delay?: number | StaggerFunction<number>;
    ease?: Easing;
  };

export interface AnimeBatchProps {
  /** Elements to observe. They must match `selector`. */
  children: ReactNode;
  /** Animation configuration applied to each batch. */
  animation: AnimeBatchAnimation;
  /** Scroll container. Omit to use the browser viewport. */
  rootRef?: React.RefObject<Element | null>;
  /** Selector for elements inside this component to observe. */
  selector?: string;
  /** Time window, in milliseconds, used to collect entering elements. */
  interval?: number;
  /** Maximum number of elements animated in one batch. */
  batchMax?: number;
  /** Whether each element should animate only once. */
  once?: boolean;
  /** IntersectionObserver visibility threshold. */
  threshold?: number | number[];
  /** IntersectionObserver root margin. */
  rootMargin?: string;
  /** Disable observation and animation. */
  enabled?: boolean;
  /** Called when a batch animation starts. */
  onBatchStart?: (elements: Element[], animation: JSAnimation) => void;
  /** Called when a batch animation completes. */
  onBatchComplete?: (elements: Element[], animation: JSAnimation) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Animates elements as they enter the viewport in short, configurable batches.
 *
 * Add `data-anime-batch` to the elements that should be observed:
 *
 * ```tsx
 * <AnimeBatch animation={{ opacity: [0, 1], delay: stagger(100) }}>
 *   <Card data-anime-batch />
 * </AnimeBatch>
 * ```
 */
export function AnimeBatch({
  children,
  animation,
  rootRef,
  selector = '[data-anime-batch]',
  interval = 100,
  batchMax,
  once = true,
  threshold = 0,
  rootMargin = '0px',
  enabled = true,
  onBatchComplete,
  onBatchStart,
  className,
  style,
}: AnimeBatchProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef(animation);
  const callbacksRef = useRef({ onBatchComplete, onBatchStart });
  animationRef.current = animation;
  callbacksRef.current = { onBatchComplete, onBatchStart };

  useEffect(() => {
    if (!enabled) return;

    const scope = scopeRef.current;
    if (!scope || typeof IntersectionObserver === 'undefined') return;

    const pending = new Set<Element>();
    const activeAnimations = new Set<JSAnimation>();
    let flushTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;

    const animateBatch = (elements: Element[]) => {
      const instance = animate(elements, animationRef.current as AnimationParams);
      activeAnimations.add(instance);
      callbacksRef.current.onBatchStart?.(elements, instance);

      void instance.then(() => {
        activeAnimations.delete(instance);
        if (!disposed) callbacksRef.current.onBatchComplete?.(elements, instance);
      });
    };

    const flush = () => {
      flushTimer = undefined;
      if (pending.size === 0) return;

      const queued = Array.from(pending);
      pending.clear();

      if (!batchMax || batchMax < 1) {
        animateBatch(queued);
        return;
      }

      for (let index = 0; index < queued.length; index += batchMax) {
        animateBatch(queued.slice(index, index + batchMax));
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (once) observer.unobserve(entry.target);
          pending.add(entry.target);
        });

        if (pending.size > 0 && flushTimer === undefined) {
          flushTimer = setTimeout(flush, Math.max(0, interval));
        }
      },
      {
        root: rootRef?.current ?? null,
        rootMargin,
        threshold,
      },
    );

    scope.querySelectorAll(selector).forEach((element) => {
      observer.observe(element);
    });

    return () => {
      disposed = true;
      observer.disconnect();
      if (flushTimer !== undefined) clearTimeout(flushTimer);
      activeAnimations.forEach((instance) => instance.cancel());
    };
  }, [
    batchMax,
    enabled,
    interval,
    once,
    rootMargin,
    rootRef,
    selector,
    threshold,
  ]);

  return (
    <div ref={scopeRef} className={className} style={style}>
      {children}
    </div>
  );
}

export default AnimeBatch;
