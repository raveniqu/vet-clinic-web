import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface UseBatchSliceOptions {
  initialCount: number;
  step?: number;
  resetOnChange?: unknown;
}

export interface UseBatchSliceReturn<TItem> {
  displayedItems: TItem[];
  shownCount: number;
  totalCount: number;
  remainingCount: number;
  nextBatchCount: number;
  hasMore: boolean;
  loadMore: () => void;
}

export function useBatchSlice<TItem>(
  items: readonly TItem[],
  { initialCount, step = initialCount, resetOnChange }: UseBatchSliceOptions
): UseBatchSliceReturn<TItem> {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const prevTrigger = useRef({ resetOnChange, initialCount });

  useEffect(() => {
    if (
      Object.is(prevTrigger.current.resetOnChange, resetOnChange) &&
      prevTrigger.current.initialCount === initialCount
    ) {
      return;
    }
    prevTrigger.current = { resetOnChange, initialCount };
    setDisplayCount(initialCount);
  }, [resetOnChange, initialCount]);

  const displayedItems = useMemo<TItem[]>(() => {
    return items.slice(0, displayCount);
  }, [items, displayCount]);

  const totalCount = items.length;
  const shownCount = displayedItems.length;
  const remainingCount = Math.max(0, totalCount - shownCount);
  const hasMore = remainingCount > 0;
  const nextBatchCount = Math.min(step, remainingCount);

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + step);
  }, [step]);

  return {
    displayedItems,
    shownCount,
    totalCount,
    remainingCount,
    nextBatchCount,
    hasMore,
    loadMore,
  };
}
