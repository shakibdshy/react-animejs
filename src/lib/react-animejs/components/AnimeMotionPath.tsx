import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type RefObject,
  type SVGProps,
  useId,
  useRef,
} from 'react';
import { svg } from 'animejs';
import type { AnimationState, PlaybackControls, UseAnimeOptions } from '../types';
import { mergeChildProps, resolveSvgElement } from '../utils/svg-component-utils';
import { type SvgComponentRef, useSvgAnimation } from '../hooks/use-anime-svg';

export interface AnimeMotionPathRef extends SvgComponentRef {
  controls: PlaybackControls;
}

export interface AnimeMotionPathProps extends Omit<
  UseAnimeOptions,
  'targets' | 'selector' | 'translateX' | 'translateY' | 'rotate'
> {
  children: ReactElement;
  path: string | SVGPathElement | RefObject<SVGPathElement | null>;
  offset?: number;
  showPath?: boolean;
  pathProps?: SVGProps<SVGPathElement>;
  onReady?: (api: AnimeMotionPathRef) => void;
  onControlsReady?: (controls: PlaybackControls) => void;
  onStateChange?: (state: AnimationState) => void;
  className?: string;
}

export const AnimeMotionPath = forwardRef<AnimeMotionPathRef, AnimeMotionPathProps>(
  function AnimeMotionPath(
    {
      children,
      path,
      offset = 0,
      showPath = false,
      pathProps,
      onReady,
      onControlsReady,
      onStateChange,
      className,
      deps = [],
      enabled = true,
      autoplay = false,
      onBegin,
      onComplete,
      onUpdate,
      onRender,
      onBeforeUpdate,
      onLoop,
      onPause,
      ...animationProps
    },
    ref
  ) {
    const internalPathRef = useRef<SVGPathElement | null>(null);
    const internalPathId = useId();

    const normalizedPath = typeof path === 'string' ? path.trim() : null;

    const { childRef } = useSvgAnimation<SVGElement>({
      enabled,
      autoplay,
      deps: [...deps, internalPathRef.current], // add internalRef as dependency for when path is rendered
      specificOptions: {
        path: normalizedPath,
        offset,
        showPath,
      },
      callbacks: {
        onReady,
        onControlsReady,
        onStateChange,
        onBegin,
        onComplete,
        onUpdate,
        onRender,
        onBeforeUpdate,
        onLoop,
        onPause,
      },
      animationProps,
      refValueBuilder: (base) => base as AnimeMotionPathRef,
      forwardedRef: ref,
      createConfig: (source) => {
        const motionPath =
          typeof path === 'string' ? internalPathRef.current : resolveSvgElement(path);
        if (!motionPath) return null;

        if (typeof path === 'string' && !normalizedPath) return null;

        const motionPathTagName = motionPath.tagName?.toLowerCase();
        if (
          motionPathTagName === 'path' &&
          !((motionPath as SVGElement).getAttribute('d') || '').trim()
        ) {
          return null;
        }

        return {
          target: source,
          config: svg.createMotionPath(motionPath, offset) as Record<string, unknown>,
        };
      },
    });

    if (!isValidElement(children)) {
      console.warn('[react-animejs] AnimeMotionPath requires a single valid SVG element as child');
      return children;
    }

    const childElement = cloneElement(
      children,
      mergeChildProps(children as ReactElement<any>, { ref: childRef, className })
    );

    if (typeof path !== 'string') {
      return childElement;
    }

    const { d: _ignoredPathData, ref: _ignoredPathRef, ...safePathProps } = pathProps ?? {};

    return (
      <>
        <path
          ref={internalPathRef}
          id={safePathProps.id ?? internalPathId}
          d={normalizedPath ?? ''}
          fill="none"
          stroke={showPath ? (safePathProps.stroke ?? 'currentColor') : 'none'}
          {...safePathProps}
          opacity={showPath ? safePathProps.opacity : 0}
          aria-hidden={safePathProps['aria-hidden'] ?? true}
          pointerEvents={safePathProps.pointerEvents ?? 'none'}
        />
        {childElement}
      </>
    );
  }
);

export default AnimeMotionPath;
