import { getOwnersUseCase } from "#/server/composition/owners.container";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { createServerFn } from "@tanstack/react-start";

export const getOwnersFn = createServerFn({
  method: "GET",
}).handler(async (): Promise<OwnerDto[]> => {
  return getOwnersUseCase.execute();
});
