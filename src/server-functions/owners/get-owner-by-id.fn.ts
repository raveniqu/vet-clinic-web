import { getOwnerByIdUseCase } from "#/server/composition/owners.container";
import { getOwnerByIdSchema } from "#/shared/schemas/owner.schema";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { createServerFn } from "@tanstack/react-start";

export const getOwnerByIdFn = createServerFn({ method: "GET" })
  .validator(getOwnerByIdSchema)
  .handler(async ({ data }): Promise<OwnerDto | null> => {
    return getOwnerByIdUseCase.execute(data.id);
  });
