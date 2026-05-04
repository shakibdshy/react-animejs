import React, { useState } from "react";
import { DemoSection } from "./DemoSection";
import { DemoCard } from "./DemoCard";
import { ToggleSwitch } from "@/demo/components/common/ToggleSwitch";

function BasicToggleDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <DemoCard
      title="Basic Toggle"
      description="Simple on/off toggle with smooth animation"
      controls={{
        restart: () => setChecked(false),
      }}
      state={{ progress: checked ? 1 : 0 }}
      code={`<ToggleSwitch checked={${checked}} onChange={setChecked} />`}
    >
      <ToggleSwitch checked={checked} onChange={setChecked} label="Enable feature" />
    </DemoCard>
  );
}

function SizesDemo() {
  const [sm, setSm] = useState(false);
  const [md, setMd] = useState(true);
  const [lg, setLg] = useState(false);

  return (
    <DemoCard
      title="Sizes"
      description="Small, medium, and large toggle sizes"
      state={{ progress: (Number(sm) + Number(md) + Number(lg)) / 3 }}
      code={`<ToggleSwitch size="sm|md|lg" />`}
    >
      <div className="flex flex-col gap-6 items-center">
        <ToggleSwitch size="sm" checked={sm} onChange={setSm} label="Small" />
        <ToggleSwitch size="md" checked={md} onChange={setMd} label="Medium" />
        <ToggleSwitch size="lg" checked={lg} onChange={setLg} label="Large" />
      </div>
    </DemoCard>
  );
}

function DisabledDemo() {
  return (
    <DemoCard
      title="Disabled State"
      description="Toggle in disabled state"
      state={{ progress: 0 }}
      code={`<ToggleSwitch disabled label="Disabled" />`}
    >
      <div className="flex flex-col gap-6 items-center">
        <ToggleSwitch disabled checked={false} label="Disabled off" />
        <ToggleSwitch disabled checked={true} label="Disabled on" />
      </div>
    </DemoCard>
  );
}

function MultipleTogglesDemo() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
    analytics: false,
  });

  const update = (key: string) => (val: boolean) =>
    setSettings((s) => ({ ...s, [key]: val }));

  const progress =
    Object.values(settings).filter(Boolean).length / Object.values(settings).length;

  return (
    <DemoCard
      title="Settings Panel"
      description="Multiple toggles for settings"
      state={{ progress }}
      code={`<ToggleSwitch label={key} checked={${JSON.stringify(settings)}} />`}
    >
      <div className="w-full max-w-sm space-y-4">
        {Object.entries(settings).map(([key, val]) => (
          <div
            key={key}
            className="flex items-center justify-between bg-demo-card p-3 rounded-xl border border-demo-border"
          >
            <span className="text-sm capitalize text-demo-text">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <ToggleSwitch checked={val} onChange={update(key)} />
          </div>
        ))}
      </div>
    </DemoCard>
  );
}

export const ToggleSwitchGroup: React.FC = () => {
  return (
    <DemoSection title="Toggle Switch">
      <BasicToggleDemo />
      <SizesDemo />
      <DisabledDemo />
      <MultipleTogglesDemo />
    </DemoSection>
  );
};
