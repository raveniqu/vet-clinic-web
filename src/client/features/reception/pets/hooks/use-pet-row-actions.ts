import { useCallback } from "react";
import { usePetRowContext } from "../contexts/pet-row.context";
import { usePetsContext } from "../contexts/pets.context";

export function usePetRowActions() {
  const { pet, columnId, speciesCode, isMicrochipCopied, copyMicrochip } = usePetRowContext();
  const { openEditDialog } = usePetsContext();

  const handleEdit = useCallback(() => {
    openEditDialog(pet);
  }, [openEditDialog, pet]);

  const handleCopyMicrochip = useCallback(() => {
    void copyMicrochip(pet.id, pet.microchipNumber);
  }, [copyMicrochip, pet.id, pet.microchipNumber]);

  return {
    pet,
    columnId,
    speciesCode,
    isMicrochipCopied,
    handleEdit,
    handleCopyMicrochip,
  };
}
