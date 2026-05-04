import React, { useRef, useState } from "react";
import { utils } from "animejs";
import {
  AnimeDraw,
  AnimeMorph,
  AnimeMotionPath,
} from "@/lib/react-animejs/components";
import { DemoCard } from "./DemoCard";

const MORPH_SOURCE_POINTS =
  "128 32 176 144 288 160 200 232 224 344 128 280 32 344 56 232 -32 160 80 144";

const DRAWABLE_SHAPES = [
  {
    type: "path" as const,
    d: "M59 90V56.136C58.66 46.48 51.225 39 42 39c-9.389 0-17 7.611-17 17s7.611 17 17 17h8.5v17H42C23.222 90 8 74.778 8 56s15.222-34 34-34c18.61 0 33.433 14.994 34 33.875V90H59z",
  },
  {
    type: "polyline" as const,
    points: "59 22.035 59 90 76 90 76 22 59 22",
  },
  {
    type: "path" as const,
    d: "M59 90V55.74C59.567 36.993 74.39 22 93 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90H59z",
  },
  {
    type: "polyline" as const,
    points: "127 22.055 127 90 144 90 144 22 127 22",
  },
  {
    type: "path" as const,
    d: "M127 90V55.74C127.567 36.993 142.39 22 161 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90h-17z",
  },
  {
    type: "path" as const,
    d: "M118.5 22a8.5 8.5 0 1 1-8.477 9.067v-1.134c.283-4.42 3.966-7.933 8.477-7.933z",
  },
  {
    type: "path" as const,
    d: "M144 73c-9.389 0-17-7.611-17-17v-8.5h-17V56c0 18.778 15.222 34 34 34V73z",
  },
  {
    type: "path" as const,
    d: "M178 90V55.74C178.567 36.993 193.39 22 212 22c18.778 0 34 15.222 34 34v34h-17V56c0-9.389-7.611-17-17-17-9.225 0-16.66 7.48-17 17.136V90h-17z",
  },
  {
    type: "path" as const,
    d: "M263 73c-9.389 0-17-7.611-17-17s7.611-17 17-17c9.18 0 16.58 7.4 17 17h-17v17h34V55.875C296.433 36.994 281.61 22 263 22c-18.778 0-34 15.222-34 34s15.222 34 34 34V73z",
  },
  {
    type: "path" as const,
    d: "M288.477 73A8.5 8.5 0 1 1 280 82.067v-1.134c.295-4.42 3.967-7.933 8.477-7.933z",
  },
];

const SUZUKA_TRACK_PATH =
  "M189.142857,4 C227.456875,4 248.420457,4.00974888 256.864191,4.00974888 C263.817211,4.00974888 271.61219,3.69583517 274.986231,6.63061513 C276.382736,7.84531176 279.193529,11.3814152 280.479499,13.4815847 C281.719344,15.5064248 284.841964,20.3571626 275.608629,20.3571626 C265.817756,20.3571626 247.262478,19.9013915 243.955117,19.9013915 C239.27946,19.9013915 235.350655,24.7304885 228.6344,24.7304885 C224.377263,24.7304885 219.472178,21.0304113 214.535324,21.0304113 C207.18393,21.0304113 200.882842,30.4798911 194.124187,30.4798911 C186.992968,30.4798911 182.652552,23.6245972 173.457298,23.6245972 C164.83277,23.6245972 157.191045,31.5424105 157.191045,39.1815359 C157.191045,48.466779 167.088672,63.6623005 166.666679,66.9065088 C166.378668,69.1206889 155.842137,79.2568633 151.508744,77.8570506 C145.044576,75.7689355 109.126667,61.6405346 98.7556561,52.9785141 C96.4766876,51.0750861 89.3680347,39.5769094 83.4195005,38.5221785 C80.6048001,38.0231057 73.0179337,38.7426555 74.4158694,42.6956376 C76.7088819,49.1796531 86.3280337,64.1214904 87.1781062,66.9065088 C88.191957,70.2280995 86.4690152,77.0567847 82.2060607,79.2503488 C79.2489435,80.7719756 73.1324132,82.8858479 64.7015706,83.0708761 C55.1604808,83.2802705 44.4254811,80.401884 39.1722168,80.401884 C25.7762119,80.401884 24.3280517,89.1260466 22.476679,94.4501705 C21.637667,96.8629767 20.4337535,108 33.2301959,108 C37.8976087,108 45.0757044,107.252595 53.4789069,103.876424 C61.8821095,100.500252 122.090049,78.119656 128.36127,75.3523302 C141.413669,69.5926477 151.190142,68.4987755 147.018529,52.0784879 C143.007818,36.291544 143.396957,23.4057975 145.221196,19.6589263 C146.450194,17.1346449 148.420955,14.8552817 153.206723,15.7880203 C155.175319,16.1716965 155.097637,15.0525421 156.757598,11.3860986 C158.417558,7.71965506 161.842736,4.00974888 167.736963,4.00974888 C177.205308,4.00974888 184.938832,4 189.142857,4 Z";

const MORPH_DEMO_CODE = `const target = useRef<SVGPolygonElement | null>(null);

<AnimeMorph
  target={target}
  duration={750}
  ease="inOutQuad"
  alternate
  loop
  autoplay
  deps={[points]}
>
  <polygon points={sourcePoints} ... />
</AnimeMorph>
<polygon ref={target} points={points} hidden />`;

const DRAW_DEMO_CODE = `{lines.map((shape, i) => (
  <AnimeDraw
    key={i}
    draw={["0 0", "0 1", "1 1"]}
    delay={i * 100}
    duration={2000}
    ease="inOutQuad"
    loop
    autoplay
  >
    {shape}
  </AnimeDraw>
))}`;

const MOTION_DEMO_CODE = `<AnimeDraw draw="0 1" duration={5000} ease="linear" loop autoplay>
  <path d={trackPath} ... />
</AnimeDraw>
<AnimeMotionPath path={trackRef} duration={5000} ease="linear" loop autoplay>
  <g>...</g>
</AnimeMotionPath>`;

const generateMorphPoints = (count: number) => {
  const points: string[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = utils.random(84, 150);
    points.push(
      `${Math.round(128 + Math.cos(angle) * radius)} ${Math.round(
        192 + Math.sin(angle) * radius,
      )}`,
    );
  }
  return points.join(" ");
};

export const SvgUtilitiesDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <MorphToDemo />
      <CreateDrawableDemo />
      <CreateMotionPathDemo />
    </div>
  );
};

const MorphToDemo: React.FC = () => {
  const targetRef = useRef<SVGPolygonElement | null>(null);
  const [points, setPoints] = useState(() => generateMorphPoints(10));

  return (
    <DemoCard
      title="svg.morphTo"
      description="Morphs a visible polygon toward a hidden target polygon, matching the docs pattern while letting you regenerate the target on demand."
      code={MORPH_DEMO_CODE}
      actions={
        <button
          type="button"
          onClick={() => setPoints(generateMorphPoints(10))}
          className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform hover:scale-105"
        >
          Regenerate Target
        </button>
      }
    >
      <div className="flex w-full flex-col items-center gap-4">
        <div className="relative flex aspect-video w-full max-w-md items-center justify-center overflow-hidden rounded-4xl border border-white/10 bg-[#08111f] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_55%),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[auto,20px_20px,20px_20px]" />
          <svg
            viewBox="0 0 320 320"
            className="h-60 w-60 overflow-visible"
            aria-label="svg.morphTo demo"
          >
            <defs>
              <radialGradient id="morphFill" cx="45%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="55%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
            </defs>

            <AnimeMorph
              target={targetRef}
              duration={750}
              ease="inOutQuad"
              alternate
              loop
              autoplay
              deps={[points]}
            >
              <polygon
                points={MORPH_SOURCE_POINTS}
                fill="url(#morphFill)"
                stroke="#e2e8f0"
                strokeWidth="3"
                data-testid="morph-source"
              />
            </AnimeMorph>

            <polygon
              ref={targetRef}
              points={points}
              fill="none"
              stroke="none"
              data-testid="morph-target"
            />
          </svg>
        </div>
      </div>
    </DemoCard>
  );
};

const CreateDrawableDemo: React.FC = () => {
  return (
    <DemoCard
      title="svg.createDrawable"
      description="Draws the Anime.js docs wordmark example with the same staged draw sequence and staggered timing."
      code={DRAW_DEMO_CODE}
    >
      <div className="flex w-full flex-col items-center gap-4">
        <div className="relative flex aspect-21/9 w-full max-w-3xl items-center justify-center overflow-hidden rounded-4xl border border-cyan-400/20 bg-[#04131a] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_35%)]" />
          <svg
            viewBox="0 0 304 112"
            className="h-full w-full p-6 text-cyan-300"
            aria-label="svg.createDrawable demo"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {DRAWABLE_SHAPES.map((shape, index) => (
                <AnimeDraw
                  key={index}
                  draw={["0 0", "0 1", "1 1"]}
                  delay={index * 100}
                  duration={2000}
                  ease="inOutQuad"
                  loop
                  autoplay
                >
                  {shape.type === "path" ? (
                    <path d={shape.d} data-testid={`draw-line-${index}`} />
                  ) : (
                    <polyline
                      points={shape.points}
                      data-testid={`draw-line-${index}`}
                    />
                  )}
                </AnimeDraw>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </DemoCard>
  );
};

const CreateMotionPathDemo: React.FC = () => {
  const trackRef = useRef<SVGPathElement | null>(null);

  return (
    <DemoCard
      title="svg.createMotionPath"
      description="Matches the docs setup by combining a drawable Suzuka track with a looping car that follows the same motion path."
      code={MOTION_DEMO_CODE}
    >
      <div className="flex w-full flex-col items-center gap-4">
        <div className="relative flex aspect-21/9 w-full max-w-3xl items-center justify-center overflow-hidden rounded-4xl border border-[#ff9f43]/20 bg-[#130b07] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_40%)]" />
          <svg
            viewBox="0 0 304 112"
            className="h-full w-full p-5"
            aria-label="svg.createMotionPath demo"
          >
            <path
              d={SUZUKA_TRACK_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <AnimeDraw draw="0 1" duration={5000} ease="linear" loop autoplay>
              <path
                ref={trackRef}
                d={SUZUKA_TRACK_PATH}
                fill="none"
                stroke="#fb923c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-testid="motion-path-track"
              />
            </AnimeDraw>

            <AnimeMotionPath
              path={trackRef}
              duration={5000}
              ease="linear"
              loop
              autoplay
            >
              <g data-testid="motion-path-car">
                <rect
                  x="-9"
                  y="-5"
                  width="18"
                  height="10"
                  rx="3"
                  fill="#f8fafc"
                />
                <rect
                  x="-3"
                  y="-8"
                  width="10"
                  height="6"
                  rx="2"
                  fill="#38bdf8"
                />
                <circle cx="-5" cy="6" r="2.2" fill="#0f172a" />
                <circle cx="5" cy="6" r="2.2" fill="#0f172a" />
              </g>
            </AnimeMotionPath>
          </svg>
        </div>
      </div>
    </DemoCard>
  );
};

export default SvgUtilitiesDemo;
