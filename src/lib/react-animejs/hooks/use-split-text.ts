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
import { safeJsonStringify } from '../core';
import { useDependencySignal } from './use-dependency-signal';

export interface UseSplitTextOptions {
  /**
   * Ref to the target element containing text
   */
  target: RefObject<Element | null>;

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
  ref: RefObject<Element | null>;

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

  /**
   * Gets the split root element
   */
  $target: HTMLElement | null;

  /**
   * Gets if debug styles are visible
   */
  debug: boolean;

  /**
   * Sets debug mode
   */
  setDebug: (debug: boolean) => void;

  /**
   * Gets if spaces are included in the split
   */
  includeSpaces: boolean;

  /**
   * Sets whether to include spaces
   */
  setIncludeSpaces: (include: boolean) => void;

  /**
   * Gets the line template
   */
  lineTemplate: string | false | ((value?: Node | HTMLElement) => any) | undefined;

  /**
   * Sets the line template
   */
  setLineTemplate: (template: string | false | ((value?: Node | HTMLElement) => any)) => void;

  /**
   * Gets the word template
   */
  wordTemplate: string | false | ((value?: Node | HTMLElement) => any) | undefined;

  /**
   * Sets the word template
   */
  setWordTemplate: (template: string | false | ((value?: Node | HTMLElement) => any)) => void;

  /**
   * Gets the char template
   */
  charTemplate: string | false | ((value?: Node | HTMLElement) => any) | undefined;

  /**
   * Sets the char template
   */
  setCharTemplate: (template: string | false | ((value?: Node | HTMLElement) => any)) => void;
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

  const paramsRef = useRef(params);
  paramsRef.current = params;
  const paramsKey = useMemo(() => safeJsonStringify(params), [params]);
  const depsSignal = useDependencySignal(deps);

  const performSplit = useCallback(() => {
    const element = target.current as HTMLElement | null;
    if (!element) return null;

    try {
      const split = splitText(element, paramsRef.current);

      if (onReadyRef.current) {
        onReadyRef.current(split);
      }

      return split;
    } catch (error) {
      console.error("[react-animejs] splitText error:", error);
      return null;
    }
  }, [target]);

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
  }, [performSplit, splitOnMount, depsSignal, paramsKey]);

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

  const $target = splitRef.current?.$target ?? null;
  const debug = splitRef.current?.debug ?? false;
  const includeSpaces = splitRef.current?.includeSpaces ?? false;
  const lineTemplate = splitRef.current?.lineTemplate;
  const wordTemplate = splitRef.current?.wordTemplate;
  const charTemplate = splitRef.current?.charTemplate;

  const setDebug = useCallback((debug: boolean) => {
    if (splitRef.current) {
      splitRef.current.debug = debug;
    }
  }, []);

  const setIncludeSpaces = useCallback((include: boolean) => {
    if (splitRef.current) {
      splitRef.current.includeSpaces = include;
      splitRef.current.refresh();
    }
  }, []);

  const setLineTemplate = useCallback((template: string | false | ((value?: Node | HTMLElement) => any)) => {
    if (splitRef.current) {
      splitRef.current.lineTemplate = template;
      splitRef.current.refresh();
    }
  }, []);

  const setWordTemplate = useCallback((template: string | false | ((value?: Node | HTMLElement) => any)) => {
    if (splitRef.current) {
      splitRef.current.wordTemplate = template;
      splitRef.current.refresh();
    }
  }, []);

  const setCharTemplate = useCallback((template: string | false | ((value?: Node | HTMLElement) => any)) => {
    if (splitRef.current) {
      splitRef.current.charTemplate = template;
      splitRef.current.refresh();
    }
  }, []);

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
      $target,
      debug,
      setDebug,
      includeSpaces,
      setIncludeSpaces,
      lineTemplate,
      setLineTemplate,
      wordTemplate,
      setWordTemplate,
      charTemplate,
      setCharTemplate,
    }),
    [
      target,
      isReady,
      splitNow,
      revert,
      refresh,
      setHtml,
      addEffect,
      $target,
      debug,
      setDebug,
      includeSpaces,
      setIncludeSpaces,
      lineTemplate,
      setLineTemplate,
      wordTemplate,
      setWordTemplate,
      charTemplate,
      setCharTemplate,
    ],
  );
}
