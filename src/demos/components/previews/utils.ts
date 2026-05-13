import type { PreviewProps } from './types';

export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function mapGroup(
  ids: string[],
  component: React.FC<PreviewProps>
): Record<string, React.FC<PreviewProps>> {
  return Object.fromEntries(ids.map((id) => [id, component]));
}
