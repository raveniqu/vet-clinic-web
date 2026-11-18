import { useCallback } from "react";
import { useQuickFilters } from "#/client/shared/hooks/use-quick-filters";
import type { OwnerQuickFilterKey } from "#/shared/schemas/owner.schema";
import { OWNER_QUICK_FILTERS } from "../models/owners-table";
import { useOwnersList } from "./use-owners-list";
import { useOwnersSearch } from "./use-owners-search";

export function useOwnersQuickFilters() {
  const { search, updateSearch, resetFilters } = useOwnersSearch();
  const { allOwners, filteredOwners, activeFilterCount, hasActiveFilter } = useOwnersList();

  const setQuickFilters = useCallback(
    (quickFilters: OwnerQuickFilterKey[]) => {
      updateSearch({ quickFilters, page: 1 });
    },
    [updateSearch]
  );

  return useQuickFilters({
    allItems: allOwners,
    filteredItems: filteredOwners,
    definitions: OWNER_QUICK_FILTERS,
    quickFilters: search.quickFilters,
    setQuickFilters,
    activeFilterCount,
    hasActiveFilter,
    clearFilters: resetFilters,
  });
}
