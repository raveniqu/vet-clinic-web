import { getPetsUseCase } from "#/server/composition/pets.container";
import type { PetDto } from "#/shared/schemas/pet.schema";
import { createServerFn } from "@tanstack/react-start";

export const getPetsFn = createServerFn({
  method: "GET",
}).handler(async (): Promise<PetDto[]> => {
  return getPetsUseCase.execute();
});
