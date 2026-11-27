import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getOwnersQuery } from "#/client/caches/owners/queries/get-owners.query";
import { getOwnerDisplayName } from "#/client/features/owners/models/owners-table.model";
import {
	useFormField,
	useFormFieldError,
} from "#/client/shared/hooks/use-wizard-form";
import type { OwnerListItem } from "#/shared/schemas/owners.schema";
import { usePetFormContext } from "../contexts/pet-form.context";
import { mapOwnerListItemToSummary } from "../models/pet-form.model";

function useDebouncedValue(value: string, delayMs: number): string {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounced(value);
		}, delayMs);
		return () => clearTimeout(timer);
	}, [value, delayMs]);

	return debounced;
}

export function usePetOwnerSelection() {
	const {
		form,
		isOpen,
		setFieldValue,
		selectedOwnerSummary,
		setSelectedOwnerSummary,
		setIsNewOwnerModalOpen,
	} = usePetFormContext();

	const ownerId = useFormField(form, "ownerId");
	const ownerError = useFormFieldError(form, "ownerId");
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchQuery = useDebouncedValue(searchQuery.trim(), 300);

	const ownersQuery = useQuery({
		...getOwnersQuery({
			page: 1,
			limit: 20,
			search:
				debouncedSearchQuery.length > 0 ? debouncedSearchQuery : undefined,
			sort: "created_at:desc",
		}),
		enabled: isOpen && !selectedOwnerSummary,
	});

	const owners = ownersQuery.data?.data ?? [];

	const selectedOwner = useMemo(
		() => owners.find((owner) => owner.ownerId === ownerId) ?? null,
		[owners, ownerId],
	);

	useEffect(() => {
		if (!isOpen) {
			setSearchQuery("");
		}
	}, [isOpen]);

	const handleSelectOwner = useCallback(
		(owner: OwnerListItem | null) => {
			if (!owner) return;
			setFieldValue("ownerId", owner.ownerId);
			setSelectedOwnerSummary(mapOwnerListItemToSummary(owner));
			setSearchQuery("");
		},
		[setFieldValue, setSelectedOwnerSummary],
	);

	const handleClearOwner = useCallback(() => {
		setSelectedOwnerSummary(null);
		setFieldValue("ownerId", null);
		setSearchQuery("");
	}, [setFieldValue, setSelectedOwnerSummary]);

	const openNewOwnerModal = useCallback(() => {
		setIsNewOwnerModalOpen(true);
	}, [setIsNewOwnerModalOpen]);

	const getOwnerLabel = useCallback(
		(owner: OwnerListItem) => getOwnerDisplayName(owner),
		[],
	);

	const isOwnerEqualToValue = useCallback(
		(a: OwnerListItem, b: OwnerListItem) => a.ownerId === b.ownerId,
		[],
	);

	return {
		owners,
		isLoadingOwners: ownersQuery.isFetching,
		isOwnersError: ownersQuery.isError,
		searchQuery,
		setSearchQuery,
		selectedOwner,
		selectedOwnerSummary,
		ownerError,
		handleSelectOwner,
		handleClearOwner,
		openNewOwnerModal,
		getOwnerLabel,
		isOwnerEqualToValue,
	};
}
