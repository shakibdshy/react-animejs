import type { PreviewProps } from './types';
import type { DemoId } from '../../data';
import { BasicAnimationPreview } from './basic-animation';
import { TimersPreview } from './timers';
import { TimelinesPreview } from './timelines';
import { LayoutPreview } from './layout';
import { ScopePreview } from './scope';
import { SplitTextPreview } from './split-text';
import { ScrambleTextPreview } from './scramble-text';
import { SvgDrawPreview, SvgMorphPreview, SvgMotionPathPreview } from './svg-previews';
import { DraggablePreview, OnScrollPreview, ReorderListPreview, ScrollLinkedAnimationsPreview } from './interaction-previews';
import { AnimatedSliderPreview, ClipPathRevealPreview, CounterCountdownPreview, SpinningCubePreview, ToggleSwitchPreview } from './wrapper-previews';

export const previewRegistry = {
  'basic-animation': BasicAnimationPreview,
  'svg-morph': SvgMorphPreview,
  'svg-draw': SvgDrawPreview,
  'svg-motion-path': SvgMotionPathPreview,
  timer: TimersPreview,
  timeline: TimelinesPreview,
  draggable: DraggablePreview,
  'on-scroll': OnScrollPreview,
  layout: LayoutPreview,
  scope: ScopePreview,
  'split-text': SplitTextPreview,
  'toggle-switch': ToggleSwitchPreview,
  'counter-countdown': CounterCountdownPreview,
  'spinning-cube': SpinningCubePreview,
  'clippath-reveal': ClipPathRevealPreview,
  'animated-slider': AnimatedSliderPreview,
  'reorder-list': ReorderListPreview,
  'scroll-linked-animations': ScrollLinkedAnimationsPreview,
  'scramble-text': ScrambleTextPreview,
} satisfies Record<DemoId, React.FC<PreviewProps>>;

export function getDemoPreview(componentId: DemoId): React.FC<PreviewProps> {
  return previewRegistry[componentId];
}
