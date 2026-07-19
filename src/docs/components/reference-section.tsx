import { CodeBlock } from './code-block'
import type { ReferenceEntry } from '../reference-data'

interface ReferenceSectionProps {
  entry: ReferenceEntry
  kind: 'Hook' | 'Component'
}

export function ReferenceSection({ entry, kind }: ReferenceSectionProps) {
  return (
    <section id={entry.id} className="scroll-mt-24 border-b border-landing-border py-11 last:border-b-0">
      <div>
        <p className="landing-font-mono m-0 text-[10px] font-semibold tracking-[0.16em] text-landing-accent uppercase">{kind}</p>
        <h3 className="landing-font-display mt-2 text-[1.85rem] font-bold tracking-tight text-landing-fg">{entry.name}</h3>
        <p className="landing-font-mono mt-2 text-[12px] text-landing-accent">{entry.signature}</p>
      </div>
      <p className="mt-5 text-[15px] leading-7 text-landing-muted">{entry.description}</p>

      <h4 className="mt-8 text-sm font-semibold text-landing-fg">Usage</h4>
      <CodeBlock>{entry.usage}</CodeBlock>

      <h4 className="mt-8 text-sm font-semibold text-landing-fg">Example</h4>
      <CodeBlock>{entry.example}</CodeBlock>

      <h4 className="mt-8 text-sm font-semibold text-landing-fg">{kind === 'Hook' ? 'Options and return type' : 'Props'}</h4>
      <div className="mt-3 overflow-hidden rounded-lg border border-landing-border bg-landing-surface/35">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-landing-border text-xs text-landing-muted">
            <tr><th className="px-4 py-3 font-medium">{kind === 'Hook' ? 'Option' : 'Prop'}</th><th className="px-4 py-3 font-medium">Type</th><th className="hidden px-4 py-3 font-medium sm:table-cell">Description</th></tr>
          </thead>
          <tbody>
            {entry.properties.map((property) => <tr key={property.name} className="border-t border-landing-border align-top first:border-t-0">
              <td className="landing-font-mono whitespace-nowrap px-4 py-3 text-[12px] font-medium text-landing-fg">{property.name}{property.required && <span className="ml-1 text-landing-accent">*</span>}</td>
              <td className="landing-font-mono px-4 py-3 text-[12px] text-landing-accent">{property.type}</td>
              <td className="hidden px-4 py-3 leading-6 text-landing-muted sm:table-cell">{property.description}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>
  )
}
