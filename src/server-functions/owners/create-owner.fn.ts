import { createOwnerUseCase } from "#/server/composition/owners.container";
import { createOwnerInputSchema } from "#/shared/schemas/owner.schema";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { createServerFn } from "@tanstack/react-start";

export const createOwnerFn = createServerFn({ method: "POST" })
  .validator(createOwnerInputSchema)
  .handler(async ({ data }): Promise<OwnerDto> => {
    return createOwnerUseCase.execute(data);
  });
