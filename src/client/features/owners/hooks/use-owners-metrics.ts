import { useQuery } from "@tanstack/react-query";
import { ownersListQuery } from "#/client/caches/owners/queries/get-owners.query";

export function useOwnersMetrics() {
	// Query lightweight count (limit: 1, unfiltered) so total count remains accurate even when searching table.
	const summaryQuery = useQuery({
		...ownersListQuery({
			page: 1,
			limit: 1,
			sort: "created_at:desc",
		}),
		staleTime: 60_000,
	});

	return {
		totalOwnersCount: summaryQuery.data?.totalItems ?? null,
		isPending: summaryQuery.isPending,
	};
}
