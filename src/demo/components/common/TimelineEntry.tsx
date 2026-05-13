import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { useTimelineContext } from '@/lib/react-animejs/core';
import { resolveTarget, safeJsonStringify } from '@/lib/react-animejs/core';
import type {
  AnimatableProperties,
  AnimationTargets,
  PlaybackSettings,
  TimelineEntry as TimelineEntryType,
  TweenParameters,
} from '@/lib/react-animejs/types';

export interface TimelineEntryProps
  extends Partial<AnimatableProperties>, TweenParameters, Omit<PlaybackSettings, 'autoplay'> {
  targets?: AnimationTargets;
  position?: number | string;
  children?: ReactElement;
  enabled?: boolean;
  onAdded?: () => void;
}

export interface TimelineEntryRef {
  replay: () => void;
  remove: () => void;
}

export const TimelineEntry = forwardRef<TimelineEntryRef, TimelineEntryProps>(
  function TimelineEntry(
    { targets, position, children, enabled = true, onAdded, ...animProps },
    ref
  ) {
    const { timeline, controls, isReady } = useTimelineContext();
    const elementRef = useRef<HTMLElement | SVGElement | null>(null);
    const addedRef = useRef(false);

    const animPropsStr = safeJsonStringify(animProps);
    const animPropsRef = useRef(animProps);
    animPropsRef.current = animProps;

    // Track the resolved targets to clean them up properly
    const resolvedTargetsRef = useRef<
      HTMLElement | SVGElement | NodeList | (HTMLElement | SVGElement)[] | null
    >(null);

    useEffect(() => {
      if (!enabled || !isReady || !timeline.current) return;

      const resolvedTargets = targets ? resolveTarget(targets) : elementRef.current;
      if (!resolvedTargets) return;
      resolvedTargetsRef.current = resolvedTargets;

      const { position: _pos, ...restProps } = animPropsRef.current;
      const entry: TimelineEntryType = {
        targets: resolvedTargets,
        position: position ?? _pos,
        ...restProps,
      } as TimelineEntryType;

      controls.add(entry);
      addedRef.current = true;

      onAdded?.();

      return () => {
        if (addedRef.current && timeline.current) {
          try {
            controls.remove(resolvedTargetsRef.current);
          } catch {}
          addedRef.current = false;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, timeline, controls, isReady, targets, position, animPropsStr, onAdded]);

    useImperativeHandle(
      ref,
      () => ({
        replay: () => {
          if (!timeline.current || !targets) return;
          const resolvedTargets = resolveTarget(targets);
          if (!resolvedTargets) return;

          controls.remove(resolvedTargets);
          controls.add({
            targets: resolvedTargets,
            position,
            ...animPropsRef.current,
          } as TimelineEntryType);
        },
        remove: () => {
          if (!targets) return;
          const resolvedTargets = resolveTarget(targets);
          if (!resolvedTargets) return;
          controls.remove(resolvedTargets);
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [targets, position, animPropsStr, controls, timeline]
    );

    if (children) {
      if (!isValidElement(children)) {
        console.warn(
          '[react-animejs] TimelineEntry requires a single valid React element as child'
        );
        return children as ReactNode;
      }

      const child = children as ReactElement;
      return cloneElement(child, {
        ref: (node: HTMLElement | SVGElement | null) => {
          elementRef.current = node;
          const existingRef = (child.props as { ref?: unknown }).ref;
          if (typeof existingRef === 'function') {
            existingRef(node);
          } else if (existingRef && typeof existingRef === 'object') {
            (existingRef as { current: unknown }).current = node;
          }
        },
      } as Partial<unknown>);
    }

    return null;
  }
);

export default TimelineEntry;
