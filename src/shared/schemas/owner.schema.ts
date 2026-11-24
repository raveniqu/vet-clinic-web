import { z } from "zod";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, sortOrderSchema } from "./pagination.schema";

export const customerTypeEnum = z.enum(["INDIVIDUAL", "JURISTIC"]);
export type CustomerType = z.infer<typeof customerTypeEnum>;

export const genderEnum = z.enum(["Male", "Female", "LGBTQ+", "Not Specified"]);
export type Gender = z.infer<typeof genderEnum>;

export const preferredChannelEnum = z.enum(["LINE", "PHONE", "SMS", "EMAIL"]);
export type PreferredChannel = z.infer<typeof preferredChannelEnum>;

export const preferredLanguageEnum = z.enum(["EN", "TH"]);
export type PreferredLanguage = z.infer<typeof preferredLanguageEnum>;

// Step 1: Identity & Contact Schema Base Object
export const step1IdentityContactBaseSchema = z.object({
  customerType: customerTypeEnum.default("INDIVIDUAL"),
  prefix: z.string().min(1, "กรุณาเลือกหรือระบุคำนำหน้าชื่อ"),
  firstName: z.string(),
  lastName: z.string().optional().default(""),
  taxId: z.string().min(1, "กรุณาระบุเลขประจำตัวผู้เสียภาษี / เลขบัตรประชาชน"),
  dateOfBirth: z.string().optional().default(""),
  gender: genderEnum.default("Not Specified"),
  phonePrimary: z
    .string()
    .min(9, "เบอร์โทรศัพท์หลักต้องมีอย่างน้อย 9 หลัก")
    .max(15, "เบอร์โทรศัพท์ยาวเกินกว่าที่กำหนด"),
  phoneSecondary: z.string().optional().default(""),
  lineId: z.string().optional().default(""),
  email: z.string().optional().default(""),
});

function refineIdentityContact(
  data: z.infer<typeof step1IdentityContactBaseSchema>,
  ctx: z.RefinementCtx
) {
  if (data.customerType === "INDIVIDUAL") {
    if (!data.firstName || data.firstName.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "กรุณาระบุชื่อจริง",
        path: ["firstName"],
      });
    }
    if (!data.lastName || data.lastName.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "กรุณาระบุนามสกุล",
        path: ["lastName"],
      });
    }
    if (data.taxId && !/^[0-9]{13}$/.test(data.taxId)) {
      ctx.addIssue({
        code: "custom",
        message: "เลขบัตรประชาชน / เลขประจำตัวผู้เสียภาษีต้องเป็นตัวเลข 13 หลัก",
        path: ["taxId"],
      });
    }
  } else {
    if (!data.firstName || data.firstName.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "กรุณาระบุชื่อองค์กรหรือนิติบุคคล",
        path: ["firstName"],
      });
    }
    if (data.taxId && !/^0[0-9]{12}$/.test(data.taxId)) {
      ctx.addIssue({
        code: "custom",
        message: "เลขประจำตัวผู้เสียภาษีนิติบุคคลต้องเป็นตัวเลข 13 หลักและขึ้นต้นด้วย 0",
        path: ["taxId"],
      });
    }
  }
}

export const step1IdentityContactSchema =
  step1IdentityContactBaseSchema.superRefine(refineIdentityContact);

// Step 2: Address Schema
export const step2AddressSchema = z.object({
  addressLine: z.string().min(1, "กรุณาระบุที่อยู่ (บ้านเลขที่ อาคาร ซอย ถนน)"),
  subdistrict: z.string().min(1, "กรุณาระบุแขวง / ตำบล"),
  district: z.string().min(1, "กรุณาระบุเขต / อำเภอ"),
  province: z.string().min(1, "กรุณาระบุจังหวัด"),
  postalCode: z.string().regex(/^[0-9]{5}$/, "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก"),
});

// Step 3: Preferences & PDPA Schema
export const step3PreferencesPdpaSchema = z.object({
  referralSource: z.string().default("มาที่คลินิกโดยตรง"),
  preferredChannel: preferredChannelEnum.default("LINE"),
  preferredTime: z.string().default("13:00 - 17:00"),
  preferredLanguage: preferredLanguageEnum.default("TH"),
  pdpaPrivacyNotice: z.boolean().refine((val) => val === true, {
    message: "กรุณายืนยันการรับทราบนโยบายความเป็นส่วนตัว",
  }),
  pdpaReminders: z.boolean().default(true),
  pdpaMarketing: z.boolean().default(false),
  pdpaMedia: z.boolean().default(false),
});

// Full Create Owner Schema
export const createOwnerInputSchema = step1IdentityContactBaseSchema
  .extend(step2AddressSchema.shape)
  .extend(step3PreferencesPdpaSchema.shape)
  .superRefine(refineIdentityContact);

export type CreateOwnerInput = z.infer<typeof createOwnerInputSchema>;
export type Step1IdentityContactInput = z.infer<typeof step1IdentityContactSchema>;
export type Step2AddressInput = z.infer<typeof step2AddressSchema>;
export type Step3PreferencesPdpaInput = z.infer<typeof step3PreferencesPdpaSchema>;

export const ownerDtoSchema = step1IdentityContactBaseSchema
  .extend(step2AddressSchema.shape)
  .extend(step3PreferencesPdpaSchema.shape)
  .extend({
    id: z.uuid(),
    customerCode: z.string(),
    createdAt: z.string(),
  });

export type OwnerDto = z.infer<typeof ownerDtoSchema>;

// Input Query Schemas
export const getOwnerByIdSchema = z.object({
  id: z.uuid(),
});
export type GetOwnerByIdInput = z.infer<typeof getOwnerByIdSchema>;

// Update Owner Input Schema
export const updateOwnerInputSchema = createOwnerInputSchema.extend({
  id: z.uuid(),
});
export type UpdateOwnerInput = z.infer<typeof updateOwnerInputSchema>;

// Owners Route Search & Filter Schemas
export const ownerQuickFilterKeySchema = z.enum(["preferredLine", "juristic"]);
export type OwnerQuickFilterKey = z.infer<typeof ownerQuickFilterKeySchema>;

export const ownerSortFieldSchema = z.enum(["owner", "createdAt"]);
export type OwnerSortField = z.infer<typeof ownerSortFieldSchema>;

export const ownersSearchSchema = z.object({
  openAddNewForm: z.boolean().optional().catch(undefined),
  editOwnerId: z.uuid().optional().catch(undefined),
  search: z.string().trim().max(100).default("").catch(""),
  quickFilters: z.array(ownerQuickFilterKeySchema).default([]).catch([]),
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE).catch(DEFAULT_PAGE),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(DEFAULT_PAGE_SIZE)
    .catch(DEFAULT_PAGE_SIZE),
  sortBy: ownerSortFieldSchema.default("createdAt").catch("createdAt"),
  sortOrder: sortOrderSchema.default("desc").catch("desc"),
});
export type OwnersSearch = z.infer<typeof ownersSearchSchema>;
