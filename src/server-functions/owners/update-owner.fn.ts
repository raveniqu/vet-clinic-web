import { updateOwnerUseCase } from "#/server/composition/owners.container";
import { updateOwnerInputSchema } from "#/shared/schemas/owner.schema";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { createServerFn } from "@tanstack/react-start";

export const updateOwnerFn = createServerFn({ method: "POST" })
  .validator(updateOwnerInputSchema)
  .handler(async ({ data }): Promise<OwnerDto> => {
    return updateOwnerUseCase.execute(data);
  });
