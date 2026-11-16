import { getPetsByOwnerUseCase } from "#/server/composition/pets.container";
import { getPetsByOwnerSchema } from "#/shared/schemas/pet.schema";
import type { PetDto } from "#/shared/schemas/pet.schema";
import { createServerFn } from "@tanstack/react-start";

export const getPetsByOwnerFn = createServerFn({ method: "GET" })
  .validator(getPetsByOwnerSchema)
  .handler(async ({ data }): Promise<PetDto[]> => {
    return getPetsByOwnerUseCase.execute(data.ownerId);
  });
