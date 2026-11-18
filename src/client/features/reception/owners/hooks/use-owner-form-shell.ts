import type { FormEvent } from "react";
import { useCallback } from "react";
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

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!isEdit && currentStep < 3) {
        nextStep();
        return;
      }

      void submitForm();
    },
    [isEdit, currentStep, nextStep, submitForm]
  );

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
    handleFormSubmit,
  };
}
