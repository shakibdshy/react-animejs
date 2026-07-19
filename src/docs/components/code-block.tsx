import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Highlight } from 'prism-react-renderer'

interface CodeBlockProps {
  children: string
  language?: string
}

const emptyTheme = {
  plain: { color: '', backgroundColor: '' },
  styles: [] as Array<{ types: string[]; style: Record<string, string> }>,
}

const tokenClassMap: Record<string, string> = {
  comment: 'landing-code-cm',
  keyword: 'landing-code-kw',
  function: 'landing-code-fn',
  string: 'landing-code-str',
  number: 'landing-code-num',
  property: 'landing-code-attr',
  'class-name': 'landing-code-fn',
  tag: 'landing-code-tag',
  'attr-name': 'landing-code-attr',
  'attr-value': 'landing-code-val',
}

function getTokenClass(types: string[]) {
  for (let index = types.length - 1; index >= 0; index -= 1) {
    const className = tokenClassMap[types[index]]
    if (className) return className
  }

  return undefined
}

export function CodeBlock({ children, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-landing-border bg-[oklch(13%_0.009_60)] text-[oklch(92%_0.008_60)] shadow-[0_18px_45px_color-mix(in_oklch,var(--landing-fg)_9%,transparent)]">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-landing-accent" />
          <span className="landing-font-mono text-[10px] font-semibold tracking-[0.16em] text-white/45 uppercase">{language}</span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex h-7 w-7 items-center justify-center rounded border border-transparent text-white/50 transition hover:border-white/15 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <Highlight theme={emptyTheme} code={children.trimEnd()} language={language}>
        {({ tokens }) => (
          <pre className="m-0 overflow-x-auto p-4 text-[13px] leading-6"><code className="landing-font-mono">{tokens.map((line, lineIndex) => (
            <span key={lineIndex} className="block min-h-6">{line.length === 0 ? '\n' : line.map((token, tokenIndex) => <span key={tokenIndex} className={getTokenClass(token.types)}>{token.content}</span>)}</span>
          ))}</code></pre>
        )}
      </Highlight>
    </div>
  )
}
