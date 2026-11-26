import { useCallback } from "react";
import {
	useFormErrors,
	useFormValues,
} from "#/client/shared/hooks/use-wizard-form";
import { acquisitionChannelSchema } from "#/shared/schemas/owners.schema";
import { useOwnerFormContext } from "../contexts/owner-form.context";

const OWNER_STEP_3_KEYS = [
	"acquisitionChannel",
	"privacyPolicy",
	"appointment",
	"marketing",
	"media",
	"research",
] as const;

export function useOwnerPreferencesPdpaForm() {
	const { form, setFieldValue } = useOwnerFormContext();
	const values = useFormValues(form, OWNER_STEP_3_KEYS);
	const errors = useFormErrors(form, OWNER_STEP_3_KEYS);

	const handleAcquisitionChannelChange = useCallback(
		(nextValue: string | null) => {
			const parsed = acquisitionChannelSchema.safeParse(nextValue);
			if (parsed.success) {
				setFieldValue("acquisitionChannel", parsed.data);
			}
		},
		[setFieldValue],
	);

	const handleAppointmentChange = useCallback(
		(checked: boolean) => {
			setFieldValue("appointment", checked === true);
		},
		[setFieldValue],
	);

	const handleMarketingChange = useCallback(
		(checked: boolean) => {
			setFieldValue("marketing", checked === true);
		},
		[setFieldValue],
	);

	const handleMediaChange = useCallback(
		(checked: boolean) => {
			setFieldValue("media", checked === true);
		},
		[setFieldValue],
	);

	const handleResearchChange = useCallback(
		(checked: boolean) => {
			setFieldValue("research", checked === true);
		},
		[setFieldValue],
	);

	return {
		values,
		errors,
		handleAcquisitionChannelChange,
		handleAppointmentChange,
		handleMarketingChange,
		handleMediaChange,
		handleResearchChange,
	};
}
