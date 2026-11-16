import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useCreatePetMutation } from "#/client/caches/pets/mutates/create-pet.mutate";
import { useUpdatePetMutation } from "#/client/caches/pets/mutates/update-pet.mutate";
import { useWizardForm } from "#/client/shared/hooks/use-wizard-form";
import type { WizardFormApi, WizardStepNumber } from "#/client/shared/hooks/use-wizard-form";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import {
  createPetInputSchema,
  step1PetIdentitySchema,
  step2PetPhysicalSchema,
  step3PetCautionSchema,
} from "#/shared/schemas/pet.schema";
import type { CreatePetInput, PetDto } from "#/shared/schemas/pet.schema";

export type PetWizardStep = WizardStepNumber;

export const initialPetValues: CreatePetInput = {
  ownerId: 0,
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

const PET_STEP_SCHEMAS = {
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

function resolvePetFieldStep(fieldKey: string): PetWizardStep {
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

export interface SelectedOwnerSummary {
  id: number;
  customerCode: string;
  fullName: string;
  phone: string;
}

interface AddNewPetFormContextValue {
  form: WizardFormApi<CreatePetInput>;
  mode: "create" | "edit";
  isEdit: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentStep: PetWizardStep;
  goToStep: (step: PetWizardStep) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  clearFieldError: (fieldName: string) => void;
  setFieldValue: <TField extends keyof CreatePetInput>(
    field: TField,
    value: CreatePetInput[TField]
  ) => void;
  setMultipleFields: (patch: Partial<CreatePetInput>) => void;
  isNewOwnerModalOpen: boolean;
  setIsNewOwnerModalOpen: (open: boolean) => void;
  isQrModalOpen: boolean;
  setIsQrModalOpen: (open: boolean) => void;
  selectedOwnerSummary: SelectedOwnerSummary | null;
  setSelectedOwnerSummary: (owner: SelectedOwnerSummary | null) => void;
  handleOwnerCreated: (newOwner: OwnerDto) => void;
  isSubmitting: boolean;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

const AddNewPetFormContext = createContext<AddNewPetFormContextValue | null>(null);

export interface AddNewPetFormProviderProps {
  children: ReactNode;
  mode?: "create" | "edit";
  pet?: PetDto | null;
  isOpenControlled?: boolean;
  onOpenChangeControlled?: (open: boolean) => void;
  onSuccess?: (pet: PetDto) => void;
}

export function AddNewPetFormProvider({
  children,
  mode = "create",
  pet = null,
  isOpenControlled,
  onOpenChangeControlled,
  onSuccess,
}: AddNewPetFormProviderProps) {
  const {
    form,
    isOpen,
    setIsOpen,
    currentStep,
    clearFieldError,
    setFieldValue,
    setMultipleFields,
    validateAll,
    nextStep,
    prevStep,
    goToStep,
    resetWizardState,
  } = useWizardForm<CreatePetInput>({
    initialValues: () => (mode === "edit" && pet ? mapPetToInput(pet) : initialPetValues),
    resetValues: initialPetValues,
    routePath: "/pets",
    isOpenControlled,
    onOpenChangeControlled,
    stepSchemas: PET_STEP_SCHEMAS,
    fullSchema: createPetInputSchema,
    resolveFieldStep: resolvePetFieldStep,
  });

  const [isNewOwnerModalOpen, setIsNewOwnerModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const [selectedOwnerSummary, setSelectedOwnerSummary] = useState<SelectedOwnerSummary | null>(
    () => {
      if (mode === "edit" && pet) {
        return {
          id: pet.ownerId,
          customerCode: "",
          fullName: pet.ownerName,
          phone: "",
        };
      }
      return null;
    }
  );

  const createMutation = useCreatePetMutation();
  const updateMutation = useUpdatePetMutation();

  // Sync values when pet changes in edit mode
  useEffect(() => {
    if (mode === "edit" && pet) {
      resetWizardState(mapPetToInput(pet));
      setSelectedOwnerSummary({
        id: pet.ownerId,
        customerCode: "",
        fullName: pet.ownerName,
        phone: "",
      });
    }
  }, [mode, pet, resetWizardState]);

  const resetForm = useCallback(() => {
    resetWizardState();
    setSelectedOwnerSummary(null);
  }, [resetWizardState]);

  // When a new owner is registered via the embedded owner modal
  const handleOwnerCreated = useCallback(
    (newOwner: OwnerDto) => {
      setFieldValue("ownerId", newOwner.id);
      setSelectedOwnerSummary({
        id: newOwner.id,
        customerCode: newOwner.customerCode,
        fullName:
          `${newOwner.customerType === "INDIVIDUAL" ? newOwner.prefix : `${newOwner.prefix}:`} ${newOwner.firstName} ${newOwner.lastName}`.trim(),
        phone: newOwner.phonePrimary,
      });
      setIsNewOwnerModalOpen(false);
    },
    [setFieldValue]
  );

  const submitForm = useCallback(async () => {
    const validated = validateAll();
    if (!validated.success) return;

    if (mode === "edit" && pet) {
      const updated = await updateMutation.mutateAsync({
        ...validated.data,
        id: pet.id,
      });
      setIsOpen(false);
      onSuccess?.(updated);
    } else {
      await createMutation.mutateAsync(validated.data);
      setIsOpen(false);
      resetForm();
    }
  }, [validateAll, mode, pet, updateMutation, createMutation, setIsOpen, onSuccess, resetForm]);

  const value = useMemo<AddNewPetFormContextValue>(
    () => ({
      form,
      mode,
      isEdit: mode === "edit",
      isOpen,
      setIsOpen,
      currentStep,
      goToStep,
      nextStep,
      prevStep,
      clearFieldError,
      setFieldValue,
      setMultipleFields,
      isNewOwnerModalOpen,
      setIsNewOwnerModalOpen,
      isQrModalOpen,
      setIsQrModalOpen,
      selectedOwnerSummary,
      setSelectedOwnerSummary,
      handleOwnerCreated,
      isSubmitting: createMutation.isPending || updateMutation.isPending,
      submitForm,
      resetForm,
    }),
    [
      form,
      mode,
      isOpen,
      setIsOpen,
      currentStep,
      goToStep,
      nextStep,
      prevStep,
      clearFieldError,
      setFieldValue,
      setMultipleFields,
      isNewOwnerModalOpen,
      isQrModalOpen,
      selectedOwnerSummary,
      handleOwnerCreated,
      createMutation.isPending,
      updateMutation.isPending,
      submitForm,
      resetForm,
    ]
  );

  return <AddNewPetFormContext.Provider value={value}>{children}</AddNewPetFormContext.Provider>;
}

export function useAddNewPetFormContext() {
  const context = useContext(AddNewPetFormContext);
  if (!context) {
    throw new Error("useAddNewPetFormContext must be used within an AddNewPetFormProvider");
  }
  return context;
}
