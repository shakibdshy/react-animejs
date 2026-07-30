export type DemoCategory = "core" | "svg" | "scroll" | "interaction" | "ui";

export type SortKey = "alpha" | "category" | "recent";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface DemoSection<TComponentId extends string = string> {
  title: string;
  /** Optional deep-dive route for interactions that need a larger canvas. */
  playgroundPath?: string;
  /** Whether the component earns a dedicated Playground beyond its detail page. */
  hasPlayground?: boolean;
  description: string;
  category: DemoCategory;
  componentId: TComponentId;
  /** Fine-grained topic tags shown on cards and used by the tag filter. */
  tags?: readonly string[];
  /** Skill level; drives a colored badge on cards and the detail page. */
  difficulty?: Difficulty;
  /** Stable docs anchor (e.g. "use-anime") for the "Read the docs" cross-link. */
  docsAnchor?: string;
}

export interface DemoPropRow {
  name: string;
  type: string;
  default: string;
  desc: string;
}

export interface DemoDetail {
  component: string;
  summary: string;
  code: string;
  props: DemoPropRow[];
}

export interface FilterState {
  category: DemoCategory | "all";
  search: string;
  sort: SortKey;
  tag?: string;
}

export interface DetailState {
  isOpen: boolean;
  currentIndex: number;
}
