import type { WizardStepNumber } from "#/client/shared/hooks/use-wizard-form";
import {
  step1IdentityContactSchema,
  step2AddressSchema,
  step3PreferencesPdpaSchema,
} from "#/shared/schemas/owner.schema";
import type {
  CreateOwnerInput,
  Gender,
  OwnerDto,
  PreferredChannel,
  PreferredLanguage,
} from "#/shared/schemas/owner.schema";

export const INDIVIDUAL_PREFIX_SELECT_ITEMS = [
  { value: "คุณ", label: "คุณ" },
  { value: "นาย", label: "นาย" },
  { value: "นาง", label: "นาง" },
  { value: "นางสาว", label: "นางสาว" },
  { value: "ดร.", label: "ดร." },
] as const;

export const JURISTIC_PREFIX_SELECT_ITEMS = [
  { value: "บริษัท", label: "บริษัท" },
  { value: "ห้างหุ้นส่วน", label: "ห้างหุ้นส่วน" },
  { value: "มูลนิธิ", label: "มูลนิธิ" },
] as const;

const JURISTIC_PREFIX_SET = new Set<string>(JURISTIC_PREFIX_SELECT_ITEMS.map((item) => item.value));

export const GENDER_SELECT_ITEMS: readonly { value: Gender; label: string }[] = [
  { value: "Not Specified", label: "ไม่ระบุ" },
  { value: "Female", label: "หญิง" },
  { value: "Male", label: "ชาย" },
  { value: "LGBTQ+", label: "LGBTQ+" },
] as const;

export const REFERRAL_SOURCE_SELECT_ITEMS = [
  { value: "มาที่คลินิกโดยตรง", label: "มาที่คลินิกโดยตรง" },
  { value: "เพื่อนหรือคนรู้จักแนะนำ", label: "เพื่อนหรือคนรู้จักแนะนำ" },
  { value: "Facebook / โซเชียลมีเดีย", label: "Facebook / โซเชียลมีเดีย" },
  { value: "Google Search / Google Maps", label: "Google Search / Google Maps" },
  { value: "คลินิกหรือองค์กรพันธมิตร", label: "คลินิกหรือองค์กรพันธมิตร" },
] as const;

export const PREFERRED_CHANNEL_SELECT_ITEMS: readonly { value: PreferredChannel; label: string }[] =
  [
    { value: "LINE", label: "LINE Official" },
    { value: "PHONE", label: "โทรศัพท์" },
    { value: "SMS", label: "ข้อความ SMS" },
    { value: "EMAIL", label: "อีเมล" },
  ] as const;

export const PREFERRED_TIME_SELECT_ITEMS = [
  { value: "09:00 - 12:00", label: "ช่วงเช้า (09:00 - 12:00)" },
  { value: "13:00 - 17:00", label: "ช่วงบ่าย (13:00 - 17:00)" },
  { value: "17:00 - 20:00", label: "ช่วงเย็น (17:00 - 20:00)" },
] as const;

export const PREFERRED_LANGUAGE_SELECT_ITEMS: readonly {
  value: PreferredLanguage;
  label: string;
}[] = [
  { value: "TH", label: "ภาษาไทย" },
  { value: "EN", label: "ภาษาอังกฤษ" },
] as const;

export const INITIAL_OWNER_FORM_VALUES: CreateOwnerInput = {
  customerType: "INDIVIDUAL",
  prefix: "คุณ",
  firstName: "",
  lastName: "",
  taxId: "",
  dateOfBirth: "",
  gender: "Not Specified",
  phonePrimary: "",
  phoneSecondary: "",
  lineId: "",
  email: "",
  addressLine: "",
  subdistrict: "",
  district: "",
  province: "",
  postalCode: "",
  referralSource: "มาที่คลินิกโดยตรง",
  preferredChannel: "LINE",
  preferredTime: "13:00 - 17:00",
  preferredLanguage: "TH",
  pdpaPrivacyNotice: true,
  pdpaReminders: true,
  pdpaMarketing: false,
  pdpaMedia: false,
};

export const OWNER_STEP_SCHEMAS = {
  1: step1IdentityContactSchema,
  2: step2AddressSchema,
  3: step3PreferencesPdpaSchema,
} as const;

const OWNER_STEP_1_FIELDS = new Set<string>([
  "customerType",
  "prefix",
  "firstName",
  "lastName",
  "taxId",
  "dateOfBirth",
  "gender",
  "phonePrimary",
  "phoneSecondary",
  "lineId",
  "email",
]);

const OWNER_STEP_2_FIELDS = new Set<string>([
  "addressLine",
  "subdistrict",
  "district",
  "province",
  "postalCode",
]);

export function resolveOwnerFieldStep(fieldKey: string): WizardStepNumber {
  if (OWNER_STEP_1_FIELDS.has(fieldKey)) return 1;
  if (OWNER_STEP_2_FIELDS.has(fieldKey)) return 2;
  return 3;
}

export function mapOwnerToInput(owner: OwnerDto): CreateOwnerInput {
  return {
    customerType: owner.customerType,
    prefix: owner.prefix,
    firstName: owner.firstName,
    lastName: owner.lastName,
    taxId: owner.taxId,
    dateOfBirth: owner.dateOfBirth,
    gender: owner.gender,
    phonePrimary: owner.phonePrimary,
    phoneSecondary: owner.phoneSecondary,
    lineId: owner.lineId,
    email: owner.email,
    addressLine: owner.addressLine,
    subdistrict: owner.subdistrict,
    district: owner.district,
    province: owner.province,
    postalCode: owner.postalCode,
    referralSource: owner.referralSource,
    preferredChannel: owner.preferredChannel,
    preferredTime: owner.preferredTime,
    preferredLanguage: owner.preferredLanguage,
    pdpaPrivacyNotice: owner.pdpaPrivacyNotice,
    pdpaReminders: owner.pdpaReminders,
    pdpaMarketing: owner.pdpaMarketing,
    pdpaMedia: owner.pdpaMedia,
  };
}

export function applyOwnerFieldSideEffects<TField extends keyof CreateOwnerInput>(
  prev: CreateOwnerInput,
  field: TField,
  value: CreateOwnerInput[TField]
): CreateOwnerInput {
  const next = { ...prev, [field]: value };

  if (field === "customerType") {
    if (value === "JURISTIC") {
      next.lastName = "";
      if (!JURISTIC_PREFIX_SET.has(prev.prefix)) {
        next.prefix = "บริษัท";
      }
    } else if (value === "INDIVIDUAL") {
      if (JURISTIC_PREFIX_SET.has(prev.prefix)) {
        next.prefix = "คุณ";
      }
    }
  }

  return next;
}
