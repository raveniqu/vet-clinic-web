import { createServerFn } from "@tanstack/react-start";
import { registerOwnerUseCase } from "#/server/composition/owners.container";
import type { OwnerDetailsResponse } from "#/shared/schemas/owners.schema";
import { registerOwnerInputSchema } from "#/shared/schemas/owners.schema";
import { apiContextMiddleware } from "../middlewares/api-context.middleware";

export const registerOwnerFn = createServerFn({ method: "POST" })
	.middleware([apiContextMiddleware])
	.validator(registerOwnerInputSchema)
	.handler(async ({ data }): Promise<OwnerDetailsResponse> => {
		return registerOwnerUseCase.execute({ payload: data });
	});
