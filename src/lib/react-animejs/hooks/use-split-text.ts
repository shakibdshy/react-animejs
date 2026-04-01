/**
 * useSplitText - Text splitting hook for React
 *
 * Provides a React-friendly wrapper around Anime.js splitText functionality
 * for splitting text into lines, words, and characters with animation support.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { splitText } from "animejs";
import type { TextSplitter, TextSplitterParams } from "animejs";
import type { RefObject } from "react";

export interface UseSplitTextOptions {
  /**
   * Ref to the target element containing text
   */
  target: RefObject<HTMLElement | SVGElement | null>;

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
   * Deps array for re-splitting when dependencies change
   */
  deps?: unknown[];

  /**
   * Callback when split is ready
   */
  onReady?: (split: TextSplitter) => void;
}

export interface UseSplitTextReturn {
  /**
   * Ref to attach to the target element
   */
  ref: RefObject<HTMLElement | SVGElement | null>;

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
   * Refresh the split (call after content changes)
   */
  refresh: () => void;

  /**
   * Update the HTML content and re-split
   */
  setHtml: (html: string) => void;

  /**
   * Add a persistent effect to the split elements
   */
  addEffect: (
    effect: (
      handlers: {
        lines: HTMLElement[];
        words: HTMLElement[];
        chars: HTMLElement[];
      },
    ) => void,
  ) => void;
}

export function useSplitText(
  options: UseSplitTextOptions,
): UseSplitTextReturn {
  const {
    target,
    params = { lines: true, words: true, chars: true },
    splitOnMount = true,
    deps = [],
    onReady,
  } = options;

  const splitRef = useRef<TextSplitter | null>(null);
  const [isReady, setIsReady] = useState(false);

  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const paramsStr = JSON.stringify(params);

  const performSplit = useCallback(() => {
    const element = target.current as HTMLElement | null;
    if (!element) return null;

    try {
      const parsedParams = JSON.parse(paramsStr);
      const split = splitText(element as HTMLElement, parsedParams);

      if (onReadyRef.current) {
        onReadyRef.current(split);
      }

      return split;
    } catch (error) {
      console.error("[react-animejs] splitText error:", error);
      return null;
    }
  }, [target, paramsStr]);

  useEffect(() => {
    if (!splitOnMount) return;

    const split = performSplit();
    splitRef.current = split;
    setIsReady(split !== null);

    return () => {
      if (splitRef.current) {
        try {
          splitRef.current.revert();
        } catch {
        }
        splitRef.current = null;
      }
      setIsReady(false);
    };
  }, [performSplit, splitOnMount]);

  useEffect(() => {
    if (deps.length > 0) {
      if (splitRef.current) {
        try {
          splitRef.current.revert();
        } catch {
        }
      }

      const split = performSplit();
      splitRef.current = split;
      setIsReady(split !== null);
    }
  }, [deps, performSplit]);

  const splitNow = useCallback(() => {
    if (splitRef.current) {
      try {
        splitRef.current.revert();
      } catch {
      }
    }

    const split = performSplit();
    splitRef.current = split;
    setIsReady(split !== null);
  }, [performSplit]);

  const revert = useCallback(() => {
    if (splitRef.current) {
      try {
        splitRef.current.revert();
      } catch {
      }
      splitRef.current = null;
      setIsReady(false);
    }
  }, []);

  const refresh = useCallback(() => {
    if (splitRef.current) {
      try {
        splitRef.current.refresh();
      } catch (error) {
        console.error("[react-animejs] refresh error:", error);
      }
    }
  }, []);

  const setHtml = useCallback((html: string) => {
    if (splitRef.current) {
      splitRef.current.html = html;
      splitRef.current.refresh();
    }
  }, []);

  const addEffect = useCallback(
    (
      effect: (
        handlers: {
          lines: HTMLElement[];
          words: HTMLElement[];
          chars: HTMLElement[];
        },
      ) => void,
    ) => {
      if (splitRef.current) {
        splitRef.current.addEffect(effect as TextSplitter["addEffect"] extends (
          fn: infer F,
        ) => unknown
          ? F
          : never);
      }
    },
    [],
  );

  return useMemo<UseSplitTextReturn>(
    () => ({
      ref: target,
      split: splitRef.current,
      isReady,
      splitNow,
      revert,
      refresh,
      setHtml,
      addEffect,
    }),
    [
      target,
      isReady,
      splitNow,
      revert,
      refresh,
      setHtml,
      addEffect,
    ],
  );
}
