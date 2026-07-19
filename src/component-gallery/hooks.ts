import { useMemo, useState } from 'react';
import type { FilterCategory } from './data';
import { demoSections } from './data';

/** Filters the catalog without coupling the gallery to a route or modal state. */
export function useDemoFilter() {
  const [category, setCategory] = useState<FilterCategory>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return demoSections.filter((demo) => {
      if (category !== 'all' && demo.category !== category) return false;
      if (!search) return true;

      const query = search.toLowerCase();
      return (
        demo.title.toLowerCase().includes(query) ||
        demo.description.toLowerCase().includes(query) ||
        (demo.playgroundPath?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [category, search]);

  return { category, setCategory, search, setSearch, filtered };
}
