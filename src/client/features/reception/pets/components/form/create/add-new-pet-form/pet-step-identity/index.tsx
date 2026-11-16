import { PetIdentityOwnerField } from "./pet-identity-owner-field";
import { PetIdentityProfileField } from "./pet-identity-profile-field";
import { PetIdentitySpeciesBreedField } from "./pet-identity-species-breed-field";

export function PetStepIdentity() {
  return (
    <div className="flex flex-col gap-6">
      <PetIdentityOwnerField />
      <PetIdentityProfileField />
      <PetIdentitySpeciesBreedField />
    </div>
  );
}
