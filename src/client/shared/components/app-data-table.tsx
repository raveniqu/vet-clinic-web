import type { Cell, ReactTable, RowData } from "@tanstack/react-table";
import {
  columnVisibilityFeature,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import type { PaginationReturn } from "./app-pagination";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "#/shared/schemas/pagination.schema";
import { Button } from "../shadcn/components/ui/button";
import { Skeleton } from "../shadcn/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/components/ui/table";
import { AppCard, AppCardContent, AppCardFooter } from "./app-card";
import { AppPagination } from "./app-pagination";
import type { PageSizeOption } from "./app-rows-per-page-selector";
import { AppRowsPerPageSelector } from "./app-rows-per-page-selector";

export interface AppDataTableColumnMeta {
  headClassName?: string;
  cellClassName?: string;
  headerSrOnly?: boolean;
}

export const dataTableFeatures = tableFeatures({
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: {} as AppDataTableColumnMeta,
});

export function createAppColumnHelper<TData extends RowData>() {
  return createColumnHelper<typeof dataTableFeatures, TData>();
}

interface AppDataTableProps<TData extends RowData> {
  table: ReactTable<typeof dataTableFeatures, TData>;
  isLoading?: boolean;
  emptyState?: ReactNode;
  emptyMessage?: string;
  itemLabel?: string;
  pageSizeOptions?: readonly number[];
  className?: string;
  rowClassName?: string;
  renderCell?: (cell: Cell<typeof dataTableFeatures, TData, unknown>) => ReactNode;
}

export function AppDataTable<TData extends RowData>({
  table,
  isLoading = false,
  emptyState,
  emptyMessage = "No records found",
  itemLabel = "items",
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  className,
  rowClassName = "group/row",
  renderCell,
}: AppDataTableProps<TData>) {
  const { pageIndex, pageSize } = table.state.pagination;
  const currentPageSize = pageSize || DEFAULT_PAGE_SIZE;
  const totalRows = table.getRowCount();
  const pageCount = Math.max(1, table.getPageCount());
  const canGoPrevious = table.getCanPreviousPage();
  const canGoNext = table.getCanNextPage();

  const pageSizeItems = useMemo<PageSizeOption[]>(
    () =>
      pageSizeOptions.map((size) => ({
        label: String(size),
        value: size,
      })),
    [pageSizeOptions]
  );

  const paginationAdapter = useMemo<PaginationReturn>(() => {
    const startIndex = pageIndex * currentPageSize;
    const endIndex = Math.min((pageIndex + 1) * currentPageSize, totalRows);
    const startItemIndex = totalRows === 0 ? 0 : startIndex + 1;
    const endItemIndex = endIndex;

    return {
      currentPage: pageIndex + 1,
      pageSize: currentPageSize,
      totalPages: pageCount,
      totalCount: totalRows,
      startIndex,
      endIndex,
      startItemIndex,
      endItemIndex,
      canGoPrevious,
      canGoNext,
      goToPreviousPage: () => table.previousPage(),
      goToNextPage: () => table.nextPage(),
      goToPage: (page: number) => table.setPageIndex(page - 1),
      resetPage: () => table.setPageIndex(0),
      setPageSize: (newSize: number) => table.setPageSize(newSize),
      summaryText:
        totalRows === 0
          ? "0 จาก 0 รายการ"
          : `${startItemIndex} - ${endItemIndex} จาก ${totalRows} รายการ`,
    };
  }, [pageIndex, currentPageSize, pageCount, totalRows, canGoPrevious, canGoNext, table]);

  if (isLoading) {
    return (
      <AppCard className={className}>
        <AppCardContent className="gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </AppCardContent>
      </AppCard>
    );
  }

  const rows = table.getRowModel().rows;
  const visibleColumnCount = Math.max(1, table.getVisibleLeafColumns().length);

  return (
    <AppCard className={className}>
      <AppCardContent className="p-0">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;

                  if (header.isPlaceholder) {
                    return <TableHead key={header.id} className={meta?.headClassName} />;
                  }

                  const canSort = header.column.getCanSort();
                  const sortedState = header.column.getIsSorted();

                  return (
                    <TableHead key={header.id} className={meta?.headClassName}>
                      {meta?.headerSrOnly ? (
                        <span className="sr-only">
                          <table.FlexRender header={header} />
                        </span>
                      ) : canSort ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="-ml-2 h-8 px-2 font-medium"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                          {sortedState === "asc" ? (
                            <ArrowUp className="size-3.5" aria-hidden="true" />
                          ) : sortedState === "desc" ? (
                            <ArrowDown className="size-3.5" aria-hidden="true" />
                          ) : (
                            <ArrowUpDown
                              className="size-3.5 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumnCount} className="p-0">
                  {emptyState ?? (
                    <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                      {emptyMessage}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className={rowClassName}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.columnDef.meta?.cellClassName}>
                      {renderCell ? renderCell(cell) : <table.FlexRender cell={cell} />}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AppCardContent>

      {totalRows > 0 ? (
        <AppCardFooter className="flex-wrap gap-3 py-3">
          <AppRowsPerPageSelector
            pagination={paginationAdapter}
            pageSizeItems={pageSizeItems}
            itemLabel={itemLabel}
          />

          <AppPagination
            className="ml-auto"
            currentPage={paginationAdapter.currentPage}
            totalPages={paginationAdapter.totalPages}
            canGoPrevious={paginationAdapter.canGoPrevious}
            canGoNext={paginationAdapter.canGoNext}
            onPageChange={paginationAdapter.goToPage}
            goToPreviousPage={paginationAdapter.goToPreviousPage}
            goToNextPage={paginationAdapter.goToNextPage}
          />
        </AppCardFooter>
      ) : null}
    </AppCard>
  );
}
