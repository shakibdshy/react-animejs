import { type RefObject, useCallback, useRef } from 'react';

interface UseMagneticOptions {
  strength?: number;
}

interface UseMagneticReturn {
  areaRef: RefObject<HTMLDivElement | null>;
  dotRef: RefObject<HTMLDivElement | null>;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export function useMagnetic(options: UseMagneticOptions = {}): UseMagneticReturn {
  const { strength = 0.4 } = options;
  const areaRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const area = areaRef.current;
      const dot = dotRef.current;
      if (!area || !dot) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = area.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        dot.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
        dot.style.transition = 'transform 0.15s ease-out';
      });
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const dot = dotRef.current;
    if (!dot) return;
    dot.style.transform = 'translate(0, 0)';
    dot.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }, []);

  return { areaRef, dotRef, onMouseMove, onMouseLeave };
}
