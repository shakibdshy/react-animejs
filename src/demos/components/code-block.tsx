import { memo, useCallback, useState } from 'react';
import { Highlight } from 'prism-react-renderer';

const EMPTY_THEME = {
  plain: { color: '', backgroundColor: '' },
  styles: [] as Array<{ types: string[]; style: Record<string, string> }>,
};

const TOKEN_CLASS_MAP: Record<string, string> = {
  comment: 'cb-tok-comment',
  prolog: 'cb-tok-comment',
  doctype: 'cb-tok-comment',
  cdata: 'cb-tok-comment',
  punctuation: 'cb-tok-punct',
  property: 'cb-tok-prop',
  tag: 'cb-tok-tag',
  boolean: 'cb-tok-const',
  number: 'cb-tok-num',
  constant: 'cb-tok-const',
  symbol: 'cb-tok-const',
  selector: 'cb-tok-str',
  'attr-name': 'cb-tok-attr',
  string: 'cb-tok-str',
  char: 'cb-tok-str',
  builtin: 'cb-tok-builtin',
  operator: 'cb-tok-op',
  entity: 'cb-tok-op',
  url: 'cb-tok-str',
  atrule: 'cb-tok-kw',
  'attr-value': 'cb-tok-str',
  keyword: 'cb-tok-kw',
  function: 'cb-tok-fn',
  'class-name': 'cb-tok-class',
  regex: 'cb-tok-regex',
  important: 'cb-tok-kw',
  variable: 'cb-tok-var',
  inserted: 'cb-tok-str',
  deleted: 'cb-tok-kw',
  'string-property': 'cb-tok-prop',
};

function getTokenClass(types: string[]): string {
  for (let i = types.length - 1; i >= 0; i--) {
    const cls = TOKEN_CLASS_MAP[types[i]];
    if (cls) return cls;
  }
  return '';
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock = memo(function CodeBlock({
  code,
  language = 'jsx',
}: CodeBlockProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const handleMouseEnter = useCallback((line: number) => {
    setHoveredLine(line);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredLine(null);
  }, []);

  return (
    <Highlight theme={EMPTY_THEME} code={code.trimEnd()} language={language}>
      {({ tokens }) => (
        <div className="code-block-root">
          <table className="code-block-table">
            <tbody>
              {tokens.map((line, i) => {
                const isHovered = hoveredLine === i;

                return (
                  <tr
                    key={i}
                    className={[
                      'code-block-line',
                      isHovered && 'code-block-line--hovered',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <td className="code-block-gutter">
                      <span className="code-block-linenum">{i + 1}</span>
                    </td>
                    <td className="code-block-content">
                      {line.length === 0 ? (
                        <span>{'\n'}</span>
                      ) : (
                        line.map((token, key) => {
                          const cls = getTokenClass(token.types);
                          return (
                            <span key={key} className={cls || undefined}>
                              {token.content}
                            </span>
                          );
                        })
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Highlight>
  );
});
