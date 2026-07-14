import { cloneElement, forwardRef, isValidElement, type ReactElement } from 'react';
import { svg } from 'animejs';
import type { AnimationState, PlaybackControls, UseAnimeOptions } from '../types';
import { mergeChildProps } from '../utils/svg-component-utils';
import { type SvgComponentRef, useSvgAnimation } from '../hooks/use-anime-svg';

type DrawableShape =
  | SVGPathElement
  | SVGCircleElement
  | SVGRectElement
  | SVGLineElement
  | SVGPolylineElement
  | SVGPolygonElement
  | SVGEllipseElement;

export interface AnimeDrawRef extends SvgComponentRef {
  controls: PlaybackControls;
}

export interface AnimeDrawProps extends Omit<UseAnimeOptions, 'targets' | 'selector'> {
  children: ReactElement;
  draw?: string | string[];
  onReady?: (api: AnimeDrawRef) => void;
  onControlsReady?: (controls: PlaybackControls) => void;
  onStateChange?: (state: AnimationState) => void;
  className?: string;
}

export const AnimeDraw = forwardRef<AnimeDrawRef, AnimeDrawProps>(function AnimeDraw(
  {
    children,
    draw = ['0 0', '0 1'],
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
  const { childRef } = useSvgAnimation<DrawableShape>({
    enabled,
    autoplay,
    deps,
    specificOptions: { draw },
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
    refValueBuilder: (base) => base as AnimeDrawRef,
    forwardedRef: ref,
    createConfig: (source) => ({
      target: svg.createDrawable(source) as any,
      config: { draw },
    }),
  });

  if (!isValidElement(children)) {
    console.warn('[react-animejs] AnimeDraw requires a single valid SVG element as child');
    return children;
  }

  return cloneElement(
    children,
    mergeChildProps(children as ReactElement<any>, { ref: childRef, className })
  );
});

export default AnimeDraw;
