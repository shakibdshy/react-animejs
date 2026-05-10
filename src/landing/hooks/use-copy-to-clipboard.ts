import { useCallback, useState } from 'react';

interface UseCopyToClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
  reset: () => void;
}

export function useCopyToClipboard(resetDelay = 1500): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      } catch {
        console.warn('Copy to clipboard failed');
      }
    },
    [resetDelay]
  );

  const reset = useCallback(() => setCopied(false), []);

  return { copied, copy, reset };
}
