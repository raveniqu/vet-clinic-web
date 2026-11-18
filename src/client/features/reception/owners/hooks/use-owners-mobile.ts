import { useBatchSlice } from "#/client/shared/hooks/use-batch-slice";
import { useOwnersContext } from "../contexts/owners.context";
import { OWNER_MOBILE_BATCH_SIZE } from "../models/owners-table";
import { useOwnerClipboard } from "./use-owner-clipboard";
import { useOwnerPetRelations } from "./use-owner-pet-relations";
import { useOwnersList } from "./use-owners-list";
import { useOwnersSearch } from "./use-owners-search";

export function useOwnersMobile(
  initialCount = OWNER_MOBILE_BATCH_SIZE,
  step = OWNER_MOBILE_BATCH_SIZE
) {
  const { resetFilters } = useOwnersSearch();
  const { filteredOwners, isEmptyDataset, hasActiveFilter, filterResetKey } = useOwnersList();
  const { openEditDialog } = useOwnersContext();
  const { petsByOwnerId, speciesCodeById } = useOwnerPetRelations();
  const { copyPhone, isPhoneCopied } = useOwnerClipboard();

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
    isEmptyDataset,
    hasActiveFilter,
    clearFilters: resetFilters,
    petsByOwnerId,
    speciesCodeById,
    copyPhone,
    isPhoneCopied,
    openEditDialog,
  };
}
