import { useCallback } from "react";
import { usePetsContext } from "../contexts/pets.context";

export function useEditPetForm() {
  const { editingPet, closeEditDialog } = usePetsContext();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeEditDialog();
      }
    },
    [closeEditDialog]
  );

  return {
    editingPet,
    handleOpenChange,
  };
}
