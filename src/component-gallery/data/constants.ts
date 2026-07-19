export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "core", label: "Core" },
  { id: "svg", label: "SVG" },
  { id: "scroll", label: "Scroll" },
  { id: "interaction", label: "Interaction" },
  { id: "ui", label: "UI" },
] as const;

export type FilterCategory = (typeof CATEGORIES)[number]["id"];
