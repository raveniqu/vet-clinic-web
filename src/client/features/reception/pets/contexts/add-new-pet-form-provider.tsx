import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useAddNewPetForm } from "#/client/features/reception/pets/hooks/use-add-new-pet-form";
import type { WizardFormApi, WizardStepNumber } from "#/client/shared/hooks/use-wizard-form";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import type { CreatePetInput, PetDto } from "#/shared/schemas/pet.schema";
import type { SelectedOwnerSummary } from "../models/pet-form";

export type PetWizardStep = WizardStepNumber;

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
    isEdit,
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
    isSubmitting,
    submitForm,
    resetForm,
  } = useAddNewPetForm({
    mode,
    pet,
    isOpenControlled,
    onOpenChangeControlled,
    onSuccess,
  });

  const value = useMemo<AddNewPetFormContextValue>(
    () => ({
      form,
      mode,
      isEdit,
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
      isSubmitting,
      submitForm,
      resetForm,
    }),
    [
      form,
      mode,
      isEdit,
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
      isSubmitting,
      submitForm,
      resetForm,
    ]
  );

  return (
    <AddNewPetFormContext.Provider value={value}>
      <form.AppForm>{children}</form.AppForm>
    </AddNewPetFormContext.Provider>
  );
}

export function useAddNewPetFormContext() {
  const context = useContext(AddNewPetFormContext);
  if (!context) {
    throw new Error("useAddNewPetFormContext must be used within an AddNewPetFormProvider");
  }
  return context;
}
