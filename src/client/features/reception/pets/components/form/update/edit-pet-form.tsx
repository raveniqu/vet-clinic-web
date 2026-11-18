import { AddNewPetFormProvider } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";
import { useEditPetForm } from "#/client/features/reception/pets/hooks/use-edit-pet-form";
import { PetOwnerCreateModal } from "../create/add-new-pet-form/pet-owner-create-modal";
import { PetPhotoQrModal } from "../create/add-new-pet-form/pet-photo-qr-modal";
import { EditPetFormBody } from "./edit-pet-form-body";

export function EditPetForm() {
  const { editingPet, handleOpenChange } = useEditPetForm();

  if (!editingPet) return null;

  return (
    <AddNewPetFormProvider
      mode="edit"
      pet={editingPet}
      isOpenControlled={Boolean(editingPet)}
      onOpenChangeControlled={handleOpenChange}
    >
      <EditPetFormBody />
      <PetOwnerCreateModal />
      <PetPhotoQrModal />
    </AddNewPetFormProvider>
  );
}
