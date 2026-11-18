import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { petsListQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { filterPets } from "../models/pets-table";
import { usePetsSearch } from "./use-pets-search";

export function usePetsList() {
  const { searchTerm, selectedSpeciesId, quickFilters } = usePetsSearch();
  const { data: allPets = [], isLoading, isError, error } = useQuery(petsListQueryOptions());

  const filteredPets = useMemo(
    () =>
      filterPets(allPets, {
        searchTerm,
        selectedSpeciesId,
        quickFilters,
      }),
    [allPets, searchTerm, selectedSpeciesId, quickFilters]
  );

  return {
    allPets,
    filteredPets,
    isEmptyDataset: allPets.length === 0,
    isLoading,
    isError,
    error,
  };
}
