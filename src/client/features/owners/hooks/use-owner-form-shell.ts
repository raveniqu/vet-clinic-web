import type { FormEvent } from "react";
import { useCallback } from "react";
import { useOwnerFormContext } from "../contexts/owner-form.context";

export function useOwnerFormShell() {
	const {
		mode,
		isEdit,
		ownerCode,
		isOpen,
		isLoadingOwner,
		isLoadOwnerError,
		currentStep,
		isSubmitting,
		openCreate,
		setIsOpen,
		nextStep,
		prevStep,
		goToStep,
		submitForm,
		resetForm,
		retryLoadOwner,
	} = useOwnerFormContext();

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
		ownerCode,
		isOpen,
		isLoadingOwner,
		isLoadOwnerError,
		currentStep,
		isSubmitting,
		openCreate,
		setIsOpen,
		nextStep,
		prevStep,
		goToStep,
		submitForm,
		resetForm,
		retryLoadOwner,
		handleFormSubmit,
	};
}
