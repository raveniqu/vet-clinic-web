import { z } from "zod";

export const petSexEnum = z.enum(["Male", "Female", "Unknown"]);
export type PetSex = z.infer<typeof petSexEnum>;

export const reproductiveStatusEnum = z.enum(["Neutered", "Intact", "Unknown"]);
export type ReproductiveStatus = z.infer<typeof reproductiveStatusEnum>;

export const speciesGroupEnum = z.enum([
  "CANINE",
  "FELINE",
  "EXOTIC_MAMMAL",
  "AVIAN",
  "REPTILE",
  "AMPHIBIAN",
  "OTHER",
]);
export type SpeciesGroup = z.infer<typeof speciesGroupEnum>;

export const temperamentAlertEnum = z.enum(["Docile", "Nervous", "Aggressive", "Needs Muzzle"]);
export type TemperamentAlert = z.infer<typeof temperamentAlertEnum>;

// Step 1: Owner Link & Pet Identity
export const step1PetIdentitySchema = z.object({
  ownerId: z.number().int().positive("Please select an owner for this pet"),
  petName: z.string().trim().min(1, "Pet name is required"),
  speciesId: z.number().int().positive("Please select a species"),
  breedId: z.number().int().positive("Please select a breed"),
  customBreedName: z.string().optional().default(""),
  photo: z.string().optional().default(""),
});
export type Step1PetIdentityInput = z.infer<typeof step1PetIdentitySchema>;

// Step 2: Biological & Physical Profile
export const step2PetPhysicalSchema = z.object({
  sex: petSexEnum.default("Unknown"),
  reproductiveStatus: reproductiveStatusEnum.default("Unknown"),
  birthDateIsEstimated: z.boolean().default(false),
  dateOfBirth: z.string().trim().min(1, "Date of birth is required"),
  estimatedYears: z.number().int().min(0).max(50).optional().default(0),
  estimatedMonths: z.number().int().min(0).max(11).optional().default(0),
  color: z.string().optional().default(""),
  weight: z
    .string()
    .trim()
    .min(1, "Initial weight is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !Number.isNaN(num) && num > 0 && num < 500;
      },
      { message: "Weight must be a valid positive number in kg" }
    ),
});
export type Step2PetPhysicalInput = z.infer<typeof step2PetPhysicalSchema>;

// Step 3: Identification & Clinical Alerts
export const step3PetCautionSchema = z.object({
  microchipNumber: z
    .string()
    .optional()
    .default("")
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        // ISO 11784/11785 standard microchips are typically 15 digits
        return /^[0-9]{15}$/.test(val.trim());
      },
      { message: "Microchip number must be a 15-digit number (ISO standard)" }
    ),
  temperament: temperamentAlertEnum.default("Docile"),
  allergies: z.string().optional().default(""),
  medicalNotes: z.string().optional().default(""),
});
export type Step3PetCautionInput = z.infer<typeof step3PetCautionSchema>;

// Combined Create Pet Input Schema
export const createPetInputSchema = step1PetIdentitySchema
  .extend(step2PetPhysicalSchema.shape)
  .extend(step3PetCautionSchema.shape);

export type CreatePetInput = z.infer<typeof createPetInputSchema>;

// Pet DTO Schema (output / stored shape)
export const petDtoSchema = createPetInputSchema.extend({
  id: z.number().int().positive(),
  petCode: z.string(),
  speciesName: z.string(),
  breedName: z.string(),
  ownerName: z.string(),
  status: z.string().default("ACTIVE"),
  createdAt: z.string(),
});

export type PetDto = z.infer<typeof petDtoSchema>;

// Master Catalog Item Schemas
export const speciesItemSchema = z.object({
  id: z.number().int().positive(),
  code: z.string(),
  name: z.string(),
  nameTh: z.string(),
  group: speciesGroupEnum,
  icon: z.string(), // identifier for icon display
});
export type SpeciesItem = z.infer<typeof speciesItemSchema>;

export const breedItemSchema = z.object({
  id: z.number().int().positive(),
  speciesId: z.number().int().positive(),
  breedName: z.string(),
  isCustom: z.boolean().default(false),
});
export type BreedItem = z.infer<typeof breedItemSchema>;

// Input Query Schemas
export const getPetByIdSchema = z.object({
  id: z.number().int().positive(),
});
export type GetPetByIdInput = z.infer<typeof getPetByIdSchema>;

export const getPetsByOwnerSchema = z.object({
  ownerId: z.number().int().positive(),
});
export type GetPetsByOwnerInput = z.infer<typeof getPetsByOwnerSchema>;

export const getBreedsBySpeciesSchema = z.object({
  speciesId: z.number().int().positive().optional(),
});
export type GetBreedsBySpeciesInput = z.infer<typeof getBreedsBySpeciesSchema>;

// Update Pet Input Schema
export const updatePetInputSchema = createPetInputSchema.extend({
  id: z.number().int().positive(),
});
export type UpdatePetInput = z.infer<typeof updatePetInputSchema>;
