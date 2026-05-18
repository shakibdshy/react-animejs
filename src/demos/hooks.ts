import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FilterCategory } from './data';
import { demoSections } from './data';
import type { DemoSection } from './types';

export function useDemoFilter() {
  const [category, setCategory] = useState<FilterCategory>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return demoSections.filter((d) => {
      if (category !== 'all' && d.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.path.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [category, search]);

  return { category, setCategory, search, setSearch, filtered };
}

export function useDetailOverlay(filteredDemos: DemoSection[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [activeDemo, setActiveDemo] = useState<DemoSection | null>(null);

  const openDetail = useCallback(
    (demoIndexInFiltered: number) => {
      const demo = filteredDemos[demoIndexInFiltered];
      if (!demo) return;
      setCurrentIndex(demoIndexInFiltered);
      setActiveDemo(demo);
      setIsOpen(true);
      document.body.classList.add('no-scroll');
      const hashPath = demo.componentId;
      history.pushState(null, '', `#${hashPath}`);
    },
    [filteredDemos]
  );

  const closeDetail = useCallback(() => {
    setIsOpen(false);
    setActiveDemo(null);
    setCurrentIndex(-1);
    document.body.classList.remove('no-scroll');
    if (activeDemo) {
      const hashPath = activeDemo.componentId;
      if (location.hash === `#${hashPath}`) {
        history.pushState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [activeDemo]);

  const goNext = useCallback(() => {
    if (currentIndex < filteredDemos.length - 1) {
      openDetail(currentIndex + 1);
    }
  }, [currentIndex, filteredDemos.length, openDetail]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      openDetail(currentIndex - 1);
    }
  }, [currentIndex, openDetail]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDetail, goNext, goPrev]);

  useEffect(() => {
    const handlePopState = () => {
      const hash = location.hash.replace('#', '');
      if (!hash) {
        if (isOpen) closeDetail();
        return;
      }
      const idx = filteredDemos.findIndex((d) => d.componentId === hash);
      if (idx >= 0 && idx !== currentIndex) {
        openDetail(idx);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isOpen, filteredDemos, currentIndex, openDetail, closeDetail]);

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const idx = filteredDemos.findIndex((d) => d.componentId === hash);
      if (idx >= 0) {
        const timer = setTimeout(() => openDetail(idx), 300);
        return () => clearTimeout(timer);
      }
    }
  }, [filteredDemos, openDetail]);

  return {
    isOpen,
    currentIndex,
    activeDemo,
    openDetail,
    closeDetail,
    goNext,
    goPrev,
    canGoNext: currentIndex < filteredDemos.length - 1,
    canGoPrev: currentIndex > 0,
    totalFiltered: filteredDemos.length,
  };
}
