import { useCallback, useMemo } from "react";
import {
	formatPhoneNumber,
	formatTaxId,
} from "#/client/shared/helpers/formatters";
import type { OwnerListItem } from "#/shared/schemas/owners.schema";
import { useOwnerDeleteContext } from "../contexts/owner-delete.context";
import { useOwnerFormContext } from "../contexts/owner-form.context";
import {
	formatAcquisitionChannelLabel,
	formatFullAddress,
	getOwnerDisplayName,
	getOwnerInitials,
} from "../models/owners-table.model";
import { useOwnerClipboard } from "./use-owner-clipboard";
import { useOwnersList } from "./use-owners-list";
import { useOwnersSearch } from "./use-owners-search";

export interface OwnerMobileCardItem {
	readonly raw: OwnerListItem;
	readonly ownerId: number;
	readonly ownerCode: string;
	readonly displayName: string;
	readonly initials: string;
	readonly isJuristic: boolean;
	readonly formattedTaxId: string;
	readonly formattedPhone: string;
	readonly acquisitionChannelLabel: string;
	readonly fullAddressLabel: string;
}

export function useOwnersMobile() {
	const { apiSearch, updateSearch, resetFilters } = useOwnersSearch();
	const {
		owners,
		totalItems,
		totalPages,
		hasNext,
		hasPrev,
		isPending,
		isPlaceholderData,
		hasActiveFilter,
		isEmptyDataset,
	} = useOwnersList();
	const { openEdit } = useOwnerFormContext();
	const { requestDelete } = useOwnerDeleteContext();
	const { copyPhone, isPhoneCopied } = useOwnerClipboard();

	const cards = useMemo<OwnerMobileCardItem[]>(
		() =>
			owners.map((owner) => ({
				raw: owner,
				ownerId: owner.ownerId,
				ownerCode: owner.ownerCode,
				displayName: getOwnerDisplayName(owner),
				initials: getOwnerInitials(owner),
				isJuristic: owner.ownerType === "JURISTIC",
				formattedTaxId: formatTaxId(owner.taxId),
				formattedPhone: formatPhoneNumber(owner.phoneNumber),
				acquisitionChannelLabel: formatAcquisitionChannelLabel(
					owner.acquisitionChannel,
				),
				fullAddressLabel: formatFullAddress(owner.defaultAddress),
			})),
		[owners],
	);

	const goToPage = useCallback(
		(page: number) => {
			updateSearch({ page: Math.max(1, page) });
		},
		[updateSearch],
	);

	const goToPreviousPage = useCallback(() => {
		if (hasPrev) {
			goToPage(apiSearch.page - 1);
		}
	}, [apiSearch.page, goToPage, hasPrev]);

	const goToNextPage = useCallback(() => {
		if (hasNext) {
			goToPage(apiSearch.page + 1);
		}
	}, [apiSearch.page, goToPage, hasNext]);

	const requestDeleteOwner = useCallback(
		(card: OwnerMobileCardItem) => {
			requestDelete({
				ownerId: card.ownerId,
				displayName: card.displayName,
				ownerCode: card.ownerCode,
			});
		},
		[requestDelete],
	);

	return {
		cards,
		currentPage: apiSearch.page,
		totalPages: Math.max(1, totalPages),
		totalItems,
		canGoPrevious: hasPrev,
		canGoNext: hasNext,
		goToPage,
		goToPreviousPage,
		goToNextPage,
		isPending,
		isPlaceholderData,
		isEmptyDataset,
		hasActiveFilter,
		clearFilters: resetFilters,
		copyPhone,
		isPhoneCopied,
		openEditOwner: openEdit,
		requestDeleteOwner,
	};
}
