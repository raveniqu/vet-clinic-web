import { useCallback, useMemo } from "react";
import { DEFAULT_PAGE_SIZE_ITEMS } from "../components/app-rows-per-page-selector";
import type { PageSizeOption } from "../components/app-rows-per-page-selector";
import { useClientPagination } from "./use-pagination";
import type { PaginationReturn } from "./use-pagination";

export interface UseDataTableOptions<TItem, TColumnKey extends string> {
  allItems: readonly TItem[];
  filteredItems: readonly TItem[];
  visibleColumns: readonly TColumnKey[];
  hasActiveFilter: boolean;
  clearFilters: () => void;
  filterResetKey?: unknown;
  initialPageSize?: number;
  pageSizeItems?: readonly PageSizeOption[];
  actionColumnCount?: number;
}

export interface DataTableReturn<TItem, TColumnKey extends string> {
  paginatedItems: TItem[];
  pagination: PaginationReturn;
  pageSizeItems: readonly PageSizeOption[];
  onPageSizeChange: (value: number | null) => void;
  totalCount: number;
  isEmptyDataset: boolean;
  hasActiveFilter: boolean;
  clearFilters: () => void;
  hasColumn: (key: TColumnKey) => boolean;
  visibleColSpan: number;
}

export function useDataTable<TItem, TColumnKey extends string>({
  allItems,
  filteredItems,
  visibleColumns,
  hasActiveFilter,
  clearFilters,
  filterResetKey,
  initialPageSize = 10,
  pageSizeItems = DEFAULT_PAGE_SIZE_ITEMS,
  actionColumnCount = 1,
}: UseDataTableOptions<TItem, TColumnKey>): DataTableReturn<TItem, TColumnKey> {
  const { paginatedItems, ...pagination } = useClientPagination(filteredItems, {
    initialPageSize,
    resetOnChange: filterResetKey,
  });

  const visibleColumnSet = useMemo(() => new Set<TColumnKey>(visibleColumns), [visibleColumns]);

  const hasColumn = useCallback((key: TColumnKey) => visibleColumnSet.has(key), [visibleColumnSet]);

  const onPageSizeChange = useCallback(
    (value: number | null) => {
      if (typeof value === "number" && value > 0) {
        pagination.setPageSize(value);
      }
    },
    [pagination.setPageSize]
  );

  return {
    paginatedItems,
    pagination,
    pageSizeItems,
    onPageSizeChange,
    totalCount: filteredItems.length,
    isEmptyDataset: allItems.length === 0,
    hasActiveFilter,
    clearFilters,
    hasColumn,
    visibleColSpan: visibleColumns.length + actionColumnCount,
  };
}
