import { DemoSection } from '../DemoSection';
import { DemoCard } from '../DemoCard';
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
      <div className="grid gap-6 xl:grid-cols-2">
        <DemoCard
          title="Core drag interaction"
          description="A live draggable target with position, progress, and velocity telemetry."
          className="xl:col-span-2"
          code={`const { ref, position, velocity } = useAnimeDraggable({
  container: containerRef.current,
  containerPadding: 16,
  releaseStiffness: 120,
  releaseDamping: 20,
});`}
        >
          <BasicDraggable />
        </DemoCard>

        <DemoCard
          title="Drag configuration"
          description="Tune trigger behavior, constraints, resistance, speed, and cursor feedback."
          code={`useAnimeDraggable({
  trigger,
  axis: 'x',
  container,
  containerFriction: 0.85,
  dragSpeed: 1.2,
});`}
        >
          <div className="grid w-full gap-8">
            <TriggerDemo />
            <AxisConstrainedDraggable />
            <ContainerFrictionDemo />
            <DragSpeedDemo />
            <DragThresholdDemo />
            <CursorDemo />
          </div>
        </DemoCard>

        <DemoCard
          title="Release physics"
          description="Compare spring response, velocity, easing, and snap behavior after release."
          code={`useAnimeDraggable({
  releaseStiffness: 180,
  releaseDamping: 16,
  releaseEase: 'outElastic(1, .5)',
  snap: 24,
});`}
        >
          <div className="grid w-full gap-8">
            <SpringPhysicsDemo />
            <VelocityDemo />
            <ReleaseEaseDemo />
            <SnappingDraggable />
          </div>
        </DemoCard>

        <DemoCard
          title="Control and callbacks"
          description="Use imperative controls and inspect drag lifecycle events."
          className="xl:col-span-2"
          code={`const { controls } = useAnimeDraggable({
  onGrab: () => {},
  onDrag: () => {},
  onRelease: () => {},
});

controls.revert();`}
        >
          <div className="grid w-full gap-8 xl:grid-cols-2">
            <ControlledDraggable />
            <CallbackDraggable />
          </div>
        </DemoCard>
      </div>
    </DemoSection>
  );
}
