import type { ChangeEvent } from "react";
import { useCallback } from "react";
import {
	useFormErrors,
	useFormValues,
} from "#/client/shared/hooks/use-wizard-form";
import { usePetFormContext } from "../contexts/pet-form.context";
import { temperamentAlertSchema } from "../models/pet-form.model";

const PET_CAUTION_KEYS = [
	"microchipNumber",
	"temperament",
	"allergies",
	"medicalNotes",
] as const;
const PET_CAUTION_ERROR_KEYS = [
	"microchipNumber",
	"allergies",
	"medicalNotes",
] as const;

export function usePetCautionForm() {
	const { form, setFieldValue } = usePetFormContext();
	const values = useFormValues(form, PET_CAUTION_KEYS);
	const stepErrors = useFormErrors(form, PET_CAUTION_ERROR_KEYS);

	const handleMicrochipChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const rawDigits = event.target.value.replace(/\D/g, "").slice(0, 15);
			setFieldValue("microchipNumber", rawDigits);
		},
		[setFieldValue],
	);

	const handleTemperamentChange = useCallback(
		(nextValue: unknown) => {
			const parsed = temperamentAlertSchema.safeParse(nextValue);
			if (parsed.success) {
				setFieldValue("temperament", parsed.data);
			}
		},
		[setFieldValue],
	);

	const handleAllergiesChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setFieldValue("allergies", event.target.value);
		},
		[setFieldValue],
	);

	const handleMedicalNotesChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setFieldValue("medicalNotes", event.target.value);
		},
		[setFieldValue],
	);

	return {
		microchipNumber: values.microchipNumber,
		microchipNumberError: stepErrors.microchipNumber,
		handleMicrochipChange,
		temperament: values.temperament,
		handleTemperamentChange,
		allergies: values.allergies,
		allergiesError: stepErrors.allergies,
		handleAllergiesChange,
		medicalNotes: values.medicalNotes,
		medicalNotesError: stepErrors.medicalNotes,
		handleMedicalNotesChange,
	};
}
