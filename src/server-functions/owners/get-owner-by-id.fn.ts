import { createServerFn } from "@tanstack/react-start";
import { getOwnerByIdUseCase } from "#/server/composition/owners.container";
import type { OwnerDetailsResponse } from "#/shared/schemas/owners.schema";
import { getOwnerByIdInputSchema } from "#/shared/schemas/owners.schema";
import { apiContextMiddleware } from "../middlewares/api-context.middleware";

export const getOwnerByIdFn = createServerFn({ method: "GET" })
	.middleware([apiContextMiddleware])
	.validator(getOwnerByIdInputSchema)
	.handler(async ({ data }): Promise<OwnerDetailsResponse> => {
		return getOwnerByIdUseCase.execute({ ownerId: data.ownerId });
	});
