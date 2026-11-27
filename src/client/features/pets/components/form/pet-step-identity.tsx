import { PetOwnerField } from "./pet-owner-field";
import { PetProfileField } from "./pet-profile-field";
import { PetSpeciesBreedField } from "./pet-species-breed-field";

export function PetStepIdentity() {
	return (
		<div className="flex flex-col gap-6">
			<PetOwnerField />
			<PetProfileField />
			<PetSpeciesBreedField />
		</div>
	);
}
