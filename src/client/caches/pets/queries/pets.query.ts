import { queryOptions } from "@tanstack/react-query";
import { petKeys } from "#/client/caches/pets/keys";
import { getBreedsBySpeciesFn } from "#/server-functions/pets/get-breeds-by-species.fn";
import { getPetByIdFn } from "#/server-functions/pets/get-pet-by-id.fn";
import { getPetsByOwnerFn } from "#/server-functions/pets/get-pets-by-owner.fn";
import { getPetsFn } from "#/server-functions/pets/get-pets.fn";
import { getSpeciesFn } from "#/server-functions/pets/get-species.fn";
import type { BreedItem, PetDto, SpeciesItem } from "#/shared/schemas/pet.schema";

export function petsListQueryOptions() {
  return queryOptions<PetDto[]>({
    queryKey: petKeys.lists(),
    queryFn: async () => {
      return getPetsFn();
    },
  });
}

export function petDetailQueryOptions(id: number) {
  return queryOptions<PetDto | null>({
    queryKey: petKeys.detail(id),
    queryFn: async () => {
      return getPetByIdFn({ data: { id } });
    },
    enabled: Boolean(id),
  });
}

export function petsByOwnerQueryOptions(ownerId?: number) {
  return queryOptions<PetDto[]>({
    queryKey: petKeys.list({ ownerId }),
    queryFn: async () => {
      if (!ownerId) return [];
      return getPetsByOwnerFn({ data: { ownerId } });
    },
    enabled: Boolean(ownerId),
  });
}

export function speciesQueryOptions() {
  return queryOptions<SpeciesItem[]>({
    queryKey: petKeys.speciesList(),
    queryFn: async () => {
      return getSpeciesFn();
    },
    staleTime: Infinity,
  });
}

export function breedsBySpeciesQueryOptions(speciesId?: number) {
  return queryOptions<BreedItem[]>({
    queryKey: petKeys.breeds(speciesId),
    queryFn: async () => {
      if (!speciesId) return [];
      return getBreedsBySpeciesFn({ data: { speciesId } });
    },
    enabled: Boolean(speciesId),
    staleTime: Infinity,
  });
}
