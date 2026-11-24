import type { WizardStepNumber } from "#/client/shared/hooks/use-wizard-form";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import {
  step1PetIdentitySchema,
  step2PetPhysicalSchema,
  step3PetCautionSchema,
} from "#/shared/schemas/pet.schema";
import type { CreatePetInput, PetDto } from "#/shared/schemas/pet.schema";

export interface SelectedOwnerSummary {
  id: string;
  customerCode: string;
  fullName: string;
  phone: string;
}

export const INITIAL_PET_FORM_VALUES: CreatePetInput = {
  ownerId: "",
  petName: "",
  speciesId: 1, // Default: Dog
  breedId: 101, // Default: Mixed Breed
  customBreedName: "",
  photo: "",
  sex: "Unknown",
  reproductiveStatus: "Unknown",
  birthDateIsEstimated: false,
  dateOfBirth: "",
  estimatedYears: 0,
  estimatedMonths: 0,
  color: "",
  weight: "",
  microchipNumber: "",
  temperament: "Docile",
  allergies: "",
  medicalNotes: "",
};

export const PET_STEP_SCHEMAS = {
  1: step1PetIdentitySchema,
  2: step2PetPhysicalSchema,
  3: step3PetCautionSchema,
} as const;

const PET_STEP_1_FIELDS = new Set<string>([
  "ownerId",
  "petName",
  "speciesId",
  "breedId",
  "customBreedName",
  "photo",
]);

const PET_STEP_2_FIELDS = new Set<string>([
  "sex",
  "reproductiveStatus",
  "birthDateIsEstimated",
  "dateOfBirth",
  "estimatedYears",
  "estimatedMonths",
  "color",
  "weight",
]);

export function resolvePetFieldStep(fieldKey: string): WizardStepNumber {
  if (PET_STEP_1_FIELDS.has(fieldKey)) return 1;
  if (PET_STEP_2_FIELDS.has(fieldKey)) return 2;
  return 3;
}

export function mapPetToInput(pet: PetDto): CreatePetInput {
  return {
    ownerId: pet.ownerId,
    petName: pet.petName,
    speciesId: pet.speciesId,
    breedId: pet.breedId,
    customBreedName: pet.customBreedName,
    photo: pet.photo,
    sex: pet.sex,
    reproductiveStatus: pet.reproductiveStatus,
    birthDateIsEstimated: pet.birthDateIsEstimated,
    dateOfBirth: pet.dateOfBirth,
    estimatedYears: pet.estimatedYears,
    estimatedMonths: pet.estimatedMonths,
    color: pet.color,
    weight: pet.weight,
    microchipNumber: pet.microchipNumber,
    temperament: pet.temperament,
    allergies: pet.allergies,
    medicalNotes: pet.medicalNotes,
  };
}

export function formatOwnerSummaryName(owner: OwnerDto): string {
  const parts =
    owner.customerType === "JURISTIC"
      ? [owner.prefix, owner.firstName]
      : [owner.prefix, owner.firstName, owner.lastName];
  return parts.filter((part) => part.trim().length > 0).join(" ");
}

export function mapOwnerToSelectedSummary(owner: OwnerDto): SelectedOwnerSummary {
  return {
    id: owner.id,
    customerCode: owner.customerCode,
    fullName: formatOwnerSummaryName(owner),
    phone: owner.phonePrimary,
  };
}

export function mapPetToSelectedOwnerSummary(pet: PetDto): SelectedOwnerSummary {
  return {
    id: pet.ownerId,
    customerCode: "",
    fullName: pet.ownerName,
    phone: "",
  };
}
