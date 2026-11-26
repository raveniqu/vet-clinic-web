import { queryOptions } from "@tanstack/react-query";
import { getOwnerByIdFn } from "#/server-functions/owners/get-owner-by-id.fn";
import { ownersKeys } from "../keys";

export function getOwnerByIdQuery(ownerId: number) {
	return queryOptions({
		queryKey: ownersKeys.detail(ownerId),
		queryFn: () => getOwnerByIdFn({ data: { ownerId } }),
	});
}
