import { useQuery } from "@tanstack/react-query";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ownersListQuery } from "#/client/caches/owners/queries/get-owners.query";
import { formatThaiShortDate } from "#/client/shared/helpers/formatters";
import {
	useFormErrors,
	useFormValues,
} from "#/client/shared/hooks/use-wizard-form";
import {
	ownerGenderSchema,
	ownerPrefixSchema,
	ownerTypeSchema,
} from "#/shared/schemas/owners.schema";
import { useOwnerFormContext } from "../contexts/owner-form.context";
import { getOwnerDisplayName } from "../models/owners-table.model";

const OWNER_STEP_1_KEYS = [
	"ownerType",
	"prefix",
	"firstName",
	"lastName",
	"taxId",
	"dateOfBirth",
	"gender",
	"phoneNumber",
	"lineId",
	"email",
] as const;

function parseLocalCalendarDate(isoDate: string): Date | undefined {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
	if (!match) return undefined;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const parsed = new Date(year, month - 1, day);
	return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function useDebouncedValue(value: string, delayMs: number): string {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounced(value);
		}, delayMs);
		return () => clearTimeout(timer);
	}, [value, delayMs]);

	return debounced;
}

export function useOwnerIdentityContactForm() {
	const {
		form,
		isOpen,
		isEdit,
		editingOwnerId,
		conflictBanner,
		setFieldValue,
	} = useOwnerFormContext();
	const values = useFormValues(form, OWNER_STEP_1_KEYS);
	const errors = useFormErrors(form, OWNER_STEP_1_KEYS);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const trimmedPhone = values.phoneNumber.trim();
	const trimmedTaxId = values.taxId.trim();
	const debouncedPhone = useDebouncedValue(trimmedPhone, 400);
	const debouncedTaxId = useDebouncedValue(trimmedTaxId, 400);

	const isPhoneSearchEnabled = isOpen && /^[0-9]{9,10}$/.test(debouncedPhone);
	const isTaxIdSearchEnabled = isOpen && /^[0-9]{13}$/.test(debouncedTaxId);

	const phoneCheckQuery = useQuery({
		...ownersListQuery({
			page: 1,
			limit: 5,
			search: debouncedPhone,
			sort: "created_at:desc",
		}),
		enabled: isPhoneSearchEnabled,
		staleTime: 10_000,
	});

	const taxIdCheckQuery = useQuery({
		...ownersListQuery({
			page: 1,
			limit: 5,
			search: debouncedTaxId,
			sort: "created_at:desc",
		}),
		enabled: isTaxIdSearchEnabled,
		staleTime: 10_000,
	});

	const duplicatePhoneOwner = useMemo(() => {
		if (!isPhoneSearchEnabled || !phoneCheckQuery.data) return null;
		const matched = phoneCheckQuery.data.data.find(
			(item) =>
				item.phoneNumber === debouncedPhone &&
				(!isEdit || item.ownerId !== editingOwnerId),
		);
		if (!matched) return null;
		return {
			displayName: getOwnerDisplayName(matched),
			ownerCode: matched.ownerCode,
		};
	}, [
		isPhoneSearchEnabled,
		phoneCheckQuery.data,
		debouncedPhone,
		isEdit,
		editingOwnerId,
	]);

	const duplicateTaxIdOwner = useMemo(() => {
		if (!isTaxIdSearchEnabled || !taxIdCheckQuery.data) return null;
		const matched = taxIdCheckQuery.data.data.find((item) => {
			if (isEdit && item.ownerId === editingOwnerId) return false;
			if (item.taxId === debouncedTaxId) return true;
			// Handle INDIVIDUAL masked taxId (e.g. 106XXXXXX7296) matched via server HMAC-SHA256 blind index
			return (
				item.taxId.includes("X") &&
				item.taxId.slice(0, 3) === debouncedTaxId.slice(0, 3) &&
				item.taxId.slice(-4) === debouncedTaxId.slice(-4)
			);
		});
		if (!matched) return null;
		return {
			displayName: getOwnerDisplayName(matched),
			ownerCode: matched.ownerCode,
		};
	}, [
		isTaxIdSearchEnabled,
		taxIdCheckQuery.data,
		debouncedTaxId,
		isEdit,
		editingOwnerId,
	]);

	const isJuristic = values.ownerType === "JURISTIC";

	const selectedDobDate = useMemo(
		() =>
			values.dateOfBirth
				? parseLocalCalendarDate(values.dateOfBirth)
				: undefined,
		[values.dateOfBirth],
	);

	const formattedDobLabel = useMemo(() => {
		if (!values.dateOfBirth) return null;
		return formatThaiShortDate(values.dateOfBirth, "");
	}, [values.dateOfBirth]);

	const calendarStartMonth = useMemo(() => new Date(1940, 0), []);
	const calendarEndMonth = useMemo(() => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth());
	}, []);
	const defaultDobMonth = useMemo(
		() => selectedDobDate ?? new Date(new Date().getFullYear() - 25, 0),
		[selectedDobDate],
	);

	const handleOwnerTypeChange = useCallback(
		(nextValue: unknown) => {
			if (isEdit) return;
			const parsed = ownerTypeSchema.safeParse(nextValue);
			if (parsed.success) {
				setFieldValue("ownerType", parsed.data);
			}
		},
		[isEdit, setFieldValue],
	);

	const handlePrefixChange = useCallback(
		(nextValue: string | null) => {
			const parsed = ownerPrefixSchema.safeParse(nextValue);
			if (parsed.success) {
				setFieldValue("prefix", parsed.data);
			}
		},
		[setFieldValue],
	);

	const handleFirstNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFieldValue("firstName", event.target.value);
		},
		[setFieldValue],
	);

	const handleLastNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFieldValue("lastName", event.target.value);
		},
		[setFieldValue],
	);

	const handleTaxIdChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFieldValue(
				"taxId",
				event.target.value.replace(/\D/g, "").slice(0, 13),
			);
		},
		[setFieldValue],
	);

	const handleDobSelect = useCallback(
		(date: Date | undefined) => {
			if (date) {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				setFieldValue("dateOfBirth", `${year}-${month}-${day}`);
			} else {
				setFieldValue("dateOfBirth", "");
			}
			setIsCalendarOpen(false);
		},
		[setFieldValue],
	);

	const handleGenderChange = useCallback(
		(nextValue: string | null) => {
			const parsed = ownerGenderSchema.safeParse(nextValue);
			if (parsed.success) {
				setFieldValue("gender", parsed.data);
			}
		},
		[setFieldValue],
	);

	const handlePhoneNumberChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFieldValue(
				"phoneNumber",
				event.target.value.replace(/\D/g, "").slice(0, 10),
			);
		},
		[setFieldValue],
	);

	const handleLineIdChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFieldValue("lineId", event.target.value);
		},
		[setFieldValue],
	);

	const handleEmailChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setFieldValue("email", event.target.value);
		},
		[setFieldValue],
	);

	return {
		values,
		errors,
		isEdit,
		isJuristic,
		conflictBanner,
		duplicatePhoneOwner,
		duplicateTaxIdOwner,
		isCalendarOpen,
		setIsCalendarOpen,
		selectedDobDate,
		formattedDobLabel,
		calendarStartMonth,
		calendarEndMonth,
		defaultDobMonth,
		handleOwnerTypeChange,
		handlePrefixChange,
		handleFirstNameChange,
		handleLastNameChange,
		handleTaxIdChange,
		handleDobSelect,
		handleGenderChange,
		handlePhoneNumberChange,
		handleLineIdChange,
		handleEmailChange,
	};
}
