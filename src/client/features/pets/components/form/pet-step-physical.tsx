import { PetBiologicalField } from "./pet-biological-field";
import { PetPhysicalAttributesField } from "./pet-physical-attributes-field";

export function PetStepPhysical() {
	return (
		<div className="flex flex-col gap-6">
			<PetBiologicalField />
			<PetPhysicalAttributesField />
		</div>
	);
}
