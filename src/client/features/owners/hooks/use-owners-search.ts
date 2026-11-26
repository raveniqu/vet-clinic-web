import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import type { OwnersRouteSearch } from "../models/owners-route-search.model";
import {
	ownersRouteSearchSchema,
	pickOwnersApiSearchParams,
} from "../models/owners-route-search.model";

export function useOwnersSearch() {
	const navigate = useNavigate();
	const rawSearch = useSearch({ strict: false });

	const routeSearch = useMemo<OwnersRouteSearch>(() => {
		const parsed = ownersRouteSearchSchema.safeParse(rawSearch);
		return parsed.success ? parsed.data : ownersRouteSearchSchema.parse({});
	}, [rawSearch]);

	const apiSearch = useMemo(
		() => pickOwnersApiSearchParams(routeSearch),
		[routeSearch],
	);

	const updateSearch = useCallback(
		(patch: Partial<OwnersRouteSearch>, options?: { replace?: boolean }) => {
			void navigate({
				to: "/owners",
				search: (prev) => {
					const currentParsed = ownersRouteSearchSchema.safeParse(prev);
					const current = currentParsed.success
						? currentParsed.data
						: ownersRouteSearchSchema.parse({});
					return {
						...current,
						...patch,
					};
				},
				replace: options?.replace ?? true,
			});
		},
		[navigate],
	);

	const resetFilters = useCallback(() => {
		updateSearch({
			search: undefined,
			ownerType: undefined,
			acquisitionChannel: undefined,
			createdFrom: undefined,
			createdTo: undefined,
			sort: "created_at:desc",
			page: 1,
		});
	}, [updateSearch]);

	return {
		routeSearch,
		apiSearch,
		updateSearch,
		resetFilters,
	};
}
