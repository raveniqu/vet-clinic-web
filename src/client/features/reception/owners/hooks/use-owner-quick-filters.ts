import { useQuickFilters } from "#/client/shared/hooks/use-quick-filters";
import { useOwnersDashboardContext } from "../contexts/owners-dashboard-provider";
import { OWNER_QUICK_FILTERS } from "../models/owners-table";

export function useOwnerQuickFilters() {
  const {
    allOwners,
    filteredOwners,
    quickFilters,
    setQuickFilters,
    activeFilterCount,
    hasActiveFilter,
    clearFilters,
  } = useOwnersDashboardContext();

  return useQuickFilters({
    allItems: allOwners,
    filteredItems: filteredOwners,
    definitions: OWNER_QUICK_FILTERS,
    quickFilters,
    setQuickFilters,
    activeFilterCount,
    hasActiveFilter,
    clearFilters,
  });
}
