import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { speciesQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { usePetsSearch } from "./use-pets-search";

export function usePetSelection() {
  const { selectedSpeciesId, setSelectedSpeciesId } = usePetsSearch();
  const { data: speciesList = [] } = useQuery(speciesQueryOptions());

  const selectItems = useMemo(
    () => [
      { label: "All Species", value: 0 },
      ...speciesList.map((species) => ({
        label: species.name,
        value: species.id,
      })),
    ],
    [speciesList]
  );

  const handleSelectedSpeciesId = useCallback(
    (speciesId: number) => {
      setSelectedSpeciesId(speciesId);
    },
    [setSelectedSpeciesId]
  );

  return {
    selectItems,
    selectedSpeciesId,
    onSelectedSpeciesId: handleSelectedSpeciesId,
  };
}
