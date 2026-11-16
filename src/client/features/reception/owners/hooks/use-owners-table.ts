import { useDataTable } from "#/client/shared/hooks/use-data-table";
import { useOwnersDashboardContext } from "../contexts/owners-dashboard-provider";
import {
  useOwnerClipboard,
  useOwnerPetRelations,
  usePdpaPopoverControl,
} from "./use-owner-row-actions";

export function useOwnersTable(pageSize = 10) {
  const {
    allOwners,
    filteredOwners,
    hasActiveFilter,
    clearFilters,
    filterResetKey,
    visibleColumns,
    setEditingOwner,
  } = useOwnersDashboardContext();

  const {
    paginatedItems: paginatedOwners,
    pagination,
    pageSizeItems,
    onPageSizeChange,
    totalCount,
    isEmptyDataset,
    hasColumn,
    visibleColSpan,
  } = useDataTable({
    allItems: allOwners,
    filteredItems: filteredOwners,
    visibleColumns,
    hasActiveFilter,
    clearFilters,
    filterResetKey,
    initialPageSize: pageSize,
  });

  const { petsByOwnerId, speciesCodeById } = useOwnerPetRelations();
  const { copyPhone, isPhoneCopied, copyTaxId, isTaxIdCopied } = useOwnerClipboard();
  const { openPdpaPopoverOwnerId, onPdpaPopoverOpenChange, openEditConsent } =
    usePdpaPopoverControl(setEditingOwner);

  return {
    paginatedOwners,
    pagination,
    pageSizeItems,
    onPageSizeChange,
    totalCount,
    isEmptyDataset,
    hasActiveFilter,
    clearFilters,
    hasColumn,
    visibleColSpan,
    petsByOwnerId,
    speciesCodeById,
    copyPhone,
    isPhoneCopied,
    copyTaxId,
    isTaxIdCopied,
    openPdpaPopoverOwnerId,
    onPdpaPopoverOpenChange,
    openEditConsent,
    setEditingOwner,
  };
}
