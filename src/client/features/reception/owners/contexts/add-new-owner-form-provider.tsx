import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useAddNewOwnerForm } from "#/client/features/reception/owners/hooks/use-add-new-owner-form";
import type { GeoAddressSuggestion } from "#/client/shared/hooks/use-geo-thai";
import type { WizardFormApi, WizardStepNumber } from "#/client/shared/hooks/use-wizard-form";
import type { CreateOwnerInput, OwnerDto } from "#/shared/schemas/owner.schema";

export type WizardStep = WizardStepNumber;

interface AddNewOwnerFormContextValue {
  form: WizardFormApi<CreateOwnerInput>;
  mode: "create" | "edit";
  isEdit: boolean;
  editingOwnerId?: string;
  customerCode?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentStep: WizardStepNumber;
  isSubmitting: boolean;
  setFieldValue: <TField extends keyof CreateOwnerInput>(
    field: TField,
    value: CreateOwnerInput[TField]
  ) => void;
  setMultipleFields: (patch: Partial<CreateOwnerInput>) => void;
  handleSelectAddress: (suggestion: GeoAddressSuggestion) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: WizardStepNumber) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

const AddNewOwnerFormContext = createContext<AddNewOwnerFormContextValue | null>(null);

export interface AddNewOwnerFormProviderProps {
  children: ReactNode;
  mode?: "create" | "edit";
  owner?: OwnerDto | null;
  isOpenControlled?: boolean;
  onOpenChangeControlled?: (open: boolean) => void;
  onSuccess?: (owner: OwnerDto) => void;
}

export function AddNewOwnerFormProvider({
  children,
  mode = "create",
  owner = null,
  isOpenControlled,
  onOpenChangeControlled,
  onSuccess,
}: AddNewOwnerFormProviderProps) {
  const {
    form,
    isEdit,
    editingOwnerId,
    customerCode,
    isOpen,
    setIsOpen,
    currentStep,
    isSubmitting,
    setFieldValue,
    setMultipleFields,
    handleSelectAddress,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    resetForm,
  } = useAddNewOwnerForm({
    mode,
    owner,
    isOpenControlled,
    onOpenChangeControlled,
    onSuccess,
  });

  const value = useMemo<AddNewOwnerFormContextValue>(
    () => ({
      form,
      mode,
      isEdit,
      editingOwnerId,
      customerCode,
      isOpen,
      setIsOpen,
      currentStep,
      isSubmitting,
      setFieldValue,
      setMultipleFields,
      handleSelectAddress,
      nextStep,
      prevStep,
      goToStep,
      submitForm,
      resetForm,
    }),
    [
      form,
      mode,
      isEdit,
      editingOwnerId,
      customerCode,
      isOpen,
      setIsOpen,
      currentStep,
      isSubmitting,
      setFieldValue,
      setMultipleFields,
      handleSelectAddress,
      nextStep,
      prevStep,
      goToStep,
      submitForm,
      resetForm,
    ]
  );

  return (
    <AddNewOwnerFormContext.Provider value={value}>
      <form.AppForm>{children}</form.AppForm>
    </AddNewOwnerFormContext.Provider>
  );
}

export function useAddNewOwnerFormContext() {
  const context = useContext(AddNewOwnerFormContext);
  if (!context) {
    throw new Error("useAddNewOwnerFormContext must be used within an AddNewOwnerFormProvider");
  }
  return context;
}
