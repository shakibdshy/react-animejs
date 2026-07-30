export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "core", label: "Core" },
  { id: "svg", label: "SVG" },
  { id: "scroll", label: "Scroll" },
  { id: "interaction", label: "Interaction" },
  { id: "ui", label: "UI" },
] as const;

export type FilterCategory = (typeof CATEGORIES)[number]["id"];

export const SORT_OPTIONS = [
  { id: "alpha", label: "A→Z" },
  { id: "category", label: "Category" },
  { id: "recent", label: "Recent" },
] as const;

export type SortOptionId = (typeof SORT_OPTIONS)[number]["id"];

export const DIFFICULTY_META: Record<
  "beginner" | "intermediate" | "advanced",
  { label: string; dotClassName: string; badgeClassName: string }
> = {
  beginner: {
    label: "Beginner",
    dotClassName: "bg-emerald-500",
    badgeClassName:
      "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  intermediate: {
    label: "Intermediate",
    dotClassName: "bg-landing-accent",
    badgeClassName:
      "text-landing-accent border-landing-accent/30 bg-landing-accent/10",
  },
  advanced: {
    label: "Advanced",
    dotClassName: "bg-rose-500",
    badgeClassName:
      "text-rose-600 dark:text-rose-400 border-rose-500/30 bg-rose-500/10",
  },
};
