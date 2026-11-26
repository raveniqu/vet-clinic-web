import { createServerFn } from "@tanstack/react-start";
import { updateOwnerUseCase } from "#/server/composition/owners.container";
import { updateOwnerInputSchema } from "#/shared/schemas/owners.schema";
import { apiContextMiddleware } from "../middlewares/api-context.middleware";

export const updateOwnerFn = createServerFn({ method: "POST" })
	.middleware([apiContextMiddleware])
	.validator(updateOwnerInputSchema)
	.handler(async ({ data }): Promise<void> => {
		await updateOwnerUseCase.execute({ payload: data });
	});
