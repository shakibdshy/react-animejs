import React, { memo } from "react";
import { cn } from "@/landing/utils/cn";
import { useScrollReveal } from "@/landing/hooks/use-scroll-reveal";
import { LandingContainer } from "@/landing/components/ui/landing-container";
import { SectionLabel } from "@/landing/components/ui/section-label";
import { SectionHeading } from "@/landing/components/ui/section-heading";
import { SectionDescription } from "@/landing/components/ui/section-description";
import { CodeBlock } from "@/landing/components/ui/code-block";

const codeExamples = [
  {
    title: "animejs — vanilla imperative",
    raw: `import { animate } from 'animejs'
import { useEffect, useRef } from 'react'

function FadeIn({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    const anim = animate(ref.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      ease: 'outCubic',
    })
    return () => anim.pause()
  }, [])

  return <div ref={ref}>{children}</div>
}`,
  },
  {
    title: "react-animejs — hook",
    raw: `import { useAnime } from 'react-animejs'

function FadeIn({ children }) {
  const { ref } = useAnime({
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 600,
    ease: 'outCubic',
  })

  return <div ref={ref}>{children}</div>
}`,
  },
  {
    title: "animejs — manual stagger",
    raw: `import { animate, stagger } from 'animejs'

function animateCards() {
  animate('.card', {
    opacity: [0, 1],
    translateY: [20, 0],
    delay: stagger(60),
    duration: 400,
    ease: 'outQuad',
  })
}`,
  },
  {
    title: "react-animejs — stagger hook",
    raw: `import { useAnime } from 'react-animejs'

function Cards() {
  const { controls } = useAnime({
    selector: '.card',
    opacity: [0, 1],
    translateY: [20, 0],
    stagger: 60,
    duration: 400,
    ease: 'outQuad',
    autoplay: false,
  })

  return <button onClick={controls.play}>Animate</button>
}`,
  },
  {
    title: "animejs — timeline",
    raw: `import { createTimeline } from 'animejs'

function animateSequence() {
  const tl = createTimeline({ loop: true })
  tl.add('.box-1', { x: 100, duration: 400 })
   .add('.box-2', { y: 60, duration: 300 })
   .add('.box-1, .box-2', { x: 0, y: 0, duration: 500 })
}`,
  },
  {
    title: "react-animejs — timeline component",
    raw: `import { AnimeTimeline } from 'react-animejs'

function Sequence() {
  return (
    <AnimeTimeline loop autoplay>
      <div data-keyframe={{ x: 100 }} data-duration={400} />
      <div data-keyframe={{ y: 60 }} data-duration={300} />
      <div data-keyframe={{ x: 0, y: 0 }} data-duration={500} />
    </AnimeTimeline>
  )
}`,
  },
  {
    title: "animejs — scroll trigger",
    raw: `import { onScroll, animate } from 'animejs'

onScroll('.reveal-section', {
  enter: { opacity: [0, 1], translateY: [40, 0] },
  leave: { opacity: [1, 0] },
  duration: 800,
  ease: 'outCubic',
})`,
  },
  {
    title: "react-animejs — onScroll hook",
    raw: `import { useAnimeOnScroll } from 'react-animejs'

function RevealSection({ children }) {
  const { ref } = useAnimeOnScroll({
    enter: { opacity: [0, 1], translateY: [40, 0] },
    leave: { opacity: [1, 0] },
    duration: 800,
    ease: 'outCubic',
  })

  return <div ref={ref}>{children}</div>
}`,
  },
  {
    title: "animejs — layout animation",
    raw: `import { animate, createScope } from 'animejs'
// Manual FLIP: read, invert, play
function flipItems(container) {
  const items = container.children
  const first = items[0].getBoundingClientRect()
  // ... measure all items
  animate('.item', {
    translateX: (el, i) => firstPositions[i] - lastPositions[i],
    translateY: 0,
    duration: 400,
    ease: 'outCubic',
  })
}`,
  },
  {
    title: "react-animejs — AnimeLayout",
    raw: `import { AnimeLayout, AnimeLayoutItem } from 'react-animejs'

function ReorderList({ items }) {
  return (
    <AnimeLayout mode="fade">
      {items.map(item => (
        <AnimeLayoutItem key={item.id}>
          <div>{item.label}</div>
        </AnimeLayoutItem>
      ))}
    </AnimeLayout>
  )
}`,
  },
  {
    title: "animejs — SVG path drawing",
    raw: `import { animate } from 'animejs'

function drawPath(pathEl) {
  animate(pathEl, {
    draw: '0 1',
    duration: 1500,
    ease: 'inOutCubic',
  })
}`,
  },
  {
    title: "react-animejs — AnimeDraw",
    raw: `import { AnimeDraw } from 'react-animejs'

function LogoPath() {
  return (
    <AnimeDraw draw="0 1" duration={1500} ease="inOutCubic" autoplay>
      <path d="M10 80 Q 95 10 160 80" />
    </AnimeDraw>
  )
}`,
  },
] as const;

interface CodeShowcaseSectionProps {
  className?: string;
}

export const CodeShowcaseSection = memo(function CodeShowcaseSection({
  className,
}: CodeShowcaseSectionProps) {
  const [labelRef, labelVisible] = useScrollReveal();
  const [headingRef, headingVisible] = useScrollReveal();
  const [descRef, descVisible] = useScrollReveal();

  return (
    <LandingContainer
      as="section"
      id="code"
      className={cn("py-30", className)}
    >
      <div
        ref={labelRef}
        className={cn(
          labelVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10",
          "transition-all duration-800",
        )}
      >
        <SectionLabel>Code</SectionLabel>
      </div>
      <div
        ref={headingRef}
        className={cn(
          headingVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10",
          "transition-all duration-800",
        )}
      >
        <SectionHeading>Same power, React syntax</SectionHeading>
      </div>
      <div
        ref={descRef}
        className={cn(
          descVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10",
          "transition-all duration-800",
          "mb-15",
        )}
      >
        <SectionDescription>
          Every anime.js API has a React-native counterpart. Compare vanilla vs
          React AnimeJS side by side.
        </SectionDescription>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {codeExamples.map((example) => (
          <CodeBlock
            key={example.title}
            language="tsx"
            title={example.title}
            rawText={example.raw}
          >
            <HighlightedCode code={example.raw} />
          </CodeBlock>
        ))}
      </div>
    </LandingContainer>
  );
});

const KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "function",
  "const",
  "let",
  "var",
  "return",
  "default",
]);

function highlightToken(token: string): React.ReactNode {
  if (KEYWORDS.has(token)) {
    return <span className="landing-code-kw">{token}</span>;
  }
  if (
    (token.startsWith("'") && token.endsWith("'")) ||
    (token.startsWith('"') && token.endsWith('"'))
  ) {
    return <span className="landing-code-str">{token}</span>;
  }
  if (/^\d+$/.test(token)) {
    return <span className="landing-code-num">{token}</span>;
  }
  return token;
}

const TOKEN_REGEX =
  /(\b(?:import|export|from|function|const|let|var|return|default)\b|'[^']*'|"[^"]*"|\b\d+\b)/g;

function HighlightedCode({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <>
      {lines.map((line, li) => {
        const trimmed = line.trimStart();
        const indent = line.length - trimmed.length;
        if (trimmed.startsWith("//")) {
          return (
            <React.Fragment key={li}>
              {li > 0 && "\n"}
              <span className="landing-code-cm">{line}</span>
            </React.Fragment>
          );
        }
        const parts = trimmed.split(TOKEN_REGEX);
        return (
          <React.Fragment key={li}>
            {li > 0 && "\n"}
            {" ".repeat(indent)}
            {parts.map((part, pi) => (
              <React.Fragment key={pi}>
                {highlightToken(part)}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
}
