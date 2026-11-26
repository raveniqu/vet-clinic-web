import { z } from "zod";
import type { OwnersSearchParams } from "#/shared/schemas/owners.schema";
import { ownersSearchParamsSchema } from "#/shared/schemas/owners.schema";

export const ownersRouteSearchSchema = ownersSearchParamsSchema.extend({
	openAddNewForm: z.boolean().optional(),
	editOwnerId: z.coerce.number<number | string>().int().positive().optional(),
});

export type OwnersRouteSearch = z.infer<typeof ownersRouteSearchSchema>;

export function pickOwnersApiSearchParams(
	routeSearch: OwnersRouteSearch,
): OwnersSearchParams {
	return {
		page: routeSearch.page,
		limit: routeSearch.limit,
		search: routeSearch.search,
		ownerType: routeSearch.ownerType,
		acquisitionChannel: routeSearch.acquisitionChannel,
		createdFrom: routeSearch.createdFrom,
		createdTo: routeSearch.createdTo,
		sort: routeSearch.sort,
	};
}
