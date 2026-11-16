import { useAddNewOwnerFormContext } from "#/client/features/reception/owners/contexts/add-new-owner-form-provider";

export function useOwnerFormShell() {
  const {
    mode,
    isEdit,
    customerCode,
    isOpen,
    setIsOpen,
    currentStep,
    isSubmitting,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    resetForm,
  } = useAddNewOwnerFormContext();

  return {
    mode,
    isEdit,
    customerCode,
    isOpen,
    setIsOpen,
    currentStep,
    isSubmitting,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    resetForm,
  };
}
