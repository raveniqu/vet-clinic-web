import { getSpeciesUseCase } from "#/server/composition/pets.container";
import type { SpeciesItem } from "#/shared/schemas/pet.schema";
import { createServerFn } from "@tanstack/react-start";

export const getSpeciesFn = createServerFn({
  method: "GET",
}).handler(async (): Promise<SpeciesItem[]> => {
  return getSpeciesUseCase.execute();
});
