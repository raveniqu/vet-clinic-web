import { useCallback, useMemo } from "react";

export interface QuickFilterDefinition<TKey extends string, TItem> {
	key: TKey;
	label: string;
	predicate: (item: TItem) => boolean;
}

export interface QuickFilterOption<TKey extends string> {
	key: TKey;
	label: string;
	count: number;
	isActive: boolean;
}

export interface UseQuickFiltersOptions<TKey extends string, TItem> {
	allItems: readonly TItem[];
	filteredItems: readonly TItem[];
	definitions: readonly QuickFilterDefinition<TKey, TItem>[];
	quickFilters: TKey[];
	setQuickFilters: (filters: TKey[]) => void;
	activeFilterCount: number;
	hasActiveFilter: boolean;
	clearFilters: () => void;
}

export interface QuickFiltersReturn<TKey extends string> {
	quickFilters: TKey[];
	filterOptions: QuickFilterOption<TKey>[];
	activeFilterCount: number;
	hasActiveFilter: boolean;
	filteredCount: number;
	totalCount: number;
	onQuickFiltersChange: (values: string[]) => void;
	clearAllFilters: () => void;
}

export function useQuickFilters<TKey extends string, TItem>({
	allItems,
	filteredItems,
	definitions,
	quickFilters,
	setQuickFilters,
	activeFilterCount,
	hasActiveFilter,
	clearFilters,
}: UseQuickFiltersOptions<TKey, TItem>): QuickFiltersReturn<TKey> {
	const validFilterKeySet = useMemo(
		() => new Set<string>(definitions.map((item) => item.key)),
		[definitions],
	);

	const filterCounts = useMemo(() => {
		const counts = new Array<number>(definitions.length).fill(0);
		for (const item of allItems) {
			for (let i = 0; i < definitions.length; i++) {
				if (definitions[i].predicate(item)) {
					counts[i] += 1;
				}
			}
		}
		return definitions.map((definition, index) => ({
			key: definition.key,
			label: definition.label,
			count: counts[index] ?? 0,
		}));
	}, [allItems, definitions]);

	const filterOptions = useMemo(() => {
		const activeSet = new Set<TKey>(quickFilters);
		return filterCounts.map((item) => ({
			...item,
			isActive: activeSet.has(item.key),
		}));
	}, [filterCounts, quickFilters]);

	const handleQuickFiltersChange = useCallback(
		(values: string[]) => {
			const next = values.filter((value): value is TKey =>
				validFilterKeySet.has(value),
			);
			setQuickFilters(next);
		},
		[setQuickFilters, validFilterKeySet],
	);

	return {
		quickFilters,
		filterOptions,
		activeFilterCount,
		hasActiveFilter,
		filteredCount: filteredItems.length,
		totalCount: allItems.length,
		onQuickFiltersChange: handleQuickFiltersChange,
		clearAllFilters: clearFilters,
	};
}
