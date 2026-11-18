import type { WizardStepNumber } from "#/client/shared/hooks/use-wizard-form";
import {
  step1IdentityContactSchema,
  step2AddressSchema,
  step3PreferencesPdpaSchema,
} from "#/shared/schemas/owner.schema";
import type { CreateOwnerInput, OwnerDto } from "#/shared/schemas/owner.schema";

export const INITIAL_OWNER_FORM_VALUES: CreateOwnerInput = {
  customerType: "INDIVIDUAL",
  prefix: "Mr.",
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
  referralSource: "Walk-in",
  preferredChannel: "LINE",
  preferredTime: "13:00 - 17:00",
  preferredLanguage: "EN",
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
      if (prev.prefix !== "Company" && prev.prefix !== "Foundation") {
        next.prefix = "Company";
      }
    } else if (value === "INDIVIDUAL") {
      if (prev.prefix === "Company" || prev.prefix === "Foundation") {
        next.prefix = "Mr.";
      }
    }
  }

  return next;
}
