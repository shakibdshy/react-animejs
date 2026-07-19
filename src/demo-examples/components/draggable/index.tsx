import { DemoSection } from '../DemoSection';
import { BasicDraggable } from './BasicDraggable';
import { TriggerDemo } from './TriggerDemo';
import { AxisConstrainedDraggable } from './AxisConstrainedDraggable';
import { ContainerFrictionDemo } from './ContainerFrictionDemo';
import { DragSpeedDemo } from './DragSpeedDemo';
import { DragThresholdDemo } from './DragThresholdDemo';
import { CursorDemo } from './CursorDemo';
import { SpringPhysicsDemo } from './SpringPhysicsDemo';
import { VelocityDemo } from './VelocityDemo';
import { SnappingDraggable } from './SnappingDraggable';
import { ReleaseEaseDemo } from './ReleaseEaseDemo';
import { ControlledDraggable } from './ControlledDraggable';
import { CallbackDraggable } from './CallbackDraggable';

export function DraggableDemo() {
  return (
    <DemoSection title="Draggable (useAnimeDraggable)">
      <div className="space-y-12">
        <BasicDraggable />

        <div className="border-t border-demo-border pt-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-green-400">⚙️</span> Settings
          </h3>
          <div className="grid gap-8">
            <TriggerDemo />
            <AxisConstrainedDraggable />
            <ContainerFrictionDemo />
            <DragSpeedDemo />
            <DragThresholdDemo />
            <CursorDemo />
          </div>
        </div>

        <div className="border-t border-demo-border pt-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-blue-400">🔬</span> Physics & Animation
          </h3>
          <div className="grid gap-8">
            <SpringPhysicsDemo />
            <VelocityDemo />
            <ReleaseEaseDemo />
            <SnappingDraggable />
          </div>
        </div>

        <div className="border-t border-demo-border pt-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-purple-400">🎮</span> Methods & Callbacks
          </h3>
          <div className="grid gap-8">
            <ControlledDraggable />
            <CallbackDraggable />
          </div>
        </div>
      </div>
    </DemoSection>
  );
}
