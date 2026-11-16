import { PetCautionTemperamentField } from "./pet-caution-temperament-field";
import { PetCautionMedicalField } from "./pet-caution-medical-field";
import { PetCautionMicrochipField } from "./pet-caution-microchip-field";

export function PetStepCaution() {
  return (
    <div className="flex flex-col gap-6">
      <PetCautionTemperamentField />
      <PetCautionMedicalField />
      <PetCautionMicrochipField />
    </div>
  );
}
