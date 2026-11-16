import { useBatchSlice } from "#/client/shared/hooks/use-batch-slice";
import { usePetsDashboardContext } from "../contexts/pets-dashboard-provider";
import { PET_GRID_BATCH_SIZE } from "../models/pets-table";

export function usePetsGrid() {
  const { allPets, filteredPets, hasActiveFilter, clearFilters, filterResetKey, setEditingPet } =
    usePetsDashboardContext();

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
    isEmptyDataset: allPets.length === 0,
    hasActiveFilter,
    clearFilters,
    setEditingPet,
  };
}
