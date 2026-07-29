import type { Timeline, TimelineEntry } from '../types';
import { resolveScopedTarget } from './targets';

function resolveSyncTarget(target: unknown) {
  if (
    target &&
    typeof target === 'object' &&
    'current' in target &&
    'current' in (target as { current?: unknown })
  ) {
    return (target as { current: unknown }).current ?? null;
  }

  return target;
}

/** Append one declarative entry using the same rules for all call sites. */
export function appendTimelineEntry(
  timeline: Timeline,
  entry: TimelineEntry,
  positionOverride?: number | string,
  scopeRoot?: HTMLElement | null
): boolean {
  const position = positionOverride ?? entry.position;

  if ('label' in entry) {
    timeline.label(entry.label, position);
    return true;
  }

  if ('callback' in entry) {
    timeline.call(entry.callback, position);
    return true;
  }

  if ('target' in entry) {
    const target = resolveSyncTarget(entry.target);
    if (!target) return false;
    timeline.sync(target, position);
    return true;
  }

  if ('targets' in entry) {
    const { targets, position: _entryPosition, ...animationParams } = entry;
    const resolvedTarget = resolveScopedTarget(targets, scopeRoot);
    if (!resolvedTarget) return false;

    timeline.add(resolvedTarget as never, animationParams as never, position);
    return true;
  }

  const { position: _entryPosition, ...timerParams } = entry;
  timeline.add(timerParams as never, position);
  return true;
}
