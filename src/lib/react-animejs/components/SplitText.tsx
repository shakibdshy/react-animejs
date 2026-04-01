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

  const paramsStr = JSON.stringify(params);

  // Use useLayoutEffect for synchronous DOM manipulation
  useLayoutEffect(() => {
    if (!splitOnMount) return;

    const container = containerRef.current;
    if (!container) return;

    // Get the actual child element that contains the text
    const child = container.firstElementChild as HTMLElement | null;
    if (!child) {
      console.warn('[SplitText] No child element found');
      return;
    }

    try {
      const parsedParams = JSON.parse(paramsStr);
      console.log('[SplitText] Splitting with params:', parsedParams);
      console.log('[SplitText] Target element:', child.tagName, child.textContent?.slice(0, 50));

      // Use the child element as the target, not the wrapper
      const instance = splitText(child, parsedParams);
      console.log('[SplitText] Split complete:', {
        lines: instance.lines?.length,
        words: instance.words?.length,
        chars: instance.chars?.length,
      });
      splitRef.current = instance;

      // Use requestAnimationFrame to ensure DOM is painted before calling onReady
      requestAnimationFrame(() => {
        setIsReady(true);

        // Call onReady after split is complete and DOM is painted
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

        if (splitRef.current) {
          try {
            splitRef.current.revert();
          } catch {}
        }

        try {
          const parsedParams = JSON.parse(paramsStr);
          const instance = splitText(container, parsedParams);
          splitRef.current = instance;

          requestAnimationFrame(() => {
            setIsReady(true);

            if (onReadyRef.current) {
              onReadyRef.current(instance);
            }
          });
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

  if (!isValidElement(children)) {
    console.warn('[react-animejs] SplitText requires a single valid React element as child');
    return children;
  }

  const child = children as ReactElement;

  return (
    <div ref={containerRef}>
      {cloneElement(child, {
        className: className
          ? `${(child.props as { className?: string }).className || ''} ${className}`.trim()
          : (child.props as { className?: string }).className,
      } as Partial<unknown>)}
    </div>
  );
});

export default SplitText;
