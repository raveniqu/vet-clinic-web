import { PetCautionMedicalField } from "./pet-step-caution/pet-caution-medical-field";
import { PetCautionMicrochipField } from "./pet-step-caution/pet-caution-microchip-field";
import { PetCautionTemperamentField } from "./pet-step-caution/pet-caution-temperament-field";

export function PetStepCaution() {
  return (
    <div className="flex flex-col gap-6">
      <PetCautionTemperamentField />
      <PetCautionMedicalField />
      <PetCautionMicrochipField />
    </div>
  );
}
