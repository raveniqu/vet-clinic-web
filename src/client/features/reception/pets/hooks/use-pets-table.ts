import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { speciesQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { useClipboardCopy } from "#/client/shared/hooks/use-clipboard-copy";
import { useDataTable } from "#/client/shared/hooks/use-data-table";
import { usePetsDashboardContext } from "../contexts/pets-dashboard-provider";
import { TABLE_PAGE_SIZE_ITEMS } from "../models/pets-table";

export function usePetsTable(pageSize = 10) {
  const {
    allPets,
    filteredPets,
    hasActiveFilter,
    clearFilters,
    filterResetKey,
    visibleColumns,
    setEditingPet,
  } = usePetsDashboardContext();

  const { data: speciesList = [] } = useQuery(speciesQueryOptions());

  const {
    paginatedItems: paginatedPets,
    pagination,
    pageSizeItems,
    onPageSizeChange,
    totalCount,
    isEmptyDataset,
    hasColumn,
    visibleColSpan,
  } = useDataTable({
    allItems: allPets,
    filteredItems: filteredPets,
    visibleColumns,
    hasActiveFilter,
    clearFilters,
    filterResetKey,
    initialPageSize: pageSize,
    pageSizeItems: TABLE_PAGE_SIZE_ITEMS,
  });

  const { copiedKey: copiedMicrochipPetId, copyValue: copyMicrochip } = useClipboardCopy<number>();

  const speciesCodeById = useMemo(() => {
    const map = new Map<number, string>();
    for (const item of speciesList) {
      map.set(item.id, item.code);
    }
    return map;
  }, [speciesList]);

  return {
    paginatedPets,
    totalCount,
    isEmptyDataset,
    hasActiveFilter,
    clearFilters,
    pagination,
    pageSizeItems,
    onPageSizeChange,
    hasColumn,
    visibleColSpan,
    speciesCodeById,
    copiedMicrochipPetId,
    copyMicrochip,
    setEditingPet,
  };
}
