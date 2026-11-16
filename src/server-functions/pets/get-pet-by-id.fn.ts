import { getPetByIdUseCase } from "#/server/composition/pets.container";
import { getPetByIdSchema } from "#/shared/schemas/pet.schema";
import type { PetDto } from "#/shared/schemas/pet.schema";
import { createServerFn } from "@tanstack/react-start";

export const getPetByIdFn = createServerFn({ method: "GET" })
  .validator(getPetByIdSchema)
  .handler(async ({ data }): Promise<PetDto | null> => {
    return getPetByIdUseCase.execute(data.id);
  });
