import React from "react";
import {
  TimelineAddDemo,
  TimelineSetDemo,
  TimelineSyncDemo,
  TimelineLabelDemo,
  TimelineRemoveDemo,
  TimelineInitDemo,
  TimelineRefreshDemo,
  TimelineCallDemo,
  TimelineStretchDemo,
  TimelineRevertDemo,
  TimelinePlaybackMethodsDemo,
  TimelinePropertiesDemo,
} from "./methods";

const MethodsGroup: React.FC = () => {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm">
            M
          </span>
          Timeline Methods & Properties
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TimelinePlaybackMethodsDemo />
          <TimelinePropertiesDemo />
          <TimelineAddDemo />
          <TimelineSetDemo />
          <TimelineSyncDemo />
          <TimelineLabelDemo />
          <TimelineRemoveDemo />
          <TimelineInitDemo />
          <TimelineRefreshDemo />
          <TimelineCallDemo />
          <TimelineStretchDemo />
          <TimelineRevertDemo />
        </div>
      </section>
    </div>
  );
};

export default MethodsGroup;
