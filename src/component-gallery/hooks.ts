import { useCallback, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CATEGORIES, demoSections } from './data';
import type { FilterCategory } from './data';
import type { SortKey } from './types';

const VALID_CATEGORIES: ReadonlySet<string> = new Set(
  CATEGORIES.map((c) => c.id),
);
const VALID_SORTS: ReadonlySet<string> = new Set(['alpha', 'category', 'recent']);

/** Coerce raw URL search params into typed filter state with safe defaults. */
export function readSearchParams(raw: Record<string, unknown>): {
  q: string;
  cat: FilterCategory;
  sort: SortKey;
  tag?: string;
} {
  const rawCat = typeof raw.cat === 'string' ? raw.cat : '';
  const rawSort = typeof raw.sort === 'string' ? raw.sort : '';
  const rawTag =
    typeof raw.tag === 'string' && raw.tag.length > 0 ? raw.tag : undefined;
  const cat: FilterCategory = VALID_CATEGORIES.has(rawCat)
    ? (rawCat as FilterCategory)
    : 'all';
  const sort: SortKey = VALID_SORTS.has(rawSort as SortKey)
    ? (rawSort as SortKey)
    : 'alpha';
  return {
    q: typeof raw.q === 'string' ? raw.q : '',
    cat,
    sort,
    tag: rawTag,
  };
}

/**
 * Filters and sorts the catalog with state backed by the /demos URL search
 * params. Reading with strict:false returns all inherited search (the parent
 * /demos route carries the params), so filter state survives navigation
 * between the index and /demos/$componentId detail pages.
 */
export function useDemoFilter() {
  // strict:false + no `from` returns the full loose search record from the
  // current route tree, which includes the /demos parent params.
  const rawSearch = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();

  const { q, cat, sort, tag } = readSearchParams(rawSearch);

  /** Partial update to the URL search; replace=true for `q` to avoid history spam per keystroke. */
  const update = useCallback(
    (patch: Partial<{ q: string; cat: FilterCategory; sort: SortKey; tag: string | undefined }>) => {
      navigate({
        to: '.',
        search: (prev: Record<string, unknown>) => ({ ...prev, ...patch }),
        replace: patch.q !== undefined,
      });
    },
    [navigate],
  );

  const setCategory = useCallback((category: FilterCategory) => update({ cat: category }), [update]);
  const setSearch = useCallback((q: string) => update({ q }), [update]);
  const setSort = useCallback((sort: SortKey) => update({ sort }), [update]);
  /** Set a tag (string) or clear it (undefined). FilterBar toggles by passing undefined. */
  const setTagFilter = useCallback(
    (nextTag: string | undefined) => update({ tag: nextTag }),
    [update],
  );

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const demo of demoSections) {
      for (const t of demo.tags ?? []) set.add(t);
    }
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    const list = demoSections.filter((demo) => {
      if (cat !== 'all' && demo.category !== cat) return false;
      if (tag && !(demo.tags ?? []).some((t) => t === tag)) return false;
      if (query) {
        const haystack = [
          demo.title,
          demo.description,
          demo.componentId,
          ...(demo.tags ?? []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    if (sort === 'alpha') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'category') {
      list.sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
      );
    }
    // 'recent' = reverse insertion order (demoSections is authored newest-last).
    return sort === 'recent' ? list.reverse() : list;
  }, [q, cat, sort, tag]);

  return {
    category: cat,
    setCategory,
    search: q,
    setSearch,
    sort,
    setSort,
    tag,
    setTagFilter,
    allTags,
    filtered,
  };
}
