import React, { useState } from "react";
import { DemoSection } from "./DemoSection";
import { DemoCard } from "./DemoCard";
import { Counter } from "@/components/Counter";
import { Countdown } from "@/components/Countdown";

function BasicCounterDemo() {
  const [value, setValue] = useState(0);

  return (
    <DemoCard
      title="Basic Counter"
      description="Counts from 0 to 10 with animated number transitions"
      state={{ progress: value / 10 }}
      code={`<Counter from={0} to={10} duration={500} />`}
    >
      <Counter
        from={0}
        to={10}
        duration={500}
        size="lg"
        label="clicks"
        onTick={setValue}
      />
    </DemoCard>
  );
}

function ReversedCounterDemo() {
  const [value, setValue] = useState(100);

  return (
    <DemoCard
      title="Countdown Counter"
      description="Counts down from 100 to 0"
      state={{ progress: (100 - value) / 100 }}
      code={`<Counter from={100} to={0} duration={50} format="padded" />`}
    >
      <Counter
        from={100}
        to={0}
        duration={50}
        format="padded"
        size="lg"
        label="remaining"
        onTick={setValue}
      />
    </DemoCard>
  );
}

function PaddedCounterDemo() {
  return (
    <DemoCard
      title="Padded Counter"
      description="Zero-padded number display"
      state={{ progress: 0 }}
      code={`<Counter from={0} to={999} duration={10} format="padded" />`}
    >
      <Counter
        from={0}
        to={999}
        duration={10}
        format="padded"
        size="xl"
      />
    </DemoCard>
  );
}

function LoopingCounterDemo() {
  return (
    <DemoCard
      title="Looping Counter"
      description="Counter that loops continuously"
      state={{ progress: 0 }}
      code={`<Counter from={0} to={5} duration={800} loop />`}
    >
      <Counter
        from={0}
        to={5}
        duration={800}
        loop
        size="lg"
        label="loop"
      />
    </DemoCard>
  );
}

function BasicCountdownDemo() {
  const [remaining, setRemaining] = useState(30);

  return (
    <DemoCard
      title="Basic Countdown"
      description="30-second countdown timer"
      state={{ progress: (30 - remaining) / 30 }}
      code={`<Countdown from={30} format="seconds" />`}
    >
      <Countdown
        from={30}
        format="seconds"
        size="lg"
        label="seconds"
        onTick={setRemaining}
      />
    </DemoCard>
  );
}

function MmSsCountdownDemo() {
  return (
    <DemoCard
      title="MM:SS Format"
      description="Countdown with minute:second display"
      state={{ progress: 0 }}
      code={`<Countdown from={120} format="mm:ss" />`}
    >
      <Countdown
        from={120}
        format="mm:ss"
        size="lg"
        label="time remaining"
      />
    </DemoCard>
  );
}

function HhMmSsCountdownDemo() {
  return (
    <DemoCard
      title="HH:MM:SS Format"
      description="Full hour:minute:second countdown"
      state={{ progress: 0 }}
      code={`<Countdown from={3605} format="hh:mm:ss" />`}
    >
      <Countdown
        from={3605}
        format="hh:mm:ss"
        size="md"
        label="elapsed time"
      />
    </DemoCard>
  );
}

function SideBySideDemo() {
  return (
    <DemoCard
      title="Counter + Countdown"
      description="Counter and countdown side by side"
      state={{ progress: 0 }}
      code={`<Counter /> + <Countdown />`}
    >
      <div className="flex items-start justify-around w-full gap-8">
        <Counter
          from={0}
          to={20}
          duration={400}
          size="md"
          label="score"
        />
        <Countdown
          from={20}
          format="seconds"
          size="md"
          label="time"
        />
      </div>
    </DemoCard>
  );
}

export const CounterCountdownGroup: React.FC = () => {
  return (
    <DemoSection title="Counter & Countdown">
      <BasicCounterDemo />
      <ReversedCounterDemo />
      <PaddedCounterDemo />
      <LoopingCounterDemo />
      <BasicCountdownDemo />
      <MmSsCountdownDemo />
      <HhMmSsCountdownDemo />
      <SideBySideDemo />
    </DemoSection>
  );
};
