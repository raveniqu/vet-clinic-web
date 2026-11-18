import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ownersListQueryOptions } from "#/client/caches/owners/queries/owners.query";
import { filterOwners } from "../models/owners-table";
import { useOwnersSearch } from "./use-owners-search";

export function useOwnersList() {
  const { search } = useOwnersSearch();

  const { data: allOwners = [], isPending } = useQuery({
    ...ownersListQueryOptions(),
    placeholderData: keepPreviousData,
  });

  const filteredOwners = useMemo(
    () => filterOwners(allOwners, search.search, search.quickFilters),
    [allOwners, search.search, search.quickFilters]
  );

  const activeFilterCount = search.quickFilters.length + (search.search.trim().length > 0 ? 1 : 0);
  const hasActiveFilter = activeFilterCount > 0;
  const filterResetKey = `${search.search}|${search.quickFilters.join(",")}`;

  return {
    allOwners,
    filteredOwners,
    isPending,
    activeFilterCount,
    hasActiveFilter,
    filterResetKey,
    isEmptyDataset: allOwners.length === 0,
  };
}
