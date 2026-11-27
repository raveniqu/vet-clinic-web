import { OwnerFormProvider } from "#/client/features/owners/contexts/owner-form.context";
import { usePetFormShell } from "#/client/features/pets/hooks/use-pet-form-shell";
import { PetOwnerCreateModalBody } from "./pet-owner-create-modal-body";

export function PetOwnerCreateModal() {
	const { handleOwnerCreated } = usePetFormShell();

	return (
		<OwnerFormProvider onCreated={handleOwnerCreated}>
			<PetOwnerCreateModalBody />
		</OwnerFormProvider>
	);
}
