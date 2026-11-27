import { PetMedicalField } from "./pet-medical-field";
import { PetMicrochipField } from "./pet-microchip-field";
import { PetTemperamentField } from "./pet-temperament-field";

export function PetStepCaution() {
	return (
		<div className="flex flex-col gap-6">
			<PetTemperamentField />
			<PetMedicalField />
			<PetMicrochipField />
		</div>
	);
}
