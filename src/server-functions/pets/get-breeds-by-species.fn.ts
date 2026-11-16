import { getBreedsBySpeciesUseCase } from "#/server/composition/pets.container";
import { getBreedsBySpeciesSchema } from "#/shared/schemas/pet.schema";
import type { BreedItem } from "#/shared/schemas/pet.schema";
import { createServerFn } from "@tanstack/react-start";

export const getBreedsBySpeciesFn = createServerFn({ method: "GET" })
  .validator(getBreedsBySpeciesSchema)
  .handler(async ({ data }): Promise<BreedItem[]> => {
    return getBreedsBySpeciesUseCase.execute(data.speciesId);
  });
