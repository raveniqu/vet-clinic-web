import { useCallback } from "react";
import { useOwnerRow } from "../contexts/owner-row.context";
import { useOwnersContext } from "../contexts/owners.context";
import { getOwnerDisplayName } from "../models/owners-table";
import { useOwnerClipboard } from "./use-owner-clipboard";

export function useOwnerRowActions() {
  const owner = useOwnerRow();
  const { openEditDialog } = useOwnersContext();
  const { copyPhone, isPhoneCopied } = useOwnerClipboard();

  const displayName = getOwnerDisplayName(owner);
  const phoneCopied = isPhoneCopied(owner.id);

  const handleEditProfile = useCallback(() => {
    openEditDialog(owner);
  }, [openEditDialog, owner]);

  const handleCopyPhone = useCallback(() => {
    void copyPhone(owner.id, owner.phonePrimary);
  }, [copyPhone, owner.id, owner.phonePrimary]);

  return {
    owner,
    displayName,
    phoneCopied,
    handleEditProfile,
    handleCopyPhone,
  };
}
