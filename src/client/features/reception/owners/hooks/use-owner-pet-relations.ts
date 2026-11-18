import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { petsListQueryOptions, speciesQueryOptions } from "#/client/caches/pets/queries/pets.query";
import type { PetDto } from "#/shared/schemas/pet.schema";

export function useOwnerPetRelations() {
  const { data: allPets = [] } = useQuery(petsListQueryOptions());
  const { data: speciesList = [] } = useQuery(speciesQueryOptions());

  const petsByOwnerId = useMemo(() => {
    const grouped = new Map<string, PetDto[]>();
    for (const pet of allPets) {
      const existing = grouped.get(pet.ownerId);
      if (existing) {
        existing.push(pet);
      } else {
        grouped.set(pet.ownerId, [pet]);
      }
    }
    return grouped;
  }, [allPets]);

  const speciesCodeById = useMemo(() => {
    const map = new Map<number, string>();
    for (const species of speciesList) {
      map.set(species.id, species.code);
    }
    return map;
  }, [speciesList]);

  return {
    petsByOwnerId,
    speciesCodeById,
  };
}
