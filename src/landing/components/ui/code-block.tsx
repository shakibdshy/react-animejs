import React, { memo } from 'react';
import { cn } from '@/landing/utils/cn';
import { useCopyToClipboard } from '@/landing/hooks/use-copy-to-clipboard';

interface CodeBlockProps {
  language?: string;
  title: string;
  children: React.ReactNode;
  rawText?: string;
  className?: string;
}

export const CodeBlock = memo(function CodeBlock({
  title,
  children,
  rawText,
  className,
}: CodeBlockProps) {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    if (rawText) {
      void copy(rawText);
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-landing-border overflow-hidden text-[13px] leading-[1.8]',
        'bg-landing-bg/80',
        className
      )}
    >
      <div className="flex justify-between items-center px-4 py-3 bg-landing-surface border-b border-landing-border">
        <span className="landing-font-mono text-[11px] text-landing-muted uppercase tracking-wider">
          {title}
        </span>
        <button
          onClick={handleCopy}
          className="bg-transparent border-none text-landing-muted cursor-pointer text-xs px-2 py-1 rounded hover:text-landing-fg transition-colors duration-200 landing-font-mono"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto">
        <code className="text-landing-fg/80">{children}</code>
      </pre>
    </div>
  );
});
