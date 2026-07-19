import type { ReactNode } from 'react';

interface TimelineDemoFrameProps {
  title: string;
  controls: ReactNode;
  children: ReactNode;
}

/**
 * The shared visual shell for timeline playgrounds. Keeping the chrome here
 * prevents each example from drifting in spacing, controls, or card height.
 */
export function TimelineDemoFrame({ title, controls, children }: TimelineDemoFrameProps) {
  return (
    <div className="timeline-demo-frame">
      <div className="timeline-demo-frame__header">
        <h3 className="timeline-demo-frame__title">{title}</h3>
        <div className="timeline-demo-frame__controls">{controls}</div>
      </div>
      <div className="timeline-demo-frame__body">{children}</div>
    </div>
  );
}
