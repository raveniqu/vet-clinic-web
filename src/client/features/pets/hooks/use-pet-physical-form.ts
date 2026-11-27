import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import {
	useFormErrors,
	useFormValues,
} from "#/client/shared/hooks/use-wizard-form";
import { usePetFormContext } from "../contexts/pet-form.context";
import {
	petSexSchema,
	reproductiveStatusSchema,
} from "../models/pet-form.model";

const PET_PHYSICAL_KEYS = [
	"sex",
	"reproductiveStatus",
	"weight",
	"dateOfBirth",
	"birthDateIsEstimated",
	"estimatedYears",
	"estimatedMonths",
	"color",
] as const;

const PET_PHYSICAL_ERROR_KEYS = [
	"sex",
	"reproductiveStatus",
	"weight",
	"dateOfBirth",
	"color",
] as const;

function calculateEstimatedDob(years: number, months: number): string {
	const now = new Date();
	let targetYear = now.getFullYear() - years;
	let targetMonth = now.getMonth() - months;

	while (targetMonth < 0) {
		targetYear -= 1;
		targetMonth += 12;
	}

	const yStr = String(targetYear);
	const mStr = String(targetMonth + 1).padStart(2, "0");
	return `${yStr}-${mStr}-01`;
}

function parseLocalCalendarDate(isoDate: string): Date | undefined {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
	if (!match) return undefined;
	const parsed = new Date(
		Number(match[1]),
		Number(match[2]) - 1,
		Number(match[3]),
	);
	return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export function usePetPhysicalForm() {
	const { form, setFieldValue, setMultipleFields } = usePetFormContext();
	const values = useFormValues(form, PET_PHYSICAL_KEYS);
	const stepErrors = useFormErrors(form, PET_PHYSICAL_ERROR_KEYS);

	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [isApproxOpen, setIsApproxOpen] = useState(false);
	const [tempYears, setTempYears] = useState<number>(
		values.estimatedYears || 0,
	);
	const [tempMonths, setTempMonths] = useState<number>(
		values.estimatedMonths || 0,
	);

	const tempEstimatedDob = useMemo(
		() => calculateEstimatedDob(tempYears, tempMonths),
		[tempYears, tempMonths],
	);

	const selectedDobDate = useMemo(
		() =>
			values.dateOfBirth
				? parseLocalCalendarDate(values.dateOfBirth)
				: undefined,
		[values.dateOfBirth],
	);

	const calendarStartMonth = useMemo(
		() => new Date(new Date().getFullYear() - 30, 0),
		[],
	);
	const calendarEndMonth = useMemo(() => new Date(), []);
	const defaultDobMonth = useMemo(
		() => selectedDobDate ?? new Date(),
		[selectedDobDate],
	);

	const handleSexChange = useCallback(
		(nextValue: unknown) => {
			const parsed = petSexSchema.safeParse(nextValue);
			if (parsed.success) {
				setFieldValue("sex", parsed.data);
			}
		},
		[setFieldValue],
	);

	const handleReproductiveStatusChange = useCallback(
		(nextValue: unknown) => {
			const parsed = reproductiveStatusSchema.safeParse(nextValue);
			if (parsed.success) {
				setFieldValue("reproductiveStatus", parsed.data);
			}
		},
		[setFieldValue],
	);

	const handleOpenApproxChange = useCallback(
		(open: boolean) => {
			if (open) {
				setTempYears(values.estimatedYears || 0);
				setTempMonths(values.estimatedMonths || 0);
			}
			setIsApproxOpen(open);
		},
		[values.estimatedYears, values.estimatedMonths],
	);

	const handleTempYearsChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const years = Math.max(
				0,
				Math.min(40, Number.parseInt(event.target.value, 10) || 0),
			);
			setTempYears(years);
		},
		[],
	);

	const handleTempMonthsChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const months = Math.max(
				0,
				Math.min(11, Number.parseInt(event.target.value, 10) || 0),
			);
			setTempMonths(months);
		},
		[],
	);

	const handleApplyApproxAge = useCallback(() => {
		const calculatedDate = calculateEstimatedDob(tempYears, tempMonths);
		setMultipleFields({
			birthDateIsEstimated: true,
			estimatedYears: tempYears,
			estimatedMonths: tempMonths,
			dateOfBirth: calculatedDate,
		});
		setIsApproxOpen(false);
	}, [tempYears, tempMonths, setMultipleFields]);

	const handleClearApproxAge = useCallback(() => {
		setMultipleFields({
			birthDateIsEstimated: false,
			estimatedYears: 0,
			estimatedMonths: 0,
			dateOfBirth: "",
		});
		setTempYears(0);
		setTempMonths(0);
		setIsApproxOpen(false);
	}, [setMultipleFields]);

	const handleDateSelect = useCallback(
		(date: Date | undefined) => {
			if (date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				setMultipleFields({
					dateOfBirth: `${year}-${month}-${day}`,
					birthDateIsEstimated: false,
					estimatedYears: 0,
					estimatedMonths: 0,
				});
			} else {
				setFieldValue("dateOfBirth", "");
			}
			setIsCalendarOpen(false);
		},
		[setFieldValue, setMultipleFields],
	);

	const handleWeightChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFieldValue("weight", event.target.value);
		},
		[setFieldValue],
	);

	const handleColorChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFieldValue("color", event.target.value);
		},
		[setFieldValue],
	);

	return {
		sex: values.sex,
		sexError: stepErrors.sex,
		handleSexChange,
		reproductiveStatus: values.reproductiveStatus,
		reproductiveStatusError: stepErrors.reproductiveStatus,
		handleReproductiveStatusChange,
		weight: values.weight,
		weightError: stepErrors.weight,
		handleWeightChange,
		dateOfBirth: values.dateOfBirth,
		birthDateIsEstimated: values.birthDateIsEstimated,
		estimatedYears: values.estimatedYears,
		estimatedMonths: values.estimatedMonths,
		dateOfBirthError: stepErrors.dateOfBirth,
		selectedDobDate,
		calendarStartMonth,
		calendarEndMonth,
		defaultDobMonth,
		isCalendarOpen,
		setIsCalendarOpen,
		handleDateSelect,
		isApproxOpen,
		handleOpenApproxChange,
		tempYears,
		tempMonths,
		tempEstimatedDob,
		handleTempYearsChange,
		handleTempMonthsChange,
		handleApplyApproxAge,
		handleClearApproxAge,
		color: values.color,
		colorError: stepErrors.color,
		handleColorChange,
	};
}
