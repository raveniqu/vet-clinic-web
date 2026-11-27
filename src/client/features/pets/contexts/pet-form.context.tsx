import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import type {
	WizardFormApi,
	WizardStepNumber,
} from "#/client/shared/hooks/use-wizard-form";
import type { OwnerDetailsResponse } from "#/shared/schemas/owners.schema";
import { usePetForm } from "../hooks/use-pet-form";
import type {
	PetFormValues,
	SelectedOwnerSummary,
} from "../models/pet-form.model";

export interface PetFormContextValue {
	form: WizardFormApi<PetFormValues>;
	mode: "create" | "edit";
	isEdit: boolean;
	editingPetId: number | null;
	petCode: string | null;
	isOpen: boolean;
	isLoadingPet: boolean;
	isLoadPetError: boolean;
	currentStep: WizardStepNumber;
	isSubmitting: boolean;
	selectedOwnerSummary: SelectedOwnerSummary | null;
	isNewOwnerModalOpen: boolean;
	setSelectedOwnerSummary: (summary: SelectedOwnerSummary | null) => void;
	setIsNewOwnerModalOpen: (open: boolean) => void;
	openCreate: () => void;
	openEdit: (petId: number) => void;
	setIsOpen: (open: boolean) => void;
	setFieldValue: <TField extends keyof PetFormValues>(
		field: TField,
		value: PetFormValues[TField],
	) => void;
	setMultipleFields: (patch: Partial<PetFormValues>) => void;
	nextStep: () => boolean;
	prevStep: () => void;
	goToStep: (step: WizardStepNumber) => void;
	submitForm: () => Promise<void>;
	resetForm: () => void;
	retryLoadPet: () => void;
	handleOwnerCreated: (owner: OwnerDetailsResponse) => void;
}

const PetFormContext = createContext<PetFormContextValue | null>(null);

export function PetFormProvider({ children }: { children: ReactNode }) {
	const formController = usePetForm();

	const value = useMemo<PetFormContextValue>(
		() => formController,
		[formController],
	);

	return (
		<PetFormContext.Provider value={value}>
			<formController.form.AppForm>{children}</formController.form.AppForm>
		</PetFormContext.Provider>
	);
}

export function usePetFormContext(): PetFormContextValue {
	const context = useContext(PetFormContext);
	if (!context) {
		throw new Error("usePetFormContext must be used inside <PetFormProvider>");
	}
	return context;
}
