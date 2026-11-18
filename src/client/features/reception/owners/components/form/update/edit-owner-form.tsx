import { AddNewOwnerFormProvider } from "#/client/features/reception/owners/contexts/add-new-owner-form-provider";
import { useEditOwnerForm } from "#/client/features/reception/owners/hooks/use-edit-owner-form";
import { EditOwnerFormBody } from "./edit-owner-form-body";

export function EditOwnerForm() {
  const { editingOwner, handleOpenChange } = useEditOwnerForm();

  if (!editingOwner) return null;

  return (
    <AddNewOwnerFormProvider
      mode="edit"
      owner={editingOwner}
      isOpenControlled={Boolean(editingOwner)}
      onOpenChangeControlled={handleOpenChange}
    >
      <EditOwnerFormBody />
    </AddNewOwnerFormProvider>
  );
}
