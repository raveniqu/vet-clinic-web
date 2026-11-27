import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getOwnersQuery } from "#/client/caches/owners/queries/get-owners.query";
import { useOwnersSearch } from "./use-owners-search";

export function useOwnersList() {
	const { apiSearch } = useOwnersSearch();

	const query = useQuery({
		...getOwnersQuery(apiSearch),
		placeholderData: keepPreviousData,
	});

	const owners = query.data?.data ?? [];
	const totalItems = query.data?.totalItems ?? 0;
	const totalPages = query.data?.totalPages ?? 0;
	const hasNext = query.data?.hasNext ?? false;
	const hasPrev = query.data?.hasPrev ?? false;

	const activeFilterCount = useMemo(() => {
		let count = 0;
		if (apiSearch.search && apiSearch.search.trim().length > 0) count += 1;
		if (apiSearch.ownerType) count += 1;
		if (apiSearch.acquisitionChannel) count += 1;
		if (apiSearch.createdFrom || apiSearch.createdTo) count += 1;
		return count;
	}, [
		apiSearch.search,
		apiSearch.ownerType,
		apiSearch.acquisitionChannel,
		apiSearch.createdFrom,
		apiSearch.createdTo,
	]);

	const hasActiveFilter = activeFilterCount > 0;

	return {
		owners,
		totalItems,
		totalPages,
		hasNext,
		hasPrev,
		isPending: query.isPending,
		isPlaceholderData: query.isPlaceholderData,
		isError: query.isError,
		refetch: query.refetch,
		activeFilterCount,
		hasActiveFilter,
		isEmptyDataset: !query.isPending && totalItems === 0 && !hasActiveFilter,
	};
}
