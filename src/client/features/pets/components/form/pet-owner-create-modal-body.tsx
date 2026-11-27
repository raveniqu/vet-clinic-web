import { OwnerFormDialog } from "#/client/features/owners/components/form/owner-form-dialog";
import { usePetOwnerCreateBridge } from "#/client/features/pets/hooks/use-pet-owner-create-bridge";

export function PetOwnerCreateModalBody() {
	usePetOwnerCreateBridge();

	return <OwnerFormDialog />;
}
