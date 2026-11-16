import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  resetOnChange?: unknown;
}

export interface PaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  startIndex: number;
  endIndex: number;
  startItemIndex: number;
  endItemIndex: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToPage: (page: number) => void;
  resetPage: () => void;
  setPageSize: (newSize: number) => void;
  summaryText: string;
}

export function usePagination(
  totalCount: number,
  options: PaginationOptions = {}
): PaginationReturn {
  const { initialPage = 1, initialPageSize = 10, resetOnChange } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(validCurrentPage * pageSize, totalCount);
  const startItemIndex = totalCount === 0 ? 0 : startIndex + 1;
  const endItemIndex = endIndex;

  const canGoPrevious = validCurrentPage > 1;
  const canGoNext = validCurrentPage < totalPages;

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (resetOnChange !== undefined) {
      setCurrentPage(1);
    }
  }, [resetOnChange]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      const targetPage = Math.max(1, Math.min(totalPages, page));
      setCurrentPage(targetPage);
    },
    [totalPages]
  );

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  const summaryText = useMemo(() => {
    if (totalCount === 0) {
      return "0 จาก 0 รายการ";
    }
    return `${startItemIndex} - ${endItemIndex} จาก ${totalCount} รายการ`;
  }, [totalCount, startItemIndex, endItemIndex]);

  return {
    currentPage: validCurrentPage,
    pageSize,
    totalPages,
    totalCount,
    startIndex,
    endIndex,
    startItemIndex,
    endItemIndex,
    canGoPrevious,
    canGoNext,
    goToPreviousPage,
    goToNextPage,
    goToPage,
    resetPage,
    setPageSize: handlePageSizeChange,
    summaryText,
  };
}

export interface ClientPaginationReturn<T> extends PaginationReturn {
  paginatedItems: T[];
}

export function useClientPagination<T>(
  items: readonly T[],
  options: PaginationOptions = {}
): ClientPaginationReturn<T> {
  const pagination = usePagination(items.length, options);

  const paginatedItems = useMemo(() => {
    return items.slice(pagination.startIndex, pagination.endIndex);
  }, [items, pagination.startIndex, pagination.endIndex]);

  return {
    ...pagination,
    paginatedItems,
  };
}
