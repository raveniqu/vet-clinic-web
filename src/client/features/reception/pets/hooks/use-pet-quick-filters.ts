import { useQuickFilters } from "#/client/shared/hooks/use-quick-filters";
import { usePetsDashboardContext } from "../contexts/pets-dashboard-provider";
import { PET_QUICK_FILTERS } from "../models/pets-table";

export function usePetQuickFilters() {
  const {
    allPets,
    filteredPets,
    quickFilters,
    setQuickFilters,
    activeFilterCount,
    hasActiveFilter,
    clearFilters,
  } = usePetsDashboardContext();

  return useQuickFilters({
    allItems: allPets,
    filteredItems: filteredPets,
    definitions: PET_QUICK_FILTERS,
    quickFilters,
    setQuickFilters,
    activeFilterCount,
    hasActiveFilter,
    clearFilters,
  });
}
