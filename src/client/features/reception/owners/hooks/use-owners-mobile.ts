import { useBatchSlice } from "#/client/shared/hooks/use-batch-slice";
import { useOwnersDashboardContext } from "../contexts/owners-dashboard-provider";
import { OWNER_MOBILE_BATCH_SIZE } from "../models/owners-table";
import {
  useOwnerClipboard,
  useOwnerPetRelations,
  usePdpaPopoverControl,
} from "./use-owner-row-actions";

export function useOwnersMobile(
  initialCount = OWNER_MOBILE_BATCH_SIZE,
  step = OWNER_MOBILE_BATCH_SIZE
) {
  const {
    allOwners,
    filteredOwners,
    hasActiveFilter,
    clearFilters,
    filterResetKey,
    setEditingOwner,
  } = useOwnersDashboardContext();

  const { petsByOwnerId, speciesCodeById } = useOwnerPetRelations();
  const { copyPhone, isPhoneCopied } = useOwnerClipboard();
  const { openPdpaPopoverOwnerId, onPdpaPopoverOpenChange, openEditConsent } =
    usePdpaPopoverControl(setEditingOwner);

  const {
    displayedItems: mobileOwners,
    hasMore,
    remainingCount,
    totalCount,
    loadMore,
  } = useBatchSlice(filteredOwners, {
    initialCount,
    step,
    resetOnChange: filterResetKey,
  });

  return {
    mobileOwners,
    hasMore,
    remainingCount,
    loadMore,
    totalCount,
    isEmptyDataset: allOwners.length === 0,
    hasActiveFilter,
    clearFilters,
    petsByOwnerId,
    speciesCodeById,
    copyPhone,
    isPhoneCopied,
    openPdpaPopoverOwnerId,
    onPdpaPopoverOpenChange,
    openEditConsent,
    setEditingOwner,
  };
}
