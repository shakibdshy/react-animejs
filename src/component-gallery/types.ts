export type DemoCategory = "core" | "svg" | "scroll" | "interaction" | "ui";

export interface DemoSection<TComponentId extends string = string> {
  title: string;
  /** Optional deep-dive route for interactions that need a larger canvas. */
  playgroundPath?: string;
  /** Whether the component earns a dedicated Playground beyond its detail page. */
  hasPlayground?: boolean;
  description: string;
  category: DemoCategory;
  componentId: TComponentId;
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
}

export interface DetailState {
  isOpen: boolean;
  currentIndex: number;
}
