import { createServerFn } from "@tanstack/react-start";
import { listOwnersUseCase } from "#/server/composition/owners.container";
import type { OwnerListResponse } from "#/shared/schemas/owners.schema";
import { ownersSearchParamsSchema } from "#/shared/schemas/owners.schema";
import { apiContextMiddleware } from "../middlewares/api-context.middleware";

export const listOwnersFn = createServerFn({ method: "GET" })
	.middleware([apiContextMiddleware])
	.validator(ownersSearchParamsSchema)
	.handler(async ({ data }): Promise<OwnerListResponse> => {
		return listOwnersUseCase.execute({ payload: data });
	});
