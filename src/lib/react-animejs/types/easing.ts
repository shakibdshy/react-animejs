import type { Spring as AnimeSpring } from 'animejs';

export type EasingName =
  | 'linear'
  | 'none'
  | 'in'
  | 'out'
  | 'inOut'
  | 'outIn'
  | 'inQuad'
  | 'outQuad'
  | 'inOutQuad'
  | 'outInQuad'
  | 'inCubic'
  | 'outCubic'
  | 'inOutCubic'
  | 'outInCubic'
  | 'inQuart'
  | 'outQuart'
  | 'inOutQuart'
  | 'outInQuart'
  | 'inQuint'
  | 'outQuint'
  | 'inOutQuint'
  | 'outInQuint'
  | 'inSine'
  | 'outSine'
  | 'inOutSine'
  | 'outInSine'
  | 'inCirc'
  | 'outCirc'
  | 'inOutCirc'
  | 'outInCirc'
  | 'inExpo'
  | 'outExpo'
  | 'inOutExpo'
  | 'outInExpo'
  | 'inBounce'
  | 'outBounce'
  | 'inOutBounce'
  | 'outInBounce'
  | 'inBack'
  | 'outBack'
  | 'inOutBack'
  | 'outInBack'
  | 'inElastic'
  | 'outElastic'
  | 'inOutElastic'
  | 'outInElastic';

export type EasingPattern =
  | `in(${number})`
  | `out(${number})`
  | `inOut(${number})`
  | `outIn(${number})`
  | `spring(${number})`
  | `spring(${number}, ${number})`
  | `steps(${number})`
  | `steps(${number}, start)`
  | `steps(${number}, end)`
  | `cubicBezier(${number}, ${number}, ${number}, ${number})`
  | `linear(${number}, ${number})`
  | `irregular(${number})`
  | `irregular(${number}, ${number})`;

export type EasingFunction = (t: number) => number;

export type Easing =
  | EasingName
  | EasingPattern
  | EasingFunction
  | AnimeSpring
  | (string & {});

export interface SpringParams {
  bounce?: number;
  duration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  onComplete?: () => void;
}
