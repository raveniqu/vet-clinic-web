import { useCallback, useMemo } from "react";
import type {
	AcquisitionChannelDto,
	OwnerTypeDto,
} from "#/shared/schemas/owners.schema";
import {
	acquisitionChannelSchema,
	ownerTypeSchema,
} from "#/shared/schemas/owners.schema";
import type { SortOrder } from "#/shared/schemas/pagination.schema";
import { sortOrderSchema } from "#/shared/schemas/pagination.schema";
import { ACQUISITION_CHANNEL_SELECT_ITEMS } from "../models/owner-form.model";
import { useOwnersList } from "./use-owners-list";
import { useOwnersSearch } from "./use-owners-search";

export type OwnerTypeFilterOption = {
	readonly value: OwnerTypeDto;
	readonly label: string;
};

export const OWNER_TYPE_FILTER_OPTIONS: readonly OwnerTypeFilterOption[] = [
	{ value: "INDIVIDUAL", label: "บุคคลธรรมดา" },
	{ value: "JURISTIC", label: "นิติบุคคล" },
] as const;

export const OWNER_SORT_OPTIONS: readonly {
	value: SortOrder;
	label: string;
}[] = [
	{ value: "created_at:desc", label: "ล่าสุดก่อน" },
	{ value: "created_at:asc", label: "เก่าสุดก่อน" },
] as const;

export const ACQUISITION_CHANNEL_FILTER_ITEMS: readonly {
	value: AcquisitionChannelDto | "ALL";
	label: string;
}[] = [
	{ value: "ALL", label: "ทุกช่องทางที่รู้จัก" },
	...ACQUISITION_CHANNEL_SELECT_ITEMS,
];

export function useOwnersQuickFilters() {
	const { apiSearch, updateSearch, resetFilters } = useOwnersSearch();
	const { totalItems, activeFilterCount, hasActiveFilter } = useOwnersList();

	const selectedOwnerTypeValues = useMemo<string[]>(
		() => (apiSearch.ownerType ? [apiSearch.ownerType] : []),
		[apiSearch.ownerType],
	);

	const selectedAcquisitionChannel = apiSearch.acquisitionChannel ?? "ALL";
	const selectedSort = apiSearch.sort;

	const handleOwnerTypeToggleChange = useCallback(
		(values: string[]) => {
			const nextRaw = values[0];
			const parsed = ownerTypeSchema.safeParse(nextRaw);
			updateSearch({
				ownerType: parsed.success ? parsed.data : undefined,
				page: 1,
			});
		},
		[updateSearch],
	);

	const handleAcquisitionChannelChange = useCallback(
		(value: string | null) => {
			if (!value || value === "ALL") {
				updateSearch({ acquisitionChannel: undefined, page: 1 });
				return;
			}
			const parsed = acquisitionChannelSchema.safeParse(value);
			if (parsed.success) {
				updateSearch({ acquisitionChannel: parsed.data, page: 1 });
			}
		},
		[updateSearch],
	);

	const handleSortChange = useCallback(
		(value: string | null) => {
			const parsed = sortOrderSchema.safeParse(value);
			if (parsed.success) {
				updateSearch({ sort: parsed.data, page: 1 });
			}
		},
		[updateSearch],
	);

	return {
		selectedOwnerTypeValues,
		selectedAcquisitionChannel,
		selectedSort,
		activeFilterCount,
		hasActiveFilter,
		totalItems,
		handleOwnerTypeToggleChange,
		handleAcquisitionChannelChange,
		handleSortChange,
		clearAllFilters: resetFilters,
	};
}
