/**
 * SplitText - Declarative text splitting component
 *
 * A component wrapper that provides declarative text splitting
 * with animation support using Anime.js.
 */

import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { splitText } from 'animejs';
import type { TextSplitter, TextSplitterParams } from 'animejs';
import { safeJsonStringify } from '../core/helpers';
import { mergeChildProps } from './svg-component-utils';

export interface SplitTextRef {
  /**
   * The TextSplitter instance
   */
  split: TextSplitter | null;

  /**
   * Whether the split is ready
   */
  isReady: boolean;

  /**
   * Split the text manually
   */
  splitNow: () => void;

  /**
   * Revert the split and restore original text
   */
  revert: () => void;

  /**
   * Refresh the split
   */
  refresh: () => void;

  /**
   * Update the HTML content and re-split
   */
  setHtml: (html: string) => void;
}

export interface SplitTextProps {
  /**
   * Child element containing text to split
   */
  children: ReactElement;

  /**
   * Text splitter parameters
   */
  params?: TextSplitterParams;

  /**
   * Whether to split on mount
   * @default true
   */
  splitOnMount?: boolean;

  /**
   * Callback when split is ready
   */
  onReady?: (split: TextSplitter) => void;

  /**
   * Custom className to add to the child
   */
  className?: string;
}

export const SplitText = forwardRef<SplitTextRef, SplitTextProps>(function SplitText(
  {
    children,
    params = { lines: true, words: true, chars: true },
    splitOnMount = true,
    onReady,
    className,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<TextSplitter | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const paramsStr = safeJsonStringify(params);

  // Expose the imperative handle immediately — the split ref is written
  // synchronously inside useLayoutEffect so sibling components (like
  // SplitTextEntry) can read it on their first render/effect.
  useImperativeHandle(
    ref,
    () => ({
      get split() {
        return splitRef.current;
      },
      get isReady() {
        return isReady;
      },
      splitNow: () => {
        const container = containerRef.current;
        if (!container) return;

        const child = container.firstElementChild as HTMLElement | null;
        if (!child) return;

        if (splitRef.current) {
          try {
            splitRef.current.revert();
          } catch {}
        }

        try {
          const parsedParams = JSON.parse(paramsStr);
          const instance = splitText(child, parsedParams);
          splitRef.current = instance;
          setIsReady(true);

          if (onReadyRef.current) {
            onReadyRef.current(instance);
          }
        } catch (error) {
          console.error('[react-animejs] SplitText error:', error);
          splitRef.current = null;
          setIsReady(false);
        }
      },
      revert: () => {
        if (splitRef.current) {
          try {
            splitRef.current.revert();
          } catch {}
          splitRef.current = null;
          setIsReady(false);
        }
      },
      refresh: () => {
        if (splitRef.current) {
          try {
            splitRef.current.refresh();
          } catch (error) {
            console.error('[react-animejs] SplitText refresh error:', error);
          }
        }
      },
      setHtml: (html: string) => {
        if (splitRef.current) {
          splitRef.current.html = html;
          splitRef.current.refresh();
        }
      },
    }),
    [paramsStr, isReady]
  );

  // Use useLayoutEffect for synchronous DOM manipulation.
  // The split instance is written to splitRef.current synchronously so that
  // useImperativeHandle (which also runs during layout) exposes it before
  // any useEffect in sibling components fires.
  useLayoutEffect(() => {
    if (!splitOnMount) return;

    const container = containerRef.current;
    if (!container) return;

    const child = container.firstElementChild as HTMLElement | null;
    if (!child) {
      console.warn('[SplitText] No child element found');
      return;
    }

    try {
      const parsedParams = JSON.parse(paramsStr);
      const instance = splitText(child, parsedParams);
      splitRef.current = instance;

      // Set ready synchronously so the ref is usable by sibling effects
      setIsReady(true);

      // Fire the onReady callback after a frame to ensure DOM is painted
      requestAnimationFrame(() => {
        if (onReadyRef.current) {
          onReadyRef.current(instance);
        }
      });
    } catch (error) {
      console.error('[react-animejs] SplitText error:', error);
      splitRef.current = null;
      setIsReady(false);
    }

    return () => {
      if (splitRef.current) {
        try {
          splitRef.current.revert();
        } catch {}
        splitRef.current = null;
      }
      setIsReady(false);
    };
  }, [paramsStr, splitOnMount]);

  if (!isValidElement(children)) {
    console.warn('[react-animejs] SplitText requires a single valid React element as child');
    return children;
  }

  const child = children as ReactElement;

  return (
    <div ref={containerRef}>
      {cloneElement(
        child,
        mergeChildProps(child as ReactElement<any>, { className })
      )}
    </div>
  );
});

export default SplitText;
