import { useBatchSlice } from "#/client/shared/hooks/use-batch-slice";
import { useSidebar } from "#/client/shared/shadcn/components/ui/sidebar";
import { PET_GRID_BATCH_SIZE } from "../models/pets-table";
import { usePetsList } from "./use-pets-list";
import { usePetsSearch } from "./use-pets-search";

export function usePetsGrid() {
  const { filteredPets, isEmptyDataset } = usePetsList();
  const { hasActiveFilter, clearFilters, filterResetKey } = usePetsSearch();
  const { open: isSidebarOpen } = useSidebar();

  const {
    displayedItems: displayedPets,
    shownCount,
    totalCount,
    remainingCount,
    nextBatchCount,
    hasMore,
    loadMore,
  } = useBatchSlice(filteredPets, {
    initialCount: PET_GRID_BATCH_SIZE,
    step: PET_GRID_BATCH_SIZE,
    resetOnChange: filterResetKey,
  });

  return {
    displayedPets,
    shownCount,
    totalCount,
    remainingCount,
    nextBatchCount,
    hasMore,
    loadMore,
    isEmptyDataset,
    hasActiveFilter,
    clearFilters,
    isSidebarOpen,
  };
}
