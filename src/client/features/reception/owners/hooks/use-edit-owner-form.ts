import { useCallback } from "react";
import { useOwnersContext } from "../contexts/owners.context";

export function useEditOwnerForm() {
  const { editingOwner, closeEditDialog } = useOwnersContext();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeEditDialog();
      }
    },
    [closeEditDialog]
  );

  return {
    editingOwner,
    handleOpenChange,
  };
}
