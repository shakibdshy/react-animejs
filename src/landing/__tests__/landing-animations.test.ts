import { describe, expect, it } from 'vitest';
import {
  revealFromBelow,
  revealFromBelowSmall,
  heroCharReveal,
  fadeInDelay,
  staggerFadeInUp,
} from '../utils/landing-animations';

describe('landing-animations', () => {
  describe('revealFromBelow', () => {
    it('has correct translateY values', () => {
      expect(revealFromBelow.translateY).toEqual([30, 0]);
    });

    it('has correct opacity values', () => {
      expect(revealFromBelow.opacity).toEqual([0, 1]);
    });

    it('is not autoplay', () => {
      expect(revealFromBelow.autoplay).toBe(false);
    });

    it('has easing set', () => {
      expect(revealFromBelow.ease).toBe('outCubic');
    });
  });

  describe('revealFromBelowSmall', () => {
    it('has smaller translateY range', () => {
      expect(revealFromBelowSmall.translateY).toEqual([20, 0]);
    });

    it('has shorter duration', () => {
      expect(revealFromBelowSmall.duration).toBe(600);
    });
  });

  describe('heroCharReveal', () => {
    it('has correct translateY', () => {
      expect(heroCharReveal.translateY).toEqual([80, 0]);
    });

    it('has correct rotateX', () => {
      expect(heroCharReveal.rotateX).toEqual([-40, 0]);
    });

    it('is autoplay', () => {
      expect(heroCharReveal.autoplay).toBe(true);
    });

    it('has a delay value', () => {
      expect(typeof heroCharReveal.delay).toBe('number');
    });
  });

  describe('fadeInDelay', () => {
    it('returns an animation config with the given delay', () => {
      const config = fadeInDelay(400);
      expect(config.delay).toBe(400);
    });

    it('returns opacity animation', () => {
      const config = fadeInDelay(200);
      expect(config.opacity).toEqual([0, 1]);
    });

    it('is autoplay', () => {
      const config = fadeInDelay(100);
      expect(config.autoplay).toBe(true);
    });
  });

  describe('staggerFadeInUp', () => {
    it('is not autoplay', () => {
      expect(staggerFadeInUp.autoplay).toBe(false);
    });

    it('has translateY animation', () => {
      expect(staggerFadeInUp.translateY).toEqual([20, 0]);
    });
  });
});
