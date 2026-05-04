import { cloneElement, forwardRef, isValidElement, type ReactElement, type RefObject } from 'react';
import { svg } from 'animejs';
import type { AnimationState, PlaybackControls, UseAnimeOptions } from '../types';
import {
  mergeChildProps,
  resolveSvgElement,
  type SvgComponentRef,
  useSvgAnimation,
} from '../utils/svg-component-utils';

type MorphableShape = SVGPathElement | SVGPolygonElement | SVGPolylineElement;

export interface AnimeMorphRef extends SvgComponentRef {
  controls: PlaybackControls;
}

export interface AnimeMorphProps extends Omit<
  UseAnimeOptions,
  'targets' | 'selector' | 'd' | 'points'
> {
  children: ReactElement;
  to?: string | MorphableShape | RefObject<MorphableShape | null>;
  target?: MorphableShape | RefObject<MorphableShape | null>;
  precision?: number;
  attribute?: 'd' | 'points';
  onReady?: (api: AnimeMorphRef) => void;
  onControlsReady?: (controls: PlaybackControls) => void;
  onStateChange?: (state: AnimationState) => void;
  className?: string;
}

function getCurrentSvgAttribute(source: MorphableShape, attribute: 'd' | 'points') {
  return source.getAttribute(attribute) ?? '';
}

export const AnimeMorph = forwardRef<AnimeMorphRef, AnimeMorphProps>(function AnimeMorph(
  {
    children,
    to,
    target,
    precision = 0.33,
    attribute,
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
  const { childRef } = useSvgAnimation<MorphableShape>({
    enabled,
    autoplay,
    deps,
    specificOptions: {
      to: typeof to === 'string' ? to : null, // only stringify strings safely
      precision,
      attribute,
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
    refValueBuilder: (base) => base as AnimeMorphRef,
    forwardedRef: ref,
    createConfig: (source) => {
      const morphTarget = resolveSvgElement(to ?? target);
      if (!morphTarget && typeof to !== 'string') return null;

      const morphAttribute =
        attribute ?? (source.tagName.toLowerCase() === 'path' ? 'd' : 'points');

      const morphValue =
        typeof to === 'string'
          ? [getCurrentSvgAttribute(source as MorphableShape, morphAttribute), to]
          : svg.morphTo(morphTarget as MorphableShape, precision);

      return {
        target: source as MorphableShape,
        config: { [morphAttribute]: morphValue },
      };
    },
  });

  if (!isValidElement(children)) {
    console.warn('[react-animejs] AnimeMorph requires a single valid SVG element as child');
    return children;
  }

  return cloneElement(
    children,
    mergeChildProps(children as ReactElement<any>, { ref: childRef, className })
  );
});

export default AnimeMorph;
