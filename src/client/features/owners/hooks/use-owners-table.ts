import type {
	ColumnVisibilityState,
	OnChangeFn,
	PaginationState,
} from "@tanstack/react-table";
import { functionalUpdate, useTable } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import {
	createAppColumnHelper,
	dataTableFeatures,
} from "#/client/shared/components/app-data-table";
import {
	formatPhoneNumber,
	formatRegisteredDate,
	formatTaxId,
} from "#/client/shared/helpers/formatters";
import type { OwnerListItem } from "#/shared/schemas/owners.schema";
import { useOwnersDashboardContext } from "../contexts/owners-dashboard.context";
import {
	formatAcquisitionChannelLabel,
	formatAddressArea,
	formatFullAddress,
	getOwnerColumnVisibilityState,
	getOwnerDisplayName,
	getOwnerInitials,
	getOwnerTaxIdCopyHint,
	hasNonEmptyText,
	OWNER_COLUMN_LABEL_MAP,
} from "../models/owners-table.model";
import { useOwnerClipboard } from "./use-owner-clipboard";
import { useOwnersList } from "./use-owners-list";
import { useOwnersSearch } from "./use-owners-search";

export interface OwnerTableRowPresentation {
	readonly displayName: string;
	readonly initials: string;
	readonly isJuristic: boolean;
	readonly formattedPhone: string;
	readonly formattedTaxId: string;
	readonly canCopyFullTaxId: boolean;
	readonly hasAdditionalContact: boolean;
	readonly addressAreaLabel: string;
	readonly fullAddressLabel: string;
	readonly acquisitionChannelLabel: string;
	readonly createdAtLabel: string;
}

const ownerColumnHelper = createAppColumnHelper<OwnerListItem>();

const ownerTableColumns = ownerColumnHelper.columns([
	ownerColumnHelper.accessor((row) => getOwnerDisplayName(row), {
		id: "owner",
		header: OWNER_COLUMN_LABEL_MAP.owner,
		enableSorting: false,
		enableHiding: false,
		meta: {
			headClassName: "min-w-52",
		},
	}),
	ownerColumnHelper.display({
		id: "contact",
		header: OWNER_COLUMN_LABEL_MAP.contact,
		enableSorting: false,
		meta: {
			headClassName: "min-w-44",
		},
	}),
	ownerColumnHelper.display({
		id: "pets",
		header: OWNER_COLUMN_LABEL_MAP.pets,
		enableSorting: false,
	}),
	ownerColumnHelper.accessor("createdAt", {
		id: "createdAt",
		header: OWNER_COLUMN_LABEL_MAP.createdAt,
		enableSorting: false,
	}),
	ownerColumnHelper.accessor("taxId", {
		id: "taxId",
		header: OWNER_COLUMN_LABEL_MAP.taxId,
		enableSorting: false,
		meta: {
			headClassName: "min-w-44",
		},
	}),
	ownerColumnHelper.display({
		id: "additionalContacts",
		header: OWNER_COLUMN_LABEL_MAP.additionalContacts,
		enableSorting: false,
		meta: {
			headClassName: "min-w-48",
		},
	}),
	ownerColumnHelper.display({
		id: "address",
		header: OWNER_COLUMN_LABEL_MAP.address,
		enableSorting: false,
		meta: {
			headClassName: "min-w-44",
		},
	}),
	ownerColumnHelper.accessor("acquisitionChannel", {
		id: "acquisitionChannel",
		header: OWNER_COLUMN_LABEL_MAP.acquisitionChannel,
		enableSorting: false,
		meta: {
			headClassName: "min-w-40",
		},
	}),
	ownerColumnHelper.display({
		id: "pdpaConsent",
		header: OWNER_COLUMN_LABEL_MAP.pdpaConsent,
		enableSorting: false,
		meta: {
			headClassName: "min-w-36",
		},
	}),
	ownerColumnHelper.display({
		id: "actions",
		header: "การดำเนินการ",
		enableSorting: false,
		enableHiding: false,
		meta: {
			headerSrOnly: true,
			headClassName:
				"sticky right-0 z-10 w-0 p-0 pointer-coarse:w-auto pointer-coarse:px-3",
			cellClassName:
				"sticky right-0 z-10 w-0 p-0 text-right align-middle pointer-coarse:w-auto pointer-coarse:px-3",
		},
	}),
]);

export function useOwnersTable() {
	const { apiSearch, updateSearch } = useOwnersSearch();
	const { owners, totalItems, totalPages, isPending, isPlaceholderData } =
		useOwnersList();
	const { visibleColumns } = useOwnersDashboardContext();
	const { copyPhone, isPhoneCopied, copyTaxId, isTaxIdCopied } =
		useOwnerClipboard();

	const pagination = useMemo<PaginationState>(
		() => ({
			pageIndex: Math.max(0, apiSearch.page - 1),
			pageSize: apiSearch.limit,
		}),
		[apiSearch.page, apiSearch.limit],
	);

	const columnVisibility = useMemo<ColumnVisibilityState>(
		() => getOwnerColumnVisibilityState(visibleColumns),
		[visibleColumns],
	);

	const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
		(updater) => {
			const next = functionalUpdate(updater, pagination);
			const isPageSizeChanged = next.pageSize !== pagination.pageSize;

			updateSearch({
				page: isPageSizeChanged ? 1 : next.pageIndex + 1,
				limit: next.pageSize,
			});
		},
		[pagination, updateSearch],
	);

	const table = useTable({
		features: dataTableFeatures,
		columns: ownerTableColumns,
		data: owners,
		manualPagination: true,
		rowCount: totalItems,
		pageCount: Math.max(1, totalPages),
		autoResetPageIndex: false,
		state: {
			pagination,
			columnVisibility,
		},
		onPaginationChange,
		getRowId: (row) => String(row.ownerId),
	});

	const rowPresentationById = useMemo(() => {
		const map = new Map<number, OwnerTableRowPresentation>();
		for (const owner of owners) {
			map.set(owner.ownerId, {
				displayName: getOwnerDisplayName(owner),
				initials: getOwnerInitials(owner),
				isJuristic: owner.ownerType === "JURISTIC",
				formattedPhone: formatPhoneNumber(owner.phoneNumber),
				formattedTaxId: formatTaxId(owner.taxId),
				canCopyFullTaxId: getOwnerTaxIdCopyHint(owner),
				hasAdditionalContact:
					hasNonEmptyText(owner.lineId) || hasNonEmptyText(owner.email),
				addressAreaLabel: formatAddressArea(owner.defaultAddress),
				fullAddressLabel: formatFullAddress(owner.defaultAddress),
				acquisitionChannelLabel: formatAcquisitionChannelLabel(
					owner.acquisitionChannel,
				),
				createdAtLabel: formatRegisteredDate(owner.createdAt),
			});
		}
		return map;
	}, [owners]);

	const getRowPresentation = useCallback(
		(owner: OwnerListItem): OwnerTableRowPresentation =>
			rowPresentationById.get(owner.ownerId) ?? {
				displayName: getOwnerDisplayName(owner),
				initials: getOwnerInitials(owner),
				isJuristic: owner.ownerType === "JURISTIC",
				formattedPhone: formatPhoneNumber(owner.phoneNumber),
				formattedTaxId: formatTaxId(owner.taxId),
				canCopyFullTaxId: getOwnerTaxIdCopyHint(owner),
				hasAdditionalContact:
					hasNonEmptyText(owner.lineId) || hasNonEmptyText(owner.email),
				addressAreaLabel: formatAddressArea(owner.defaultAddress),
				fullAddressLabel: formatFullAddress(owner.defaultAddress),
				acquisitionChannelLabel: formatAcquisitionChannelLabel(
					owner.acquisitionChannel,
				),
				createdAtLabel: formatRegisteredDate(owner.createdAt),
			},
		[rowPresentationById],
	);

	return {
		table,
		isPending,
		isFetchingPlaceholder: isPlaceholderData,
		getRowPresentation,
		copyPhone,
		isPhoneCopied,
		copyTaxId,
		isTaxIdCopied,
	};
}
