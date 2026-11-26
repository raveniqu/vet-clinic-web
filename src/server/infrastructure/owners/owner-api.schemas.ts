import { z } from "zod";

const apiOwnerCodeSchema = z
	.string()
	.max(30)
	.regex(/^OWN-[0-9]{8}-[0-9]{4}$/);

const apiIndividualPrefixSchema = z.enum(["MR", "MRS", "MS"]);
const apiJuristicPrefixSchema = z.enum(["COMMERCIAL", "NON_PROFIT", "OTHER"]);

const apiAcquisitionChannelSchema = z.enum([
	"WALK_IN",
	"LINE_OA",
	"WEB_PORTAL",
	"REFERRAL",
	"SOCIAL_MEDIA",
	"CAMPAIGN",
]);

const apiGenderSchema = z.enum(["MALE", "FEMALE", "OTHER"]).nullable();
const apiWriteGenderSchema = z.enum(["MALE", "FEMALE", "OTHER"]);

const apiSnakeCaseConsentsSchema = z.object({
	privacy_policy: z.boolean(),
	marketing: z.boolean(),
	appointment: z.boolean(),
	media: z.boolean(),
	research: z.boolean(),
});

const apiUpperCaseConsentsSchema = z
	.object({
		PRIVACY_POLICY: z.boolean(),
		MARKETING: z.boolean(),
		APPOINTMENT: z.boolean(),
		MEDIA: z.boolean(),
		RESEARCH: z.boolean(),
	})
	.transform((value) => ({
		privacy_policy: value.PRIVACY_POLICY,
		marketing: value.MARKETING,
		appointment: value.APPOINTMENT,
		media: value.MEDIA,
		research: value.RESEARCH,
	}));

export const ownerApiConsentsSchema = z.union([
	apiSnakeCaseConsentsSchema,
	apiUpperCaseConsentsSchema,
]);
export type OwnerApiConsents = z.infer<typeof ownerApiConsentsSchema>;

export const ownerApiDetailAddressSchema = z.object({
	id: z.int().positive(),
	is_default: z.boolean(),
	address_line: z.string().min(1).max(255),
	subdistrict: z.string().min(1).max(100),
	district: z.string().min(1).max(100),
	province: z.string().min(1).max(100),
	postal_code: z.string().min(1).max(10),
});
export type OwnerApiDetailAddress = z.infer<typeof ownerApiDetailAddressSchema>;

const ownerApiDetailCommonFields = {
	id: z.int().positive(),
	owner_code: apiOwnerCodeSchema,
	first_name: z.string().min(1).max(255),
	last_name: z.string().nullable(),
	tax_id: z.string().regex(/^[0-9]{13}$/),
	phone_no: z.string().min(1).max(30),
	email: z.email().max(255).nullable(),
	line_id: z.string().max(100).nullable(),
	acquisition_channel: apiAcquisitionChannelSchema.nullable(),
	addresses: z.object({
		residential: ownerApiDetailAddressSchema.nullable(),
		billing: ownerApiDetailAddressSchema.nullable(),
	}),
	consents: ownerApiConsentsSchema,
	created_at: z.iso.datetime({ offset: true }),
	updated_at: z.iso.datetime({ offset: true }),
};

export const ownerApiDetailResponseSchema = z.discriminatedUnion("type", [
	z.object({
		...ownerApiDetailCommonFields,
		type: z.literal("INDIVIDUAL"),
		prefix: apiIndividualPrefixSchema,
		date_of_birth: z.iso.date().nullable(),
		gender: apiGenderSchema,
	}),
	z.object({
		...ownerApiDetailCommonFields,
		type: z.literal("JURISTIC"),
		prefix: apiJuristicPrefixSchema,
		date_of_birth: z.iso.date().nullable(),
		gender: apiGenderSchema,
	}),
]);
export type OwnerApiDetailResponse = z.infer<
	typeof ownerApiDetailResponseSchema
>;

export const ownerApiCreatedMinimalResponseSchema = z.strictObject({
	id: z.int().positive(),
});

export const ownerApiCreatedResponseSchema = z.union([
	ownerApiDetailResponseSchema,
	ownerApiCreatedMinimalResponseSchema,
]);
export type OwnerApiCreatedResponse = z.infer<
	typeof ownerApiCreatedResponseSchema
>;

export const ownerApiAddressInputSchema = z.strictObject({
	is_default: z.boolean(),
	address_line: z.string().min(1).max(255),
	subdistrict: z.string().min(1).max(100),
	district: z.string().min(1).max(100),
	province: z.string().min(1).max(100),
	postal_code: z.string().min(1).max(10),
});
export type OwnerApiAddressInput = z.infer<typeof ownerApiAddressInputSchema>;

export const ownerApiWriteConsentsSchema = z.strictObject({
	privacy_policy: z.literal(true),
	marketing: z.boolean(),
	appointment: z.boolean(),
	media: z.boolean(),
	research: z.boolean(),
});
export type OwnerApiWriteConsents = z.infer<typeof ownerApiWriteConsentsSchema>;

const ownerApiWriteCommonFields = {
	first_name: z.string().min(1).max(255),
	tax_id: z.string().regex(/^[0-9]{13}$/),
	phone_no: z.string().min(1).max(30),
	email: z.email().max(255).nullable(),
	line_id: z.string().max(100).nullable(),
	acquisition_channel: apiAcquisitionChannelSchema,
	addresses: z.strictObject({
		residential: ownerApiAddressInputSchema,
		billing: ownerApiAddressInputSchema.nullable(),
	}),
	consents: ownerApiWriteConsentsSchema,
};

export const ownerApiWriteRequestSchema = z.discriminatedUnion("type", [
	z.strictObject({
		...ownerApiWriteCommonFields,
		type: z.literal("INDIVIDUAL"),
		prefix: apiIndividualPrefixSchema,
		last_name: z.string().min(1).max(100),
		date_of_birth: z.iso.date(),
		gender: apiWriteGenderSchema,
	}),
	z.strictObject({
		...ownerApiWriteCommonFields,
		type: z.literal("JURISTIC"),
		prefix: apiJuristicPrefixSchema,
	}),
]);
export type OwnerApiWriteRequest = z.infer<typeof ownerApiWriteRequestSchema>;

export const ownerApiDefaultAddressSchema = z.object({
	id: z.int().positive(),
	address_line: z.string().min(1).max(255),
	subdistrict: z.string().min(1).max(100),
	district: z.string().min(1).max(100),
	province: z.string().min(1).max(100),
	postal_code: z.string().min(1).max(10),
});
export type OwnerApiDefaultAddress = z.infer<
	typeof ownerApiDefaultAddressSchema
>;

const ownerApiListItemCommonFields = {
	id: z.int().positive(),
	owner_code: apiOwnerCodeSchema,
	first_name: z.string().min(1).max(255),
	last_name: z.string().nullable(),
	phone_no: z.string().min(1).max(30),
	line_id: z.string().max(100).nullable(),
	email: z.email().max(255).nullable(),
	tax_id: z.string().regex(/^([0-9]{3}X{6}[0-9]{4}|[0-9]{13})$/),
	acquisition_channel: apiAcquisitionChannelSchema.nullable(),
	created_at: z.iso.datetime({ offset: true }),
	address: ownerApiDefaultAddressSchema.nullable(),
	consents: ownerApiConsentsSchema,
};

export const ownerApiListItemSchema = z.discriminatedUnion("type", [
	z.object({
		...ownerApiListItemCommonFields,
		type: z.literal("INDIVIDUAL"),
		prefix: apiIndividualPrefixSchema,
	}),
	z.object({
		...ownerApiListItemCommonFields,
		type: z.literal("JURISTIC"),
		prefix: apiJuristicPrefixSchema,
	}),
]);
export type OwnerApiListItem = z.infer<typeof ownerApiListItemSchema>;

export const ownerApiListResponseSchema = z.object({
	page: z.int().min(1),
	limit: z.int().min(1).max(100),
	total_items: z.int().min(0),
	total_pages: z.int().min(0),
	has_next: z.boolean(),
	has_prev: z.boolean(),
	data: z.array(ownerApiListItemSchema),
});
export type OwnerApiListResponse = z.infer<typeof ownerApiListResponseSchema>;
