import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "#/shared/schemas/pagination.schema";
import { petsSearchSchema } from "#/shared/schemas/pet.schema";
import type { PetQuickFilterKey, PetTabValue } from "#/shared/schemas/pet.schema";

export function usePetsSearch() {
  const navigate = useNavigate();
  const rawSearch = useSearch({ strict: false });

  const search = useMemo(() => {
    const parsed = petsSearchSchema.safeParse(rawSearch ?? {});
    return parsed.success ? parsed.data : {};
  }, [rawSearch]);

  const searchTerm = search.search ?? "";
  const selectedSpeciesId = search.speciesId ?? 0;
  const quickFilters = useMemo<PetQuickFilterKey[]>(
    () => search.quickFilters ?? [],
    [search.quickFilters]
  );
  const selectedTab: PetTabValue = search.tab ?? "list";
  const page = search.page ?? DEFAULT_PAGE;
  const pageSize = search.pageSize ?? DEFAULT_PAGE_SIZE;
  const editPetId = search.editPetId;

  const activeFilterCount =
    (searchTerm.trim().length > 0 ? 1 : 0) + (selectedSpeciesId > 0 ? 1 : 0) + quickFilters.length;
  const hasActiveFilter = activeFilterCount > 0;

  const filterResetKey = useMemo(
    () => `${selectedSpeciesId}|${searchTerm.trim()}|${[...quickFilters].sort().join(",")}`,
    [selectedSpeciesId, searchTerm, quickFilters]
  );

  const setSearchTerm = useCallback(
    (term: string) => {
      void navigate({
        to: "/pets",
        search: (prev) => ({
          ...prev,
          search: term.length > 0 ? term : undefined,
          page: undefined,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  const setSelectedSpeciesId = useCallback(
    (speciesId: number) => {
      void navigate({
        to: "/pets",
        search: (prev) => ({
          ...prev,
          speciesId: speciesId > 0 ? speciesId : undefined,
          page: undefined,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  const setQuickFilters = useCallback(
    (filters: PetQuickFilterKey[]) => {
      void navigate({
        to: "/pets",
        search: (prev) => ({
          ...prev,
          quickFilters: filters.length > 0 ? filters : undefined,
          page: undefined,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  const setSelectedTab = useCallback(
    (tab: PetTabValue) => {
      void navigate({
        to: "/pets",
        search: (prev) => ({
          ...prev,
          tab: tab !== "list" ? tab : undefined,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  const clearFilters = useCallback(() => {
    void navigate({
      to: "/pets",
      search: (prev) => ({
        ...prev,
        search: undefined,
        speciesId: undefined,
        quickFilters: undefined,
        page: undefined,
      }),
      replace: true,
    });
  }, [navigate]);

  const setPage = useCallback(
    (nextPage: number) => {
      void navigate({
        to: "/pets",
        search: (prev) => ({
          ...prev,
          page: nextPage > DEFAULT_PAGE ? nextPage : undefined,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  const setPageSize = useCallback(
    (nextPageSize: number) => {
      void navigate({
        to: "/pets",
        search: (prev) => ({
          ...prev,
          pageSize: nextPageSize !== DEFAULT_PAGE_SIZE ? nextPageSize : undefined,
          page: undefined,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  const setEditPetId = useCallback(
    (petId: string | undefined) => {
      void navigate({
        to: "/pets",
        search: (prev) => ({
          ...prev,
          editPetId: petId,
        }),
        replace: true,
      });
    },
    [navigate]
  );

  return {
    searchTerm,
    selectedSpeciesId,
    quickFilters,
    selectedTab,
    page,
    pageSize,
    editPetId,
    activeFilterCount,
    hasActiveFilter,
    filterResetKey,
    setSearchTerm,
    setSelectedSpeciesId,
    setQuickFilters,
    setSelectedTab,
    clearFilters,
    setPage,
    setPageSize,
    setEditPetId,
  };
}
