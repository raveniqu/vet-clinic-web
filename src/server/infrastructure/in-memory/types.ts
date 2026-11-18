import type {
  CustomerType,
  Gender,
  PreferredChannel,
  PreferredLanguage,
} from "#/shared/schemas/owner.schema";
import type {
  PetSex,
  ReproductiveStatus,
  SpeciesGroup,
  TemperamentAlert,
} from "#/shared/schemas/pet.schema";

export interface SpeciesRecord {
  id: number;
  code: string;
  name: string;
  nameTh: string;
  group: SpeciesGroup;
  icon: string;
  isActive: boolean;
}

export interface BreedRecord {
  id: number;
  speciesId: number;
  breedCode?: string;
  breedName: string;
  isCustom: boolean;
  isActive: boolean;
}

export interface CustomerRecord {
  id: string;
  customerCode: string;
  customerType: CustomerType;
  prefix: string;
  firstName: string;
  lastName: string;
  displayName: string;
  taxId: string;
  dateOfBirth: string;
  gender: Gender;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerContactRecord {
  id: string;
  customerId: string;
  contactType: "PHONE" | "EMAIL" | "LINE";
  contactValue: string;
  isPrimary: boolean;
}

export interface CustomerAddressRecord {
  id: string;
  customerId: string;
  addressType: "RESIDENTIAL" | "BILLING" | "SHIPPING";
  addressLine: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  countryCode: string;
  isPrimary: boolean;
}

export interface CustomerPreferenceRecord {
  id: string;
  customerId: string;
  referralSource: string;
  preferredChannel: PreferredChannel;
  preferredTime: string;
  preferredLanguage: PreferredLanguage;
  pdpaPrivacyNotice: boolean;
  pdpaReminders: boolean;
  pdpaMarketing: boolean;
  pdpaMedia: boolean;
}

export interface PetRecord {
  id: string;
  petCode: string;
  petName: string;
  speciesId: number;
  breedId: number;
  customBreedName?: string;
  photo?: string;
  sex: PetSex;
  reproductiveStatus: ReproductiveStatus;
  birthDateIsEstimated: boolean;
  dateOfBirth: string;
  estimatedYears?: number;
  estimatedMonths?: number;
  color?: string;
  weight: string;
  microchipNumber?: string;
  temperament: TemperamentAlert;
  allergies?: string;
  medicalNotes?: string;
  status: "ACTIVE" | "INACTIVE" | "DECEASED";
  createdAt: string;
  updatedAt?: string;
}

export interface PetOwnershipRecord {
  id: string;
  petId: string;
  customerId: string;
  ownershipType: "PRIMARY" | "CO_OWNER";
  isPrimary: boolean;
  startDate: string;
  endDate?: string;
}
