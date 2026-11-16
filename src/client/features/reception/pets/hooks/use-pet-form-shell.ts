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
  };
}
