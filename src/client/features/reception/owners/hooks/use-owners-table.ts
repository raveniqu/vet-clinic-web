import type { ColumnVisibilityState, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { functionalUpdate, useTable } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  createAppColumnHelper,
  dataTableFeatures,
} from "#/client/shared/components/app-data-table";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { useOwnersContext } from "../contexts/owners.context";
import {
  getOwnerColumnVisibilityState,
  getOwnerDisplayName,
  OWNER_COLUMN_LABEL_MAP,
} from "../models/owners-table";
import { useOwnerClipboard } from "./use-owner-clipboard";
import { useOwnerPetRelations } from "./use-owner-pet-relations";
import { useOwnersList } from "./use-owners-list";
import { useOwnersSearch } from "./use-owners-search";

const ownerColumnHelper = createAppColumnHelper<OwnerDto>();

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
  ownerColumnHelper.display({
    id: "pdpaConsent",
    header: OWNER_COLUMN_LABEL_MAP.pdpaConsent,
    enableSorting: false,
    meta: {
      headClassName: "min-w-36",
    },
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
  ownerColumnHelper.display({
    id: "preferredSchedule",
    header: OWNER_COLUMN_LABEL_MAP.preferredSchedule,
    enableSorting: false,
    meta: {
      headClassName: "min-w-36",
    },
  }),
  ownerColumnHelper.accessor("referralSource", {
    id: "referralSource",
    header: OWNER_COLUMN_LABEL_MAP.referralSource,
    enableSorting: false,
    meta: {
      headClassName: "min-w-36",
    },
  }),
  ownerColumnHelper.accessor("createdAt", {
    id: "createdAt",
    header: OWNER_COLUMN_LABEL_MAP.createdAt,
    enableSorting: false,
  }),
  ownerColumnHelper.display({
    id: "actions",
    header: "การดำเนินการ",
    enableSorting: false,
    enableHiding: false,
    meta: {
      headerSrOnly: true,
      headClassName: "sticky right-0 z-10 w-0 p-0 pointer-coarse:w-auto pointer-coarse:px-3",
      cellClassName:
        "sticky right-0 z-10 w-0 p-0 text-right align-middle pointer-coarse:w-auto pointer-coarse:px-3",
    },
  }),
]);

export function useOwnersTable() {
  const { search, updateSearch } = useOwnersSearch();
  const { filteredOwners, isPending } = useOwnersList();
  const { visibleColumns, openEditDialog } = useOwnersContext();
  const { petsByOwnerId, speciesCodeById } = useOwnerPetRelations();
  const { copyPhone, isPhoneCopied, copyTaxId, isTaxIdCopied } = useOwnerClipboard();

  const pagination: PaginationState = useMemo(() => {
    const maxPageIndex = Math.max(0, Math.ceil(filteredOwners.length / search.pageSize) - 1);
    return {
      pageIndex: Math.min(Math.max(0, search.page - 1), maxPageIndex),
      pageSize: search.pageSize,
    };
  }, [filteredOwners.length, search.page, search.pageSize]);

  const columnVisibility: ColumnVisibilityState = useMemo(
    () => getOwnerColumnVisibilityState(visibleColumns),
    [visibleColumns]
  );

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = functionalUpdate(updater, pagination);
    const isPageSizeChanged = next.pageSize !== pagination.pageSize;

    updateSearch({
      page: isPageSizeChanged ? 1 : next.pageIndex + 1,
      pageSize: next.pageSize,
    });
  };

  const table = useTable({
    features: dataTableFeatures,
    columns: ownerTableColumns,
    data: filteredOwners,
    autoResetPageIndex: false,
    state: {
      pagination,
      columnVisibility,
    },
    onPaginationChange,
    getRowId: (row) => row.id,
  });

  return {
    table,
    isPending,
    petsByOwnerId,
    speciesCodeById,
    copyPhone,
    isPhoneCopied,
    copyTaxId,
    isTaxIdCopied,
    openEditDialog,
  };
}
