import { createPetUseCase } from "#/server/composition/pets.container";
import { createPetInputSchema } from "#/shared/schemas/pet.schema";
import type { PetDto } from "#/shared/schemas/pet.schema";
import { createServerFn } from "@tanstack/react-start";

export const createPetFn = createServerFn({ method: "POST" })
  .validator(createPetInputSchema)
  .handler(async ({ data }): Promise<PetDto> => {
    return createPetUseCase.execute(data);
  });
