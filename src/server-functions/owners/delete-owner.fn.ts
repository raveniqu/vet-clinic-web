import { createServerFn } from "@tanstack/react-start";
import { deleteOwnerUseCase } from "#/server/composition/owners.container";
import { deleteOwnerInputSchema } from "#/shared/schemas/owners.schema";
import { apiContextMiddleware } from "../middlewares/api-context.middleware";

export const deleteOwnerFn = createServerFn({ method: "POST" })
	.middleware([apiContextMiddleware])
	.validator(deleteOwnerInputSchema)
	.handler(async ({ data }): Promise<void> => {
		await deleteOwnerUseCase.execute({ ownerId: data.ownerId });
	});
