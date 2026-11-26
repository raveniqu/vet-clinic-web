import { useCallback, useMemo } from "react";
import type { ThaiAddressFieldValues } from "#/client/shared/hooks/use-thai-address-fields";
import { useThaiAddressFields } from "#/client/shared/hooks/use-thai-address-fields";
import {
	useFormErrors,
	useFormValues,
} from "#/client/shared/hooks/use-wizard-form";
import { useOwnerFormContext } from "../contexts/owner-form.context";
import type { DefaultAddressType } from "../models/owner-form.model";

const OWNER_STEP_2_KEYS = [
	"residentialAddressLine",
	"residentialSubdistrict",
	"residentialDistrict",
	"residentialProvince",
	"residentialPostalCode",
	"hasBillingAddress",
	"billingAddressLine",
	"billingSubdistrict",
	"billingDistrict",
	"billingProvince",
	"billingPostalCode",
	"defaultAddressType",
] as const;

type OwnerAddressFormFieldKey = Exclude<
	(typeof OWNER_STEP_2_KEYS)[number],
	"hasBillingAddress" | "defaultAddressType"
>;

const RESIDENTIAL_FIELD_MAP: Record<
	keyof ThaiAddressFieldValues,
	OwnerAddressFormFieldKey
> = {
	addressLine: "residentialAddressLine",
	subdistrict: "residentialSubdistrict",
	district: "residentialDistrict",
	province: "residentialProvince",
	postalCode: "residentialPostalCode",
};

const BILLING_FIELD_MAP: Record<
	keyof ThaiAddressFieldValues,
	OwnerAddressFormFieldKey
> = {
	addressLine: "billingAddressLine",
	subdistrict: "billingSubdistrict",
	district: "billingDistrict",
	province: "billingProvince",
	postalCode: "billingPostalCode",
};

export function useOwnerAddressForm() {
	const { form, setFieldValue, setMultipleFields } = useOwnerFormContext();
	const values = useFormValues(form, OWNER_STEP_2_KEYS);
	const errors = useFormErrors(form, OWNER_STEP_2_KEYS);

	const residentialValues = useMemo<ThaiAddressFieldValues>(
		() => ({
			addressLine: values.residentialAddressLine,
			subdistrict: values.residentialSubdistrict,
			district: values.residentialDistrict,
			province: values.residentialProvince,
			postalCode: values.residentialPostalCode,
		}),
		[
			values.residentialAddressLine,
			values.residentialSubdistrict,
			values.residentialDistrict,
			values.residentialProvince,
			values.residentialPostalCode,
		],
	);

	const residentialErrors = useMemo(
		() => ({
			addressLine: errors.residentialAddressLine,
			subdistrict: errors.residentialSubdistrict,
			district: errors.residentialDistrict,
			province: errors.residentialProvince,
			postalCode: errors.residentialPostalCode,
		}),
		[
			errors.residentialAddressLine,
			errors.residentialSubdistrict,
			errors.residentialDistrict,
			errors.residentialProvince,
			errors.residentialPostalCode,
		],
	);

	const handleResidentialFieldChange = useCallback(
		<TKey extends keyof ThaiAddressFieldValues>(
			field: TKey,
			value: ThaiAddressFieldValues[TKey],
		) => {
			setFieldValue<OwnerAddressFormFieldKey>(
				RESIDENTIAL_FIELD_MAP[field],
				value,
			);
		},
		[setFieldValue],
	);

	const handleResidentialPatch = useCallback(
		(patch: Partial<ThaiAddressFieldValues>) => {
			setMultipleFields({
				...(patch.addressLine !== undefined
					? { residentialAddressLine: patch.addressLine }
					: {}),
				...(patch.subdistrict !== undefined
					? { residentialSubdistrict: patch.subdistrict }
					: {}),
				...(patch.district !== undefined
					? { residentialDistrict: patch.district }
					: {}),
				...(patch.province !== undefined
					? { residentialProvince: patch.province }
					: {}),
				...(patch.postalCode !== undefined
					? { residentialPostalCode: patch.postalCode }
					: {}),
			});
		},
		[setMultipleFields],
	);

	const billingValues = useMemo<ThaiAddressFieldValues>(
		() => ({
			addressLine: values.billingAddressLine,
			subdistrict: values.billingSubdistrict,
			district: values.billingDistrict,
			province: values.billingProvince,
			postalCode: values.billingPostalCode,
		}),
		[
			values.billingAddressLine,
			values.billingSubdistrict,
			values.billingDistrict,
			values.billingProvince,
			values.billingPostalCode,
		],
	);

	const billingErrors = useMemo(
		() => ({
			addressLine: errors.billingAddressLine,
			subdistrict: errors.billingSubdistrict,
			district: errors.billingDistrict,
			province: errors.billingProvince,
			postalCode: errors.billingPostalCode,
		}),
		[
			errors.billingAddressLine,
			errors.billingSubdistrict,
			errors.billingDistrict,
			errors.billingProvince,
			errors.billingPostalCode,
		],
	);

	const handleBillingFieldChange = useCallback(
		<TKey extends keyof ThaiAddressFieldValues>(
			field: TKey,
			value: ThaiAddressFieldValues[TKey],
		) => {
			setFieldValue<OwnerAddressFormFieldKey>(BILLING_FIELD_MAP[field], value);
		},
		[setFieldValue],
	);

	const handleBillingPatch = useCallback(
		(patch: Partial<ThaiAddressFieldValues>) => {
			setMultipleFields({
				...(patch.addressLine !== undefined
					? { billingAddressLine: patch.addressLine }
					: {}),
				...(patch.subdistrict !== undefined
					? { billingSubdistrict: patch.subdistrict }
					: {}),
				...(patch.district !== undefined
					? { billingDistrict: patch.district }
					: {}),
				...(patch.province !== undefined
					? { billingProvince: patch.province }
					: {}),
				...(patch.postalCode !== undefined
					? { billingPostalCode: patch.postalCode }
					: {}),
			});
		},
		[setMultipleFields],
	);

	const residentialController = useThaiAddressFields({
		values: residentialValues,
		errors: residentialErrors,
		onChangeField: handleResidentialFieldChange,
		onPatchFields: handleResidentialPatch,
	});

	const billingController = useThaiAddressFields({
		values: billingValues,
		errors: billingErrors,
		onChangeField: handleBillingFieldChange,
		onPatchFields: handleBillingPatch,
	});

	const handleHasBillingAddressChange = useCallback(
		(checked: boolean) => {
			setFieldValue("hasBillingAddress", checked);
		},
		[setFieldValue],
	);

	const handleCopyResidentialToBilling = useCallback(() => {
		setMultipleFields({
			billingAddressLine: values.residentialAddressLine,
			billingSubdistrict: values.residentialSubdistrict,
			billingDistrict: values.residentialDistrict,
			billingProvince: values.residentialProvince,
			billingPostalCode: values.residentialPostalCode,
		});
	}, [
		setMultipleFields,
		values.residentialAddressLine,
		values.residentialSubdistrict,
		values.residentialDistrict,
		values.residentialProvince,
		values.residentialPostalCode,
	]);

	const handleDefaultAddressTypeChange = useCallback(
		(value: unknown) => {
			if (value === "residential" || value === "billing") {
				setFieldValue("defaultAddressType", value as DefaultAddressType);
			}
		},
		[setFieldValue],
	);

	return {
		hasBillingAddress: values.hasBillingAddress,
		defaultAddressType: values.defaultAddressType,
		residentialController,
		billingController,
		handleHasBillingAddressChange,
		handleCopyResidentialToBilling,
		handleDefaultAddressTypeChange,
	};
}
