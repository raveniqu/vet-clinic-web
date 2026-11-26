import { queryOptions } from "@tanstack/react-query";
import { listOwnersFn } from "#/server-functions/owners/list-owners.fn";
import type { OwnersSearchParams } from "#/shared/schemas/owners.schema";
import { ownersKeys } from "../keys";

export function ownersListQuery(params: OwnersSearchParams) {
	return queryOptions({
		queryKey: ownersKeys.list(params),
		queryFn: () => listOwnersFn({ data: params }),
	});
}
