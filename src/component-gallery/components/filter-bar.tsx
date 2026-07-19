import { memo, useCallback } from 'react';
import { CATEGORIES } from '../data';
import type { FilterCategory } from '../data';

interface FilterBarProps {
  category: FilterCategory;
  search: string;
  resultCount: number;
  onCategoryChange: (category: FilterCategory) => void;
  onSearchChange: (search: string) => void;
}

export const FilterBar = memo(function FilterBar({
  category,
  search,
  resultCount,
  onCategoryChange,
  onSearchChange,
}: FilterBarProps) {
  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  return (
    <div className="flex items-center gap-3 flex-wrap py-6 pb-10 border-b border-landing-border mb-12">
      <input
        type="search"
        value={search}
        onChange={handleSearch}
        placeholder="Search components\u2026"
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
      <span className="landing-font-mono text-xs text-landing-muted ml-auto">
        {resultCount} demo{resultCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
});
