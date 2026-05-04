/**
 * SplitTextEntry - Declarative animation entry for SplitText elements
 *
 * Works with <SplitText> to animate chars/words/lines declaratively.
 * Automatically registers with the parent timeline when split is ready.
 *
 * @example
 * ```tsx
 * const splitRef = useRef<SplitTextRef>(null);
 *
 * <AnimeTimeline loop defaults={{ ease: "outExpo", duration: 600 }}>
 *   <SplitText ref={splitRef} params={{ chars: true }}>
 *     <p>Hello World</p>
 *   </SplitText>
 *   <SplitTextEntry
 *     splitRef={splitRef}
 *     splitMode="chars"
 *     opacity={[0, 1]}
 *     translateY={[20, 0]}
 *     stagger={30}
 *   />
 * </AnimeTimeline>
 * ```
 */

import { forwardRef, type RefObject, useEffect, useImperativeHandle, useRef } from 'react';
import { stagger as animeStagger } from 'animejs';
import { useTimelineContext } from '../core';
import { safeJsonStringify } from '../core/helpers';
import type { SplitTextRef } from './SplitText';
import type { AnimatableProperties, PlaybackSettings, TweenParameters } from '../types';

// =============================================================================
// Types
// =============================================================================

export type SplitMode = 'chars' | 'words' | 'lines';

export interface SplitTextEntryProps
  extends Partial<AnimatableProperties>, TweenParameters, Omit<PlaybackSettings, 'autoplay'> {
  /**
   * Ref to the SplitText component instance.
   * Required to access the split elements.
   */
  splitRef: RefObject<SplitTextRef | null>;

  /**
   * Which split elements to animate.
   * Must match the SplitText params used.
   */
  splitMode?: SplitMode;

  /**
   * Stagger delay between each element (in ms).
   * Converted to anime.js stagger() for timeline positioning.
   */
  stagger?: number;

  /**
   * Position in the parent timeline.
   * When stagger is specified, it takes precedence over position.
   */
  position?: number | string;

  /**
   * Whether to enable this entry.
   * @default true
   */
  enabled?: boolean;
}

export interface SplitTextEntryRef {
  /**
   * Re-add this entry to the timeline
   */
  replay: () => void;

  /**
   * Remove this entry from the timeline
   */
  remove: () => void;
}

// =============================================================================
// Component
// =============================================================================

export const SplitTextEntry = forwardRef<SplitTextEntryRef, SplitTextEntryProps>(
  function SplitTextEntry(
    {
      splitRef,
      splitMode = 'chars',
      stagger: staggerDelay,
      position,
      enabled = true,
      ...animProps
    },
    ref
  ) {
    const { timeline, controls, isReady } = useTimelineContext();
    const addedRef = useRef(false);
    const splitElementsRef = useRef<Element[]>([]);

    // Stabilise animProps by serialising — the rest-spread creates a new object
    // reference every render which would otherwise cause the effect to loop.
    const animPropsStr = safeJsonStringify(animProps);

    // Keep a ref to the latest animProps so the effect closure always uses
    // the current values without re-running on every render.
    const animPropsRef = useRef(animProps);
    animPropsRef.current = animProps;

    // Get split elements from SplitText ref
    const getSplitElements = (): Element[] => {
      const split = splitRef.current?.split;
      if (!split) return [];

      const elements =
        splitMode === 'chars' ? split.chars : splitMode === 'words' ? split.words : split.lines;

      return elements as Element[];
    };

    // Resolve the effective position
    const resolvePosition = () => {
      return position;
    };

    // Add animation directly to the timeline, bypassing the controls.add()
    // abstraction which doesn't support the stagger position parameter correctly.
    const addAnimationDirect = (elements: Element[]) => {
      const tl = timeline.current;
      if (!tl) return;

      splitElementsRef.current = elements;

      // Create a copy of props to inject stagger if provided
      const props = { ...animPropsRef.current };
      if (staggerDelay !== undefined) {
        props.delay = animeStagger(staggerDelay) as any;
      }

      const pos = resolvePosition();

      tl.add(elements as any, props as any, pos);
      tl.init();

      // If the timeline started empty, it might have already completed.
      if ((tl as any).completed || tl.currentTime >= tl.duration) {
        tl.restart();
      } else {
        tl.play();
      }

      addedRef.current = true;
    };

    useEffect(() => {
      if (!enabled || !isReady || !timeline.current) return;

      // Try to get split elements immediately
      const elements = getSplitElements();

      if (elements.length > 0) {
        addAnimationDirect(elements);
      } else {
        // Elements not ready yet — poll briefly until available.
        let attempts = 0;
        const maxAttempts = 10;
        const timer = setInterval(() => {
          attempts++;
          const retryElements = getSplitElements();
          if (retryElements.length > 0) {
            addAnimationDirect(retryElements);
            clearInterval(timer);
          } else if (attempts >= maxAttempts) {
            clearInterval(timer);
          }
        }, 20);

        return () => {
          clearInterval(timer);
          if (addedRef.current) {
            try {
              controls.remove(splitElementsRef.current);
            } catch {
              // Ignore cleanup errors
            }
            addedRef.current = false;
          }
        };
      }

      return () => {
        if (addedRef.current) {
          try {
            controls.remove(splitElementsRef.current);
          } catch {
            // Ignore cleanup errors
          }
          addedRef.current = false;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, timeline, controls, isReady, splitMode, position, staggerDelay, animPropsStr]);

    // Expose imperative API
    useImperativeHandle(
      ref,
      () => ({
        replay: () => {
          const tl = timeline.current;
          if (!tl) return;

          const elements = getSplitElements();
          if (elements.length > 0) {
            controls.remove(elements);
            const props = { ...animPropsRef.current };
            if (staggerDelay !== undefined) {
              props.delay = animeStagger(staggerDelay) as any;
            }
            const pos = resolvePosition();
            tl.add(elements as any, props as any, pos);
            tl.init();

            if ((tl as any).completed || tl.currentTime >= tl.duration) {
              tl.restart();
            } else {
              tl.play();
            }
          }
        },
        remove: () => {
          const elements = getSplitElements();
          if (elements.length > 0) {
            controls.remove(elements);
          }
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [splitMode, position, staggerDelay, animPropsStr, controls, timeline]
    );

    return null;
  }
);

export default SplitTextEntry;
