import { z } from "zod";
import {
	createPaginatedResultSchema,
	paginationParamsSchema,
} from "./pagination.schema";

export const ownerCodeSchema = z
	.string()
	.trim()
	.max(30)
	.regex(/^OWN-[0-9]{8}-[0-9]{4}$/);
export type OwnerCodeDto = z.infer<typeof ownerCodeSchema>;

export const ownerTypeSchema = z.enum(["INDIVIDUAL", "JURISTIC"]);
export type OwnerTypeDto = z.infer<typeof ownerTypeSchema>;

export const ownerIndividualPrefixSchema = z.enum(["MR", "MRS", "MS"]);
export type OwnerIndividualPrefixDto = z.infer<
	typeof ownerIndividualPrefixSchema
>;

export const ownerJuristicPrefixSchema = z.enum([
	"COMMERCIAL",
	"NON_PROFIT",
	"OTHER",
]);
export type OwnerJuristicPrefixDto = z.infer<typeof ownerJuristicPrefixSchema>;

export const ownerPrefixSchema = z.enum([
	...ownerIndividualPrefixSchema.options,
	...ownerJuristicPrefixSchema.options,
]);
export type OwnerPrefixDto = z.infer<typeof ownerPrefixSchema>;

export const ownerGenderSchema = z.enum(["MALE", "FEMALE", "NOT_SPECIFIED"]);
export type OwnerGenderDto = z.infer<typeof ownerGenderSchema>;

export const acquisitionChannelSchema = z.enum([
	"WALK_IN",
	"LINE_OA",
	"WEB_PORTAL",
	"REFERRAL",
	"SOCIAL_MEDIA",
	"CAMPAIGN",
]);
export type AcquisitionChannelDto = z.infer<typeof acquisitionChannelSchema>;

export const ownerAddressSchema = z.object({
	addressId: z.int().positive().nullable(),
	isDefault: z.boolean(),
	addressLine: z.string().min(1).max(255),
	subdistrict: z.string().min(1).max(100),
	district: z.string().min(1).max(100),
	province: z.string().min(1).max(100),
	postalCode: z.string().min(1).max(10),
});
export type OwnerAddressDto = z.infer<typeof ownerAddressSchema>;

export const ownerSummaryAddressSchema = z.object({
	addressId: z.int().positive(),
	addressLine: z.string().min(1).max(255),
	subdistrict: z.string().min(1).max(100),
	district: z.string().min(1).max(100),
	province: z.string().min(1).max(100),
	postalCode: z.string().min(1).max(10),
});
export type OwnerSummaryAddressDto = z.infer<typeof ownerSummaryAddressSchema>;

export const ownerConsentsSchema = z.object({
	privacyPolicy: z.boolean(),
	marketing: z.boolean(),
	appointment: z.boolean(),
	media: z.boolean(),
	research: z.boolean(),
});
export type OwnerConsentsDto = z.infer<typeof ownerConsentsSchema>;

const ownerDetailsCommonFields = {
	ownerId: z.int().nonnegative(),
	ownerCode: ownerCodeSchema,
	firstName: z.string().min(1).max(255),
	lastName: z.string().max(150).nullable(),
	taxId: z.string().regex(/^[0-9]{13}$/),
	phoneNumber: z.string().min(1).max(30),
	lineId: z.string().max(100).nullable(),
	email: z.email().max(255).nullable(),
	acquisitionChannel: acquisitionChannelSchema.nullable(),
	addresses: z.object({
		residential: ownerAddressSchema.nullable(),
		billing: ownerAddressSchema.nullable(),
	}),
	consents: ownerConsentsSchema,
	createdAt: z.iso.datetime({ offset: true }),
	updatedAt: z.iso.datetime({ offset: true }),
};

export const ownerIndividualDetailsSchema = z.object({
	...ownerDetailsCommonFields,
	ownerType: z.literal("INDIVIDUAL"),
	prefix: ownerIndividualPrefixSchema,
	dateOfBirth: z.iso.date().nullable(),
	gender: ownerGenderSchema,
});

export const ownerJuristicDetailsSchema = z.object({
	...ownerDetailsCommonFields,
	ownerType: z.literal("JURISTIC"),
	prefix: ownerJuristicPrefixSchema,
	dateOfBirth: z.null(),
	gender: z.literal("NOT_SPECIFIED"),
});

export const ownerDetailsResponseSchema = z.discriminatedUnion("ownerType", [
	ownerIndividualDetailsSchema,
	ownerJuristicDetailsSchema,
]);
export type OwnerDetailsResponse = z.infer<typeof ownerDetailsResponseSchema>;

const ownerListItemCommonFields = {
	ownerId: z.int().positive(),
	ownerCode: ownerCodeSchema,
	firstName: z.string().min(1).max(255),
	lastName: z.string().max(150).nullable(),
	phoneNumber: z.string().min(1).max(30),
	lineId: z.string().max(100).nullable(),
	email: z.email().max(255).nullable(),
	taxId: z.string().regex(/^([0-9]{3}X{6}[0-9]{4}|[0-9]{13})$/),
	acquisitionChannel: acquisitionChannelSchema.nullable(),
	defaultAddress: ownerSummaryAddressSchema.nullable(),
	consents: ownerConsentsSchema,
	createdAt: z.iso.datetime({ offset: true }),
};

export const ownerListItemSchema = z.discriminatedUnion("ownerType", [
	z.object({
		...ownerListItemCommonFields,
		ownerType: z.literal("INDIVIDUAL"),
		prefix: ownerIndividualPrefixSchema,
	}),
	z.object({
		...ownerListItemCommonFields,
		ownerType: z.literal("JURISTIC"),
		prefix: ownerJuristicPrefixSchema,
	}),
]);
export type OwnerListItem = z.infer<typeof ownerListItemSchema>;

export const ownerListResponseSchema =
	createPaginatedResultSchema(ownerListItemSchema);
export type OwnerListResponse = z.infer<typeof ownerListResponseSchema>;

export const ownersSearchParamsSchema = paginationParamsSchema
	.extend({
		ownerType: ownerTypeSchema.optional(),
		acquisitionChannel: acquisitionChannelSchema.optional(),
		createdFrom: z.iso.datetime({ offset: true }).optional(),
		createdTo: z.iso.datetime({ offset: true }).optional(),
	})
	.refine(
		(value) => {
			if (!value.createdFrom || !value.createdTo) {
				return true;
			}
			return Date.parse(value.createdFrom) <= Date.parse(value.createdTo);
		},
		{
			message: "createdFrom must be less than or equal to createdTo",
			path: ["createdTo"],
		},
	);
export type OwnersSearchParams = z.infer<typeof ownersSearchParamsSchema>;

export const getOwnerByIdInputSchema = z.object({
	ownerId: z.int().positive(),
});
export type GetOwnerByIdInput = z.infer<typeof getOwnerByIdInputSchema>;

export const ownerAddressInputSchema = z.object({
	isDefault: z.boolean().default(false),
	addressLine: z.string().trim().min(1).max(255),
	subdistrict: z.string().trim().min(1).max(100),
	district: z.string().trim().min(1).max(100),
	province: z.string().trim().min(1).max(100),
	postalCode: z.string().trim().min(1).max(10),
});
export type OwnerAddressInputDto = z.infer<typeof ownerAddressInputSchema>;

export const ownerWriteAddressesSchema = z
	.object({
		residential: ownerAddressInputSchema,
		billing: ownerAddressInputSchema.nullable().default(null),
	})
	.superRefine((addresses, ctx) => {
		if (addresses.residential.isDefault && addresses.billing?.isDefault) {
			ctx.addIssue({
				code: "custom",
				message: "Only one address may be marked as default.",
				path: ["billing", "isDefault"],
			});
		}
	});
export type OwnerWriteAddressesDto = z.infer<typeof ownerWriteAddressesSchema>;

export const ownerWriteConsentsSchema = z.object({
	privacyPolicy: z.literal(true, {
		error: "Privacy policy consent must be accepted.",
	}),
	marketing: z.boolean().default(false),
	appointment: z.boolean().default(false),
	media: z.boolean().default(false),
	research: z.boolean().default(false),
});
export type OwnerWriteConsentsDto = z.infer<typeof ownerWriteConsentsSchema>;

const ownerWriteCommonFields = {
	firstName: z.string().trim().min(1).max(255),
	taxId: z
		.string()
		.trim()
		.regex(/^[0-9]{13}$/),
	phoneNumber: z.string().trim().min(1).max(30),
	lineId: z.string().trim().max(100).nullable().default(null),
	email: z.email().trim().max(255).nullable().default(null),
	acquisitionChannel: acquisitionChannelSchema,
	addresses: ownerWriteAddressesSchema,
	consents: ownerWriteConsentsSchema,
};

export const ownerWritePayloadSchema = z.discriminatedUnion("ownerType", [
	z.object({
		...ownerWriteCommonFields,
		ownerType: z.literal("INDIVIDUAL"),
		prefix: ownerIndividualPrefixSchema,
		lastName: z.string().trim().min(1).max(100),
		dateOfBirth: z.iso.date(),
		gender: ownerGenderSchema,
	}),
	z.object({
		...ownerWriteCommonFields,
		ownerType: z.literal("JURISTIC"),
		prefix: ownerJuristicPrefixSchema,
	}),
]);
export type OwnerWritePayload = z.infer<typeof ownerWritePayloadSchema>;

export const registerOwnerInputSchema = ownerWritePayloadSchema;
export type RegisterOwnerInput = z.infer<typeof registerOwnerInputSchema>;

export const updateOwnerInputSchema = z.object({
	ownerId: z.int().positive(),
	payload: ownerWritePayloadSchema,
});
export type UpdateOwnerInput = z.infer<typeof updateOwnerInputSchema>;

export const deleteOwnerInputSchema = z.object({
	ownerId: z.int().positive(),
});
export type DeleteOwnerInput = z.infer<typeof deleteOwnerInputSchema>;
