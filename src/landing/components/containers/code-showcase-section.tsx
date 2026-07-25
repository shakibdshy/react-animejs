import React, { memo, useMemo, useState } from 'react';
import { cn } from '@/landing/utils/cn';
import { useScrollReveal } from '@/landing/hooks/use-scroll-reveal';
import { useCopyToClipboard } from '@/landing/hooks/use-copy-to-clipboard';
import { LandingContainer } from '@/landing/components/ui/landing-container';
import { SectionHeader } from '@/landing/components/ui/section-header';

/** Each example pairs the verbose anime.js form with the React-native one. */
interface CodePair {
  topic: string;
  vanilla: { title: string; raw: string };
  react: { title: string; raw: string };
}

const PAIRS: CodePair[] = [
  {
    topic: 'Fade in',
    vanilla: {
      title: 'animejs — vanilla imperative',
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
    react: {
      title: 'react-animejs — hook',
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
  },
  {
    topic: 'Stagger',
    vanilla: {
      title: 'animejs — manual stagger',
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
    react: {
      title: 'react-animejs — stagger prop',
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
  },
  {
    topic: 'Timeline',
    vanilla: {
      title: 'animejs — timeline',
      raw: `import { createTimeline } from 'animejs'

function animateSequence() {
  const tl = createTimeline({ loop: true })
  tl.add('.box-1', { x: 100, duration: 400 })
   .add('.box-2', { y: 60, duration: 300 })
   .add('.box-1, .box-2', { x: 0, y: 0, duration: 500 })
}`,
    },
    react: {
      title: 'react-animejs — timeline component',
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
  },
  {
    topic: 'Scroll',
    vanilla: {
      title: 'animejs — scroll trigger',
      raw: `import { onScroll, animate } from 'animejs'

onScroll('.reveal-section', {
  enter: { opacity: [0,1], translateY: [40, 0] },
  leave: { opacity: [1, 0] },
  duration: 800,
  ease: 'outCubic',
})`,
    },
    react: {
      title: 'react-animejs — onScroll hook',
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
  },
];

interface CodeShowcaseSectionProps {
  className?: string;
}

/**
 * Side-by-side vanilla-vs-React comparison with a topic tab strip. Replaces
 * the old grid of 12 stacked blocks with one focused, navigable viewer.
 */
export const CodeShowcaseSection = memo(function CodeShowcaseSection({
  className,
}: CodeShowcaseSectionProps) {
  const [active, setActive] = useState(0);
  const [sideRef, sideVisible] = useScrollReveal();
  const pair = PAIRS[active];

  return (
    <LandingContainer as="section" id="code" className={cn('py-30', className)}>
      <SectionHeader
        index="Chapter III"
        numeral="03"
        label="The Syntax"
        heading={
          <>
            Same power, <br className="hidden sm:block" />
            React syntax.
          </>
        }
        intro="Every anime.js API has a React-native counterpart. Pick a topic and compare the two, side by side."
      />

      {/* Topic tabs */}
      <div
        className="mt-12 flex flex-wrap gap-2 border-b border-landing-border pb-px"
        role="tablist"
        aria-label="Code comparison topics"
      >
        {PAIRS.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.topic}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={cn(
                'relative px-4 py-2.5 landing-font-mono text-[12px] tracking-[0.04em] transition-colors duration-200 cursor-pointer bg-transparent border-0',
                isActive
                  ? 'text-landing-fg'
                  : 'text-landing-muted hover:text-landing-fg'
              )}
            >
              {p.topic}
              {isActive ? (
                <span
                  className="absolute left-0 right-0 -bottom-px h-[2px] bg-landing-accent"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Comparison panels */}
      <div
        ref={sideRef}
        className={cn(
          'grid grid-cols-1 lg:grid-cols-2 gap-px bg-landing-border border border-landing-border rounded-2xl overflow-hidden mt-px',
          'transition-all duration-700',
          sideVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )}
      >
        <ComparisonPanel
          variant="vanilla"
          title={pair.vanilla.title}
          code={pair.vanilla.raw}
        />
        <ComparisonPanel
          variant="react"
          title={pair.react.title}
          code={pair.react.raw}
        />
      </div>
    </LandingContainer>
  );
});

interface ComparisonPanelProps {
  variant: 'vanilla' | 'react';
  title: string;
  code: string;
}

const ComparisonPanel = memo(function ComparisonPanel({
  variant,
  title,
  code,
}: ComparisonPanelProps) {
  const { copied, copy } = useCopyToClipboard();
  const isReact = variant === 'react';

  return (
    <div
      className={cn(
        'flex flex-col bg-landing-bg/80',
        isReact && 'relative'
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-landing-border bg-landing-surface">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              isReact ? 'bg-landing-accent' : 'bg-landing-muted/60'
            )}
            aria-hidden="true"
          />
          <span className="landing-font-mono text-[11px] tracking-[0.15em] uppercase text-landing-muted">
            {title}
          </span>
        </div>
        <button
          onClick={() => void copy(code)}
          className="bg-transparent border-none text-landing-muted cursor-pointer text-[11px] px-2 py-1 rounded hover:text-landing-fg transition-colors duration-200 landing-font-mono"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code body */}
      <pre className="flex-1 px-5 py-5 overflow-x-auto text-[13px] leading-[1.8]">
        <code className="landing-font-mono text-landing-fg/85">
          <HighlightedCode code={code} />
        </code>
      </pre>

      {/* React panel ribbon */}
      {isReact ? (
        <span
          className="absolute top-0 right-0 landing-font-mono text-[9px] tracking-[0.2em] uppercase text-landing-bg bg-landing-accent px-2 py-0.5 rounded-bl"
          aria-hidden="true"
        >
          React
        </span>
      ) : null}
    </div>
  );
});

const KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'function',
  'const',
  'let',
  'var',
  'return',
  'default',
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

const HighlightedCode = memo(function HighlightedCode({ code }: { code: string }) {
  const lines = useMemo(() => code.split('\n'), [code]);
  return (
    <>
      {lines.map((line, li) => {
        const trimmed = line.trimStart();
        const indent = line.length - trimmed.length;
        if (trimmed.startsWith('//')) {
          return (
            <React.Fragment key={li}>
              {li > 0 && '\n'}
              <span className="landing-code-cm">{line}</span>
            </React.Fragment>
          );
        }
        const parts = trimmed.split(TOKEN_REGEX);
        return (
          <React.Fragment key={li}>
            {li > 0 && '\n'}
            {' '.repeat(indent)}
            {parts.map((part, pi) => (
              <React.Fragment key={pi}>{highlightToken(part)}</React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
});
