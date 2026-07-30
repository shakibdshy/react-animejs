import { memo, useCallback } from 'react';
import { CATEGORIES, SORT_OPTIONS } from '../data';
import type { FilterCategory } from '../data';
import type { SortKey } from '../types';

interface FilterBarProps {
  category: FilterCategory;
  search: string;
  resultCount: number;
  onCategoryChange: (category: FilterCategory) => void;
  onSearchChange: (search: string) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  allTags: string[];
  tag?: string;
  onTagChange: (tag: string | undefined) => void;
}

export const FilterBar = memo(function FilterBar({
  category,
  search,
  resultCount,
  onCategoryChange,
  onSearchChange,
  sort,
  onSortChange,
  allTags,
  tag,
  onTagChange,
}: FilterBarProps) {
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange],
  );

  const handleSort = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSortChange(e.target.value as SortKey);
    },
    [onSortChange],
  );

  const handleTag = useCallback(
    (t: string) => {
      onTagChange(tag === t ? undefined : t);
    },
    [tag, onTagChange],
  );

  return (
    <div className="py-6 pb-10 border-b border-landing-border mb-12">
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="search"
          value={search}
          onChange={handleSearch}
          placeholder="Search components…"
          autoComplete="off"
          className="flex-1 min-w-50 px-4 py-2.5 rounded-full border border-landing-border bg-landing-surface text-landing-fg text-sm font-sans outline-none transition-all duration-200 focus:border-landing-accent focus:shadow-[0_0_0_3px] focus:shadow-landing-accent/15 placeholder:text-landing-muted"
          aria-label="Search components"
        />
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-full border text-[13px] landing-font-mono cursor-pointer transition-all duration-200 whitespace-nowrap capitalize ${
              category === cat.id
                ? 'bg-landing-accent text-landing-bg border-landing-accent'
                : 'bg-transparent text-landing-muted border-landing-border hover:border-landing-accent hover:text-landing-accent'
            }`}
            aria-pressed={category === cat.id}
          >
            {cat.label}
          </button>
        ))}
        <label className="flex items-center gap-2 ml-auto">
          <span className="landing-font-mono text-[11px] tracking-widest uppercase text-landing-muted">
            Sort
          </span>
          <select
            value={sort}
            onChange={handleSort}
            className="px-3 py-1.5 rounded-full border border-landing-border bg-landing-surface text-landing-fg text-[13px] landing-font-mono cursor-pointer outline-none transition-all duration-200 focus:border-landing-accent"
            aria-label="Sort components"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <span className="landing-font-mono text-xs text-landing-muted">
          {resultCount} demo{resultCount !== 1 ? 's' : ''}
        </span>
      </div>

      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-4 overflow-x-auto pb-1">
          {allTags.map((t) => {
            const active = tag === t;
            return (
              <button
                key={t}
                onClick={() => handleTag(t)}
                className={`px-2.5 py-1 rounded-full border text-[11px] landing-font-mono cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  active
                    ? 'bg-landing-accent/15 text-landing-accent border-landing-accent'
                    : 'bg-transparent text-landing-muted/80 border-landing-border hover:border-landing-accent/50 hover:text-landing-muted'
                }`}
                aria-pressed={active}
              >
                #{t}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});
