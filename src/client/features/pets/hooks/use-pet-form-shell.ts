import type { FormEvent } from "react";
import { useCallback } from "react";
import { usePetFormContext } from "../contexts/pet-form.context";

export function usePetFormShell() {
	const {
		mode,
		isEdit,
		petCode,
		isOpen,
		isLoadingPet,
		isLoadPetError,
		currentStep,
		isSubmitting,
		isNewOwnerModalOpen,
		setIsNewOwnerModalOpen,
		handleOwnerCreated,
		openCreate,
		setIsOpen,
		nextStep,
		prevStep,
		goToStep,
		submitForm,
		resetForm,
		retryLoadPet,
	} = usePetFormContext();

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
		[isEdit, currentStep, nextStep, submitForm],
	);

	return {
		mode,
		isEdit,
		petCode,
		isOpen,
		isLoadingPet,
		isLoadPetError,
		currentStep,
		isSubmitting,
		isNewOwnerModalOpen,
		setIsNewOwnerModalOpen,
		handleOwnerCreated,
		openCreate,
		setIsOpen,
		nextStep,
		prevStep,
		goToStep,
		submitForm,
		resetForm,
		retryLoadPet,
		handleFormSubmit,
	};
}
