import { cn } from "cn";
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "../shadcn/components/ui/pagination";
import { AppPaginationLink, AppPaginationNextLink, AppPaginationPreviousLink } from "./app-link";

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

export type PaginationContextValue = Pick<
  PaginationReturn,
  | "currentPage"
  | "totalPages"
  | "canGoPrevious"
  | "canGoNext"
  | "goToPreviousPage"
  | "goToNextPage"
  | "goToPage"
>;

const PaginationContext = createContext<PaginationContextValue | null>(null);

export interface PaginationProviderProps {
  value: PaginationContextValue;
  children: ReactNode;
}

export function PaginationProvider({ value, children }: PaginationProviderProps) {
  return <PaginationContext.Provider value={value}>{children}</PaginationContext.Provider>;
}

export function usePaginationContext(): PaginationContextValue | null {
  return useContext(PaginationContext);
}

export interface AppPaginationProps {
  pagination?: PaginationContextValue;
  defaultPage?: number;
  currentPage?: number;
  totalPages?: number;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  onPageChange?: (page: number) => void;
  goToPreviousPage?: () => void;
  goToNextPage?: () => void;
  goToPage?: (page: number) => void;
  className?: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export function AppPagination({
  pagination: propsPagination,
  defaultPage = 1,
  currentPage: propCurrentPage,
  totalPages: propTotalPages,
  canGoPrevious: propCanGoPrevious,
  canGoNext: propCanGoNext,
  onPageChange,
  goToPreviousPage: propGoToPreviousPage,
  goToNextPage: propGoToNextPage,
  goToPage: propGoToPage,
  className,
}: AppPaginationProps = {}) {
  const context = usePaginationContext();
  const [internalPage, setInternalPage] = useState(defaultPage);

  const isControlled = propCurrentPage !== undefined;
  const activeCurrentPage = isControlled ? propCurrentPage : internalPage;

  const pagination = useMemo<PaginationContextValue | null>(() => {
    if (propsPagination) {
      return propsPagination;
    }

    if (propTotalPages !== undefined) {
      const validTotalPages = Math.max(1, propTotalPages);
      const validPage = Math.min(Math.max(1, activeCurrentPage), validTotalPages);

      return {
        currentPage: validPage,
        totalPages: validTotalPages,
        canGoPrevious: propCanGoPrevious ?? validPage > 1,
        canGoNext: propCanGoNext ?? validPage < validTotalPages,
        goToPreviousPage: () => {
          const prev = Math.max(1, validPage - 1);
          if (!isControlled) setInternalPage(prev);
          propGoToPreviousPage?.();
          onPageChange?.(prev);
        },
        goToNextPage: () => {
          const next = Math.min(validTotalPages, validPage + 1);
          if (!isControlled) setInternalPage(next);
          propGoToNextPage?.();
          onPageChange?.(next);
        },
        goToPage: (page: number) => {
          const target = Math.max(1, Math.min(validTotalPages, page));
          if (!isControlled) setInternalPage(target);
          propGoToPage?.(target);
          onPageChange?.(target);
        },
      };
    }

    return context;
  }, [
    propsPagination,
    propTotalPages,
    activeCurrentPage,
    propCanGoPrevious,
    propCanGoNext,
    isControlled,
    propGoToPreviousPage,
    propGoToNextPage,
    propGoToPage,
    onPageChange,
    context,
  ]);

  if (!pagination) {
    return null;
  }

  const {
    currentPage,
    totalPages,
    canGoPrevious,
    canGoNext,
    goToPreviousPage,
    goToNextPage,
    goToPage,
  } = pagination;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination className={cn("mx-0 w-auto", className)}>
      <PaginationContent>
        <PaginationItem>
          <AppPaginationPreviousLink
            to="."
            text=""
            size="icon-sm"
            className={cn("items-center p-0!", !canGoPrevious && "pointer-events-none opacity-50")}
            aria-disabled={!canGoPrevious}
            tabIndex={canGoPrevious ? 0 : -1}
            onClick={(e) => {
              e.preventDefault();
              if (canGoPrevious) {
                goToPreviousPage();
              }
            }}
          />
        </PaginationItem>

        {pageNumbers.map((item, idx) => {
          if (item === "ellipsis") {
            return (
              <PaginationItem key={idx === 1 ? "ellipsis-start" : "ellipsis-end"}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const pageNumber = item;
          const isActive = currentPage === pageNumber;
          return (
            <PaginationItem key={pageNumber}>
              <AppPaginationLink
                to="."
                size="icon-sm"
                isActive={isActive}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(pageNumber);
                }}
                className={cn("", {
                  "shadow-md/10 inset-shadow-sm/10": isActive,
                })}
              >
                {pageNumber}
              </AppPaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <AppPaginationNextLink
            to="."
            text=""
            size="icon-sm"
            className={cn("items-center p-0!", !canGoNext && "pointer-events-none opacity-50")}
            aria-disabled={!canGoNext}
            tabIndex={canGoNext ? 0 : -1}
            onClick={(e) => {
              e.preventDefault();
              if (canGoNext) {
                goToNextPage();
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
