import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOwnersSearch } from "./use-owners-search";

/**
 * Reconciles URL `search` param updates against locally dispatched debounced searches
 * so in-flight URL commits do not clobber newer keystrokes while external resets still sync.
 */
export function reconcileSearchInputSync(
	dispatchedQueue: string[],
	incomingQuerySearch: string,
): { shouldSyncInput: boolean; nextInput: string } {
	const matchIndex = dispatchedQueue.indexOf(incomingQuerySearch);
	if (matchIndex !== -1) {
		dispatchedQueue.splice(0, matchIndex + 1);
		return {
			shouldSyncInput: false,
			nextInput: incomingQuerySearch,
		};
	}

	dispatchedQueue.length = 0;
	return {
		shouldSyncInput: true,
		nextInput: incomingQuerySearch,
	};
}

export function useOwnersSearchInput() {
	const { apiSearch, updateSearch } = useOwnersSearch();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const currentQuerySearch = apiSearch.search ?? "";
	const [searchInput, setSearchInput] = useState(currentQuerySearch);
	const lastQuerySearchRef = useRef(currentQuerySearch);
	const dispatchedQueueRef = useRef<string[]>([]);

	useEffect(() => {
		if (lastQuerySearchRef.current === currentQuerySearch) {
			return;
		}
		lastQuerySearchRef.current = currentQuerySearch;

		const reconciliation = reconcileSearchInputSync(
			dispatchedQueueRef.current,
			currentQuerySearch,
		);
		if (reconciliation.shouldSyncInput) {
			setSearchInput(reconciliation.nextInput);
		}
	}, [currentQuerySearch]);

	useEffect(() => {
		const trimmed = searchInput.trim();
		if (trimmed === currentQuerySearch) {
			return;
		}
		if (dispatchedQueueRef.current.at(-1) === trimmed) {
			return;
		}

		const timer = setTimeout(() => {
			dispatchedQueueRef.current.push(trimmed);
			updateSearch({
				search: trimmed.length > 0 ? trimmed : undefined,
				page: 1,
			});
		}, 300);

		return () => clearTimeout(timer);
	}, [searchInput, currentQuerySearch, updateSearch]);

	const handleSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearchInput(event.target.value);
		},
		[],
	);

	const clearSearch = useCallback(() => {
		setSearchInput("");
		if (currentQuerySearch !== "") {
			dispatchedQueueRef.current.push("");
			updateSearch({ search: undefined, page: 1 });
		}
		inputRef.current?.focus();
	}, [currentQuerySearch, updateSearch]);

	return {
		inputRef,
		searchInput,
		hasSearchTerm: searchInput.length > 0,
		handleSearchChange,
		clearSearch,
	};
}
