import { mapGroup } from './utils';
import type { PreviewProps } from './types';
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

export const previewRegistry: Record<string, React.FC<PreviewProps>> = {
  ...mapGroup(['basic-animation'], BasicAnimationPreview),
  ...mapGroup(['svg-morph'], SvgMorphPreview),
  ...mapGroup(['svg-draw'], SvgDrawPreview),
  ...mapGroup(['svg-motion-path'], SvgMotionPathPreview),
  ...mapGroup(['timer'], TimersPreview),
  ...mapGroup(['timeline'], TimelinesPreview),
  ...mapGroup(['draggable'], DraggablePreview),
  ...mapGroup(['on-scroll'], OnScrollPreview),
  ...mapGroup(['layout'], LayoutPreview),
  ...mapGroup(['scope'], ScopePreview),
  ...mapGroup(['split-text'], SplitTextPreview),
  ...mapGroup(['toggle-switch'], ToggleSwitchPreview),
  ...mapGroup(['counter-countdown'], CounterCountdownPreview),
  ...mapGroup(['spinning-cube'], SpinningCubePreview),
  ...mapGroup(['clippath-reveal'], ClipPathRevealPreview),
  ...mapGroup(['animated-slider'], AnimatedSliderPreview),
  ...mapGroup(['reorder-list'], ReorderListPreview),
  ...mapGroup(['scroll-linked-animations'], ScrollLinkedAnimationsPreview),
  ...mapGroup(['scramble-text'], ScrambleTextPreview),
};

export function getDemoPreview(componentId: string): React.FC<PreviewProps> | undefined {
  return previewRegistry[componentId];
}
