import { PetPhysicalAttributesField } from "./pet-step-physical/pet-physical-attributes-field";
import { PetPhysicalBiologicalField } from "./pet-step-physical/pet-physical-biological-field";

export function PetStepPhysical() {
  return (
    <div className="flex flex-col gap-6">
      <PetPhysicalBiologicalField />
      <PetPhysicalAttributesField />
    </div>
  );
}
