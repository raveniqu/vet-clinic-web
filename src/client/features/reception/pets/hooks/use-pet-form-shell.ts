import type { FormEvent } from "react";
import { useCallback } from "react";
import { useAddNewPetFormContext } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";

export function usePetFormShell() {
  const {
    mode,
    isEdit,
    isOpen,
    setIsOpen,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    isNewOwnerModalOpen,
    setIsNewOwnerModalOpen,
    handleOwnerCreated,
    isSubmitting,
    submitForm,
    resetForm,
  } = useAddNewPetFormContext();

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
    isOpen,
    setIsOpen,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    isNewOwnerModalOpen,
    setIsNewOwnerModalOpen,
    handleOwnerCreated,
    isSubmitting,
    submitForm,
    resetForm,
    handleFormSubmit,
  };
}
