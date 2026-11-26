import { z } from "zod";
import type { WizardStepNumber } from "#/client/shared/hooks/use-wizard-form";
import type {
	AcquisitionChannelDto,
	OwnerDetailsResponse,
	OwnerGenderDto,
	OwnerIndividualPrefixDto,
	OwnerJuristicPrefixDto,
	OwnerPrefixDto,
	OwnerTypeDto,
	RegisterOwnerInput,
} from "#/shared/schemas/owners.schema";
import {
	acquisitionChannelSchema,
	ownerGenderSchema,
	ownerIndividualPrefixSchema,
	ownerJuristicPrefixSchema,
	ownerPrefixSchema,
	ownerTypeSchema,
	registerOwnerInputSchema,
} from "#/shared/schemas/owners.schema";

export type DefaultAddressType = "residential" | "billing";

export interface OwnerFormValues extends Record<string, unknown> {
	ownerType: OwnerTypeDto;
	prefix: OwnerPrefixDto;
	firstName: string;
	lastName: string;
	taxId: string;
	dateOfBirth: string;
	gender: OwnerGenderDto;
	phoneNumber: string;
	lineId: string;
	email: string;
	residentialAddressLine: string;
	residentialSubdistrict: string;
	residentialDistrict: string;
	residentialProvince: string;
	residentialPostalCode: string;
	hasBillingAddress: boolean;
	billingAddressLine: string;
	billingSubdistrict: string;
	billingDistrict: string;
	billingProvince: string;
	billingPostalCode: string;
	defaultAddressType: DefaultAddressType;
	acquisitionChannel: AcquisitionChannelDto;
	privacyPolicy: boolean;
	appointment: boolean;
	marketing: boolean;
	media: boolean;
	research: boolean;
}

export const INDIVIDUAL_PREFIX_SELECT_ITEMS: readonly {
	value: OwnerIndividualPrefixDto;
	label: string;
}[] = [
	{ value: "MR", label: "นาย" },
	{ value: "MRS", label: "นาง" },
	{ value: "MS", label: "นางสาว" },
] as const;

export const JURISTIC_PREFIX_SELECT_ITEMS: readonly {
	value: OwnerJuristicPrefixDto;
	label: string;
}[] = [
	{ value: "COMMERCIAL", label: "บริษัท / ห้างหุ้นส่วน" },
	{ value: "NON_PROFIT", label: "มูลนิธิ / สมาคม" },
	{ value: "OTHER", label: "นิติบุคคลอื่น ๆ" },
] as const;

export const GENDER_SELECT_ITEMS: readonly {
	value: OwnerGenderDto;
	label: string;
}[] = [
	{ value: "NOT_SPECIFIED", label: "ไม่ระบุ" },
	{ value: "MALE", label: "ชาย" },
	{ value: "FEMALE", label: "หญิง" },
] as const;

export const ACQUISITION_CHANNEL_SELECT_ITEMS: readonly {
	value: AcquisitionChannelDto;
	label: string;
}[] = [
	{ value: "WALK_IN", label: "มาที่คลินิกโดยตรง (Walk-in)" },
	{ value: "LINE_OA", label: "LINE Official Account" },
	{ value: "WEB_PORTAL", label: "เว็บไซต์ / พอร์ทัลคลินิก" },
	{ value: "REFERRAL", label: "เพื่อนหรือคนรู้จักแนะนำ" },
	{ value: "SOCIAL_MEDIA", label: "โซเชียลมีเดีย (Facebook / Instagram)" },
	{ value: "CAMPAIGN", label: "แคมเปญ / โฆษณา" },
] as const;

const INDIVIDUAL_PREFIX_SET = new Set<string>(
	ownerIndividualPrefixSchema.options,
);
const JURISTIC_PREFIX_SET = new Set<string>(ownerJuristicPrefixSchema.options);

const TAX_ID_REGEX = /^[0-9]{13}$/;
const THAI_PHONE_REGEX = /^[0-9]{9,10}$/;
const OPTIONAL_EMAIL_SCHEMA = z.email({ error: "รูปแบบอีเมลไม่ถูกต้อง" }).max(255);
const CALENDAR_DATE_SCHEMA = z.iso.date({ error: "กรุณาเลือกวันเกิดให้ถูกต้อง" });

export const INITIAL_OWNER_FORM_VALUES: OwnerFormValues = {
	ownerType: "INDIVIDUAL",
	prefix: "MR",
	firstName: "",
	lastName: "",
	taxId: "",
	dateOfBirth: "",
	gender: "NOT_SPECIFIED",
	phoneNumber: "",
	lineId: "",
	email: "",
	residentialAddressLine: "",
	residentialSubdistrict: "",
	residentialDistrict: "",
	residentialProvince: "",
	residentialPostalCode: "",
	hasBillingAddress: false,
	billingAddressLine: "",
	billingSubdistrict: "",
	billingDistrict: "",
	billingProvince: "",
	billingPostalCode: "",
	defaultAddressType: "residential",
	acquisitionChannel: "WALK_IN",
	privacyPolicy: true,
	appointment: false,
	marketing: false,
	media: false,
	research: false,
};

function requireNonEmptyField(
	value: string,
	max: number,
	path: keyof OwnerFormValues,
	emptyMessage: string,
	maxMessage: string,
	ctx: z.RefinementCtx,
): void {
	const trimmed = value.trim();
	if (trimmed.length === 0) {
		ctx.addIssue({
			code: "custom",
			message: emptyMessage,
			path: [path],
		});
		return;
	}
	if (trimmed.length > max) {
		ctx.addIssue({
			code: "custom",
			message: maxMessage,
			path: [path],
		});
	}
}

function validateStep1Rules(
	data: Pick<
		OwnerFormValues,
		| "ownerType"
		| "prefix"
		| "firstName"
		| "lastName"
		| "taxId"
		| "dateOfBirth"
		| "gender"
		| "phoneNumber"
		| "lineId"
		| "email"
	>,
	ctx: z.RefinementCtx,
): void {
	requireNonEmptyField(
		data.firstName,
		255,
		"firstName",
		data.ownerType === "JURISTIC"
			? "กรุณากรอกชื่อองค์กร / นิติบุคคล"
			: "กรุณากรอกชื่อจริง",
		"ชื่อต้องไม่เกิน 255 ตัวอักษร",
		ctx,
	);

	if (!TAX_ID_REGEX.test(data.taxId.trim())) {
		ctx.addIssue({
			code: "custom",
			message: "กรุณากรอกเลขประจำตัวผู้เสียภาษี / บัตรประชาชน 13 หลักให้ครบถ้วน",
			path: ["taxId"],
		});
	}

	if (!THAI_PHONE_REGEX.test(data.phoneNumber.trim())) {
		ctx.addIssue({
			code: "custom",
			message: "กรุณากรอกเบอร์โทรศัพท์ 9-10 หลักให้ถูกต้อง",
			path: ["phoneNumber"],
		});
	}

	if (data.lineId.trim().length > 100) {
		ctx.addIssue({
			code: "custom",
			message: "LINE ID ต้องไม่เกิน 100 ตัวอักษร",
			path: ["lineId"],
		});
	}

	const trimmedEmail = data.email.trim();
	if (trimmedEmail.length > 0) {
		const emailCheck = OPTIONAL_EMAIL_SCHEMA.safeParse(trimmedEmail);
		if (!emailCheck.success) {
			ctx.addIssue({
				code: "custom",
				message: "รูปแบบอีเมลไม่ถูกต้อง",
				path: ["email"],
			});
		}
	}

	if (data.ownerType === "INDIVIDUAL") {
		if (!INDIVIDUAL_PREFIX_SET.has(data.prefix)) {
			ctx.addIssue({
				code: "custom",
				message: "กรุณาเลือกคำนำหน้าชื่อสำหรับบุคคลธรรมดา",
				path: ["prefix"],
			});
		}

		requireNonEmptyField(
			data.lastName,
			100,
			"lastName",
			"กรุณากรอกนามสกุล",
			"นามสกุลต้องไม่เกิน 100 ตัวอักษร",
			ctx,
		);

		const dobResult = CALENDAR_DATE_SCHEMA.safeParse(data.dateOfBirth.trim());
		if (!dobResult.success) {
			ctx.addIssue({
				code: "custom",
				message: "กรุณาเลือกวันเกิด",
				path: ["dateOfBirth"],
			});
		}
		return;
	}

	if (!JURISTIC_PREFIX_SET.has(data.prefix)) {
		ctx.addIssue({
			code: "custom",
			message: "กรุณาเลือกประเภทองค์กร / คำนำหน้านิติบุคคล",
			path: ["prefix"],
		});
	}
}

function validateStep2Rules(
	data: Pick<
		OwnerFormValues,
		| "residentialAddressLine"
		| "residentialSubdistrict"
		| "residentialDistrict"
		| "residentialProvince"
		| "residentialPostalCode"
		| "hasBillingAddress"
		| "billingAddressLine"
		| "billingSubdistrict"
		| "billingDistrict"
		| "billingProvince"
		| "billingPostalCode"
	>,
	ctx: z.RefinementCtx,
): void {
	requireNonEmptyField(
		data.residentialAddressLine,
		255,
		"residentialAddressLine",
		"กรุณากรอกรายละเอียดที่อยู่ปัจจุบัน",
		"ที่อยู่ต้องไม่เกิน 255 ตัวอักษร",
		ctx,
	);
	requireNonEmptyField(
		data.residentialSubdistrict,
		100,
		"residentialSubdistrict",
		"กรุณาระบุแขวง / ตำบล",
		"แขวง / ตำบลต้องไม่เกิน 100 ตัวอักษร",
		ctx,
	);
	requireNonEmptyField(
		data.residentialDistrict,
		100,
		"residentialDistrict",
		"กรุณาระบุเขต / อำเภอ",
		"เขต / อำเภอต้องไม่เกิน 100 ตัวอักษร",
		ctx,
	);
	requireNonEmptyField(
		data.residentialProvince,
		100,
		"residentialProvince",
		"กรุณาระบุจังหวัด",
		"จังหวัดต้องไม่เกิน 100 ตัวอักษร",
		ctx,
	);
	requireNonEmptyField(
		data.residentialPostalCode,
		10,
		"residentialPostalCode",
		"กรุณากรอกรหัสไปรษณีย์",
		"รหัสไปรษณีย์ต้องไม่เกิน 10 ตัวอักษร",
		ctx,
	);

	if (!data.hasBillingAddress) {
		return;
	}

	requireNonEmptyField(
		data.billingAddressLine,
		255,
		"billingAddressLine",
		"กรุณากรอกรายละเอียดที่อยู่สำหรับออกใบเสร็จ",
		"ที่อยู่ออกใบเสร็จต้องไม่เกิน 255 ตัวอักษร",
		ctx,
	);
	requireNonEmptyField(
		data.billingSubdistrict,
		100,
		"billingSubdistrict",
		"กรุณาระบุแขวง / ตำบลของที่อยู่ออกใบเสร็จ",
		"แขวง / ตำบลต้องไม่เกิน 100 ตัวอักษร",
		ctx,
	);
	requireNonEmptyField(
		data.billingDistrict,
		100,
		"billingDistrict",
		"กรุณาระบุเขต / อำเภอของที่อยู่ออกใบเสร็จ",
		"เขต / อำเภอต้องไม่เกิน 100 ตัวอักษร",
		ctx,
	);
	requireNonEmptyField(
		data.billingProvince,
		100,
		"billingProvince",
		"กรุณาระบุจังหวัดของที่อยู่ออกใบเสร็จ",
		"จังหวัดต้องไม่เกิน 100 ตัวอักษร",
		ctx,
	);
	requireNonEmptyField(
		data.billingPostalCode,
		10,
		"billingPostalCode",
		"กรุณากรอกรหัสไปรษณีย์ของที่อยู่ออกใบเสร็จ",
		"รหัสไปรษณีย์ต้องไม่เกิน 10 ตัวอักษร",
		ctx,
	);
}

function validateStep3Rules(
	data: Pick<OwnerFormValues, "privacyPolicy">,
	ctx: z.RefinementCtx,
): void {
	if (!data.privacyPolicy) {
		ctx.addIssue({
			code: "custom",
			message: "ต้องยอมรับนโยบายความเป็นส่วนตัวก่อนบันทึกข้อมูล",
			path: ["privacyPolicy"],
		});
	}
}

const step1Shape = {
	ownerType: ownerTypeSchema,
	prefix: ownerPrefixSchema,
	firstName: z.string(),
	lastName: z.string(),
	taxId: z.string(),
	dateOfBirth: z.string(),
	gender: ownerGenderSchema,
	phoneNumber: z.string(),
	lineId: z.string(),
	email: z.string(),
};

const step2Shape = {
	residentialAddressLine: z.string(),
	residentialSubdistrict: z.string(),
	residentialDistrict: z.string(),
	residentialProvince: z.string(),
	residentialPostalCode: z.string(),
	hasBillingAddress: z.boolean(),
	billingAddressLine: z.string(),
	billingSubdistrict: z.string(),
	billingDistrict: z.string(),
	billingProvince: z.string(),
	billingPostalCode: z.string(),
	defaultAddressType: z.enum(["residential", "billing"]),
};

const step3Shape = {
	acquisitionChannel: acquisitionChannelSchema,
	privacyPolicy: z.boolean(),
	appointment: z.boolean(),
	marketing: z.boolean(),
	media: z.boolean(),
	research: z.boolean(),
};

export const ownerStep1FormSchema = z
	.object(step1Shape)
	.superRefine(validateStep1Rules);

export const ownerStep2FormSchema = z
	.object(step2Shape)
	.superRefine(validateStep2Rules);

export const ownerStep3FormSchema = z
	.object(step3Shape)
	.superRefine(validateStep3Rules);

export const ownerFormFullSchema: z.ZodType<OwnerFormValues> = z
	.object({
		...step1Shape,
		...step2Shape,
		...step3Shape,
	})
	.superRefine((data, ctx) => {
		validateStep1Rules(data, ctx);
		validateStep2Rules(data, ctx);
		validateStep3Rules(data, ctx);
	});

export const OWNER_STEP_SCHEMAS = {
	1: ownerStep1FormSchema,
	2: ownerStep2FormSchema,
	3: ownerStep3FormSchema,
} as const;

const OWNER_STEP_1_FIELDS = new Set<string>(Object.keys(step1Shape));
const OWNER_STEP_2_FIELDS = new Set<string>(Object.keys(step2Shape));

export function resolveOwnerFieldStep(fieldKey: string): WizardStepNumber {
	if (OWNER_STEP_1_FIELDS.has(fieldKey)) return 1;
	if (OWNER_STEP_2_FIELDS.has(fieldKey)) return 2;
	return 3;
}

export function applyOwnerFormFieldSideEffects<
	TField extends keyof OwnerFormValues,
>(
	prev: OwnerFormValues,
	field: TField,
	value: OwnerFormValues[TField],
): OwnerFormValues {
	const next: OwnerFormValues = { ...prev, [field]: value };

	if (field === "ownerType") {
		if (value === "JURISTIC") {
			next.lastName = "";
			next.dateOfBirth = "";
			next.gender = "NOT_SPECIFIED";
			if (!JURISTIC_PREFIX_SET.has(prev.prefix)) {
				next.prefix = "COMMERCIAL";
			}
		} else if (value === "INDIVIDUAL") {
			if (!INDIVIDUAL_PREFIX_SET.has(prev.prefix)) {
				next.prefix = "MR";
			}
		}
	}

	if (field === "hasBillingAddress" && value === false) {
		next.defaultAddressType = "residential";
	}

	return next;
}

export function mapOwnerDetailsToFormValues(
	owner: OwnerDetailsResponse,
): OwnerFormValues {
	const residential = owner.addresses.residential;
	const billing = owner.addresses.billing;
	const hasBillingAddress = Boolean(billing);

	return {
		ownerType: owner.ownerType,
		prefix: owner.prefix,
		firstName: owner.firstName,
		lastName: owner.lastName ?? "",
		taxId: owner.taxId,
		dateOfBirth: owner.dateOfBirth ?? "",
		gender: owner.gender,
		phoneNumber: owner.phoneNumber,
		lineId: owner.lineId ?? "",
		email: owner.email ?? "",
		residentialAddressLine: residential?.addressLine ?? "",
		residentialSubdistrict: residential?.subdistrict ?? "",
		residentialDistrict: residential?.district ?? "",
		residentialProvince: residential?.province ?? "",
		residentialPostalCode: residential?.postalCode ?? "",
		hasBillingAddress,
		billingAddressLine: billing?.addressLine ?? "",
		billingSubdistrict: billing?.subdistrict ?? "",
		billingDistrict: billing?.district ?? "",
		billingProvince: billing?.province ?? "",
		billingPostalCode: billing?.postalCode ?? "",
		defaultAddressType:
			hasBillingAddress && billing?.isDefault ? "billing" : "residential",
		acquisitionChannel: owner.acquisitionChannel ?? "WALK_IN",
		privacyPolicy: true,
		appointment: owner.consents.appointment,
		marketing: owner.consents.marketing,
		media: owner.consents.media,
		research: owner.consents.research,
	};
}

export function mapFormValuesToWritePayload(
	values: OwnerFormValues,
): RegisterOwnerInput {
	const trimmedLineId = values.lineId.trim();
	const trimmedEmail = values.email.trim();
	const billingIsDefault =
		values.hasBillingAddress && values.defaultAddressType === "billing";

	const addresses = {
		residential: {
			isDefault: !billingIsDefault,
			addressLine: values.residentialAddressLine.trim(),
			subdistrict: values.residentialSubdistrict.trim(),
			district: values.residentialDistrict.trim(),
			province: values.residentialProvince.trim(),
			postalCode: values.residentialPostalCode.trim(),
		},
		billing: values.hasBillingAddress
			? {
					isDefault: billingIsDefault,
					addressLine: values.billingAddressLine.trim(),
					subdistrict: values.billingSubdistrict.trim(),
					district: values.billingDistrict.trim(),
					province: values.billingProvince.trim(),
					postalCode: values.billingPostalCode.trim(),
				}
			: null,
	};

	const commonPayload = {
		firstName: values.firstName.trim(),
		taxId: values.taxId.trim(),
		phoneNumber: values.phoneNumber.trim(),
		lineId: trimmedLineId.length > 0 ? trimmedLineId : null,
		email: trimmedEmail.length > 0 ? trimmedEmail : null,
		acquisitionChannel: values.acquisitionChannel,
		addresses,
		consents: {
			privacyPolicy: true as const,
			marketing: values.marketing,
			appointment: values.appointment,
			media: values.media,
			research: values.research,
		},
	};

	if (values.ownerType === "INDIVIDUAL") {
		const individualPrefix = ownerIndividualPrefixSchema.parse(values.prefix);
		return registerOwnerInputSchema.parse({
			...commonPayload,
			ownerType: "INDIVIDUAL",
			prefix: individualPrefix,
			lastName: values.lastName.trim(),
			dateOfBirth: values.dateOfBirth.trim(),
			gender: values.gender,
		});
	}

	const juristicPrefix = ownerJuristicPrefixSchema.parse(values.prefix);
	return registerOwnerInputSchema.parse({
		...commonPayload,
		ownerType: "JURISTIC",
		prefix: juristicPrefix,
	});
}

export interface OwnerConflictFieldError {
	readonly field: "taxId" | "phoneNumber" | "email" | "lineId";
	readonly message: string;
}

export function parseOwnerConflictError(
	detail: string,
): OwnerConflictFieldError | null {
	const normalized = detail.toLowerCase();

	if (normalized.includes("tax_id") || normalized.includes("taxid")) {
		return {
			field: "taxId",
			message: "เลขประจำตัวผู้เสียภาษีนี้มีอยู่ในระบบแล้ว",
		};
	}
	if (normalized.includes("phone_no") || normalized.includes("phone")) {
		return {
			field: "phoneNumber",
			message: "เบอร์โทรศัพท์นี้มีอยู่ในระบบแล้ว",
		};
	}
	if (normalized.includes("email")) {
		return {
			field: "email",
			message: "อีเมลนี้มีอยู่ในระบบแล้ว",
		};
	}
	if (normalized.includes("line_id") || normalized.includes("lineid")) {
		return {
			field: "lineId",
			message: "LINE ID นี้มีอยู่ในระบบแล้ว",
		};
	}

	return null;
}
