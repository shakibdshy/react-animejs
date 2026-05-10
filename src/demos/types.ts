export type DemoCategory = "core" | "svg" | "scroll" | "interaction" | "ui";

export interface DemoSection {
  title: string;
  path: string;
  description: string;
  category: DemoCategory;
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
