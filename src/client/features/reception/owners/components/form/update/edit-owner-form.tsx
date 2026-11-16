import { useOwnersDashboardContext } from "#/client/features/reception/owners/contexts/owners-dashboard-provider";
import { AddNewOwnerFormProvider } from "#/client/features/reception/owners/contexts/add-new-owner-form-provider";
import { EditOwnerFormBody } from "./edit-owner-form-body";

export function EditOwnerForm() {
  const { editingOwner, setEditingOwner } = useOwnersDashboardContext();

  if (!editingOwner) return null;

  return (
    <AddNewOwnerFormProvider
      mode="edit"
      owner={editingOwner}
      isOpenControlled={Boolean(editingOwner)}
      onOpenChangeControlled={(open) => {
        if (!open) setEditingOwner(null);
      }}
    >
      <EditOwnerFormBody />
    </AddNewOwnerFormProvider>
  );
}
