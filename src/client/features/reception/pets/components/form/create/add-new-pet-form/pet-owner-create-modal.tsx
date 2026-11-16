import { AddNewOwnerFormProvider } from "#/client/features/reception/owners/contexts/add-new-owner-form-provider";
import { usePetFormShell } from "#/client/features/reception/pets/hooks/use-pet-form-shell";
import { PetOwnerFormBody } from "./pet-owner-form-body";

export function PetOwnerCreateModal() {
  const { isNewOwnerModalOpen, setIsNewOwnerModalOpen, handleOwnerCreated } = usePetFormShell();

  if (!isNewOwnerModalOpen) return null;

  return (
    <AddNewOwnerFormProvider
      isOpenControlled={isNewOwnerModalOpen}
      onOpenChangeControlled={setIsNewOwnerModalOpen}
      onSuccess={handleOwnerCreated}
    >
      <PetOwnerFormBody />
    </AddNewOwnerFormProvider>
  );
}
