import type { ApiItem } from '../data'

interface ApiTableProps {
  items: ApiItem[]
  showCompanion?: boolean
}

export function ApiTable({ items, showCompanion = false }: ApiTableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-landing-border bg-landing-surface/40">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-landing-border text-xs text-landing-muted">
          <tr>
            <th className="px-4 py-3 font-medium">API</th>
            {showCompanion && <th className="px-4 py-3 font-medium">Built with</th>}
            <th className="px-4 py-3 font-medium">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-t border-landing-border align-top">
              <td className="landing-font-mono whitespace-nowrap px-4 py-3 text-[12px] font-medium text-landing-fg">{item.name}</td>
              {showCompanion && <td className="landing-font-mono px-4 py-3 text-[12px] text-landing-accent">{item.companion ?? '—'}</td>}
              <td className="px-4 py-3 leading-6 text-landing-muted">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
