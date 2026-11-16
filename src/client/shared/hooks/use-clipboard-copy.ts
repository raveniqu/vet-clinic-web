import { useCallback, useEffect, useRef, useState } from "react";

export interface ClipboardCopyReturn<TKey extends string | number = string> {
  copiedKey: TKey | null;
  copyValue: (key: TKey, rawValue: string) => Promise<void>;
  isCopied: (key: TKey) => boolean;
}

export function useClipboardCopy<TKey extends string | number = string>(
  resetDelayMs = 1500
): ClipboardCopyReturn<TKey> {
  const [copiedKey, setCopiedKey] = useState<TKey | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const copyValue = useCallback(
    async (key: TKey, rawValue: string) => {
      const cleanValue = rawValue.trim();
      if (!cleanValue) return;

      try {
        await navigator.clipboard.writeText(cleanValue);
        setCopiedKey(key);
        if (copyTimerRef.current) {
          clearTimeout(copyTimerRef.current);
        }
        copyTimerRef.current = setTimeout(() => {
          setCopiedKey(null);
        }, resetDelayMs);
      } catch {
        // Ignore clipboard write rejection in restricted browser contexts
      }
    },
    [resetDelayMs]
  );

  const isCopied = useCallback((key: TKey) => copiedKey === key, [copiedKey]);

  return {
    copiedKey,
    copyValue,
    isCopied,
  };
}
