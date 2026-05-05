import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { animate, scrambleText } from 'animejs';
import type { ScrambleTextParams } from 'animejs';
import type { PlaybackControls, UseAnimeScrambleOptions, UseAnimeScrambleReturn } from '../types';

export function useAnimeScramble(options: UseAnimeScrambleOptions): UseAnimeScrambleReturn {
  const {
    target,
    params = {} as ScrambleTextParams,
    duration,
    delay,
    ease,
    autoplay = true,
    loop,
    scrambleOnMount = true,
    deps = [],
    onReady,
    onBegin,
    onComplete,
    onUpdate,
  } = options;

  const animRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReadyRef = useRef(onReady);
  const onBeginRef = useRef(onBegin);
  const onCompleteRef = useRef(onComplete);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);
  useEffect(() => {
    onBeginRef.current = onBegin;
  }, [onBegin]);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const paramsStr = useMemo(() => JSON.stringify(params), [params]);

  const performScramble = useCallback(() => {
    const element = target.current;
    if (!element) return null;

    if (animRef.current) {
      try {
        animRef.current.revert();
      } catch {}
      animRef.current = null;
    }

    const animParams: Record<string, unknown> = {
      innerHTML: scrambleText(params),
      autoplay,
    };

    if (duration !== undefined) animParams.duration = duration;
    if (delay !== undefined) animParams.delay = delay;
    if (ease !== undefined) animParams.ease = ease;
    if (loop !== undefined) animParams.loop = loop;

    animParams.onBegin = (anim: any) => {
      setIsPlaying(true);
      onBeginRef.current?.(anim);
    };

    animParams.onComplete = (anim: any) => {
      setIsPlaying(false);
      onCompleteRef.current?.(anim);
    };

    animParams.onUpdate = (anim: any) => {
      onUpdateRef.current?.(anim);
    };

    try {
      const anim = animate(element, animParams as any);
      animRef.current = anim;
      setIsReady(true);
      setIsPlaying(!anim.paused);
      onReadyRef.current?.(anim as any);
      return anim;
    } catch (error) {
      console.error('[react-animejs] scrambleText error:', error);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, paramsStr, duration, delay, ease, autoplay, loop]);

  const scrambleEffect = useCallback(() => {
    if (!scrambleOnMount) return;

    performScramble();

    return () => {
      if (animRef.current) {
        try {
          animRef.current.revert();
        } catch {}
        animRef.current = null;
      }
      setIsReady(false);
      setIsPlaying(false);
    };
  }, [performScramble, scrambleOnMount]);

  useEffect(() => {
    return scrambleEffect();
  }, [scrambleEffect]);

  useEffect(() => {
    if (deps.length > 0 && animRef.current) {
      try {
        animRef.current.revert();
      } catch {}
      animRef.current = null;
      setIsReady(false);
      setIsPlaying(false);
      performScramble();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const rescramble = useCallback(() => {
    performScramble();
  }, [performScramble]);

  const revert = useCallback(() => {
    if (animRef.current) {
      try {
        animRef.current.revert();
      } catch {}
      animRef.current = null;
    }
    setIsReady(false);
    setIsPlaying(false);
  }, []);

  const controls = useMemo<PlaybackControls>(
    () => ({
      play: () => animRef.current?.play(),
      pause: () => animRef.current?.pause(),
      resume: () => animRef.current?.resume(),
      restart: () => animRef.current?.restart(),
      reverse: () => animRef.current?.reverse(),
      alternate: () => animRef.current?.alternate(),
      complete: () => animRef.current?.complete(),
      reset: () => animRef.current?.reset(),
      cancel: () => animRef.current?.cancel(),
      revert: () => revert(),
      seek: (time: number | string) => animRef.current?.seek(time),
      stretch: (newDuration: number) => animRef.current?.stretch(newDuration),
      refresh: () => animRef.current?.refresh(),
      setPlaybackRate: () => {},
      setFrameRate: () => {},
    }),
    [revert]
  );

  return {
    ref: target as UseAnimeScrambleReturn['ref'],
    animation: animRef.current,
    isReady,
    isPlaying,
    controls,
    rescramble,
    revert,
  };
}

export default useAnimeScramble;
