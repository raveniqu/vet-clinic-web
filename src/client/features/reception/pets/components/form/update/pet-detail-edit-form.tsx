import { AddNewPetFormProvider } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";
import { usePetDetailEditForm } from "#/client/features/reception/pets/hooks/use-pet-detail-edit-form";
import { PetOwnerCreateModal } from "../create/add-new-pet-form/pet-owner-create-modal";
import { PetPhotoQrModal } from "../create/add-new-pet-form/pet-photo-qr-modal";
import { EditPetFormBody } from "./edit-pet-form-body";

export function PetDetailEditForm() {
  const { pet, isEditOpen, setIsEditOpen } = usePetDetailEditForm();

  if (!isEditOpen) {
    return null;
  }

  return (
    <AddNewPetFormProvider
      mode="edit"
      pet={pet}
      isOpenControlled={isEditOpen}
      onOpenChangeControlled={setIsEditOpen}
    >
      <EditPetFormBody />
      <PetOwnerCreateModal />
      <PetPhotoQrModal />
    </AddNewPetFormProvider>
  );
}
