import { useQuickFilters } from "#/client/shared/hooks/use-quick-filters";
import { PET_QUICK_FILTERS } from "../models/pets-table";
import { usePetsList } from "./use-pets-list";
import { usePetsSearch } from "./use-pets-search";

export function usePetQuickFilters() {
  const { allPets, filteredPets } = usePetsList();
  const { quickFilters, setQuickFilters, activeFilterCount, hasActiveFilter, clearFilters } =
    usePetsSearch();

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
