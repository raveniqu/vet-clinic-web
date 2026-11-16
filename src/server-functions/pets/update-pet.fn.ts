import { updatePetUseCase } from "#/server/composition/pets.container";
import { updatePetInputSchema } from "#/shared/schemas/pet.schema";
import type { PetDto } from "#/shared/schemas/pet.schema";
import { createServerFn } from "@tanstack/react-start";

export const updatePetFn = createServerFn({ method: "POST" })
  .validator(updatePetInputSchema)
  .handler(async ({ data }): Promise<PetDto> => {
    return updatePetUseCase.execute(data);
  });
