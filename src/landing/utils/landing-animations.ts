import type { UseAnimeOptions } from '@shakibdshy/react-animejs';

export const revealFromBelow: Partial<UseAnimeOptions> = {
  translateY: [30, 0],
  opacity: [0, 1],
  duration: 800,
  ease: 'outCubic',
  autoplay: false,
};

export const revealFromBelowSmall: Partial<UseAnimeOptions> = {
  translateY: [20, 0],
  opacity: [0, 1],
  duration: 600,
  ease: 'outCubic',
  autoplay: false,
};

export const heroCharReveal: Partial<UseAnimeOptions> = {
  translateY: [80, 0],
  rotateX: [-40, 0],
  opacity: [0, 1],
  duration: 700,
  ease: 'outCubic',
  delay: 400,
  autoplay: true,
};

export const fadeInDelay = (ms: number): Partial<UseAnimeOptions> => ({
  opacity: [0, 1],
  duration: 600,
  delay: ms,
  ease: 'outCubic',
  autoplay: true,
});

export const staggerFadeInUp: Partial<UseAnimeOptions> = {
  translateY: [20, 0],
  opacity: [0, 1],
  duration: 500,
  ease: 'outCubic',
  autoplay: false,
};
