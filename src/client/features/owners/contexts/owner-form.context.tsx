import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import type {
	WizardFormApi,
	WizardStepNumber,
} from "#/client/shared/hooks/use-wizard-form";
import { useOwnerForm } from "../hooks/use-owner-form";
import type { OwnerFormValues } from "../models/owner-form.model";

export interface OwnerFormContextValue {
	form: WizardFormApi<OwnerFormValues>;
	mode: "create" | "edit";
	isEdit: boolean;
	editingOwnerId: number | null;
	ownerCode: string | null;
	isOpen: boolean;
	isLoadingOwner: boolean;
	isLoadOwnerError: boolean;
	conflictBanner: string | null;
	currentStep: WizardStepNumber;
	isSubmitting: boolean;
	openCreate: () => void;
	openEdit: (ownerId: number) => void;
	setIsOpen: (open: boolean) => void;
	setFieldValue: <TField extends keyof OwnerFormValues>(
		field: TField,
		value: OwnerFormValues[TField],
	) => void;
	setMultipleFields: (patch: Partial<OwnerFormValues>) => void;
	nextStep: () => boolean;
	prevStep: () => void;
	goToStep: (step: WizardStepNumber) => void;
	submitForm: () => Promise<void>;
	resetForm: () => void;
	retryLoadOwner: () => void;
}

const OwnerFormContext = createContext<OwnerFormContextValue | null>(null);

export function OwnerFormProvider({ children }: { children: ReactNode }) {
	const formController = useOwnerForm();

	const value = useMemo<OwnerFormContextValue>(
		() => formController,
		[formController],
	);

	return (
		<OwnerFormContext.Provider value={value}>
			<formController.form.AppForm>{children}</formController.form.AppForm>
		</OwnerFormContext.Provider>
	);
}

export function useOwnerFormContext(): OwnerFormContextValue {
	const context = useContext(OwnerFormContext);
	if (!context) {
		throw new Error(
			"useOwnerFormContext must be used inside <OwnerFormProvider>",
		);
	}
	return context;
}
