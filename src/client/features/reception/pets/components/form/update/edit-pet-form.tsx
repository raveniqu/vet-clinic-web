import { usePetsDashboardContext } from "#/client/features/reception/pets/contexts/pets-dashboard-provider";
import { AddNewPetFormProvider } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";
import { EditPetFormBody } from "./edit-pet-form-body";
import { PetOwnerCreateModal } from "../create/add-new-pet-form/pet-owner-create-modal";
import { PetPhotoQrModal } from "../create/add-new-pet-form/pet-photo-qr-modal";

export function EditPetForm() {
  const { editingPet, setEditingPet } = usePetsDashboardContext();

  if (!editingPet) return null;

  return (
    <AddNewPetFormProvider
      mode="edit"
      pet={editingPet}
      isOpenControlled={Boolean(editingPet)}
      onOpenChangeControlled={(open) => {
        if (!open) setEditingPet(null);
      }}
    >
      <EditPetFormBody />
      <PetOwnerCreateModal />
      <PetPhotoQrModal />
    </AddNewPetFormProvider>
  );
}
