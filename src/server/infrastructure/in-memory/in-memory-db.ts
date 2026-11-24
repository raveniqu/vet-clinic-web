import type { CreateOwnerInput, OwnerDto, UpdateOwnerInput } from "#/shared/schemas/owner.schema";
import type {
  BreedItem,
  CreatePetInput,
  PetDto,
  SpeciesItem,
  UpdatePetInput,
} from "#/shared/schemas/pet.schema";
import { initialBreedSeeds, initialSpeciesSeeds } from "./seeds/catalog.seeds";
import {
  initialCustomerAddressSeeds,
  initialCustomerContactSeeds,
  initialCustomerPreferenceSeeds,
  initialCustomerSeeds,
} from "./seeds/customer.seeds";
import { initialPetOwnershipSeeds, initialPetSeeds } from "./seeds/pet.seeds";
import type {
  BreedRecord,
  CustomerAddressRecord,
  CustomerContactRecord,
  CustomerPreferenceRecord,
  CustomerRecord,
  PetOwnershipRecord,
  PetRecord,
  SpeciesRecord,
} from "./types";

export class InMemoryDb {
  private static instance: InMemoryDb | null = null;

  private species = new Map<number, SpeciesRecord>();
  private breeds = new Map<number, BreedRecord>();
  private customers = new Map<string, CustomerRecord>();
  private contacts = new Map<string, CustomerContactRecord>();
  private addresses = new Map<string, CustomerAddressRecord>();
  private preferences = new Map<string, CustomerPreferenceRecord>();
  private pets = new Map<string, PetRecord>();
  private ownerships = new Map<string, PetOwnershipRecord>();

  // Secondary Relational Indexes (O(1) joins instead of O(N*M) Map scans)
  private cachedActiveSpecies: SpeciesItem[] = [];
  private cachedAllActiveBreeds: BreedItem[] = [];
  private activeBreedsBySpeciesId = new Map<number, BreedItem[]>();
  private contactsByCustomerId = new Map<string, CustomerContactRecord[]>();
  private primaryAddressByCustomerId = new Map<string, CustomerAddressRecord>();
  private preferenceByCustomerId = new Map<string, CustomerPreferenceRecord>();
  private primaryOwnershipByPetId = new Map<string, PetOwnershipRecord>();

  private constructor() {
    this.seed();
  }

  public static getInstance(): InMemoryDb {
    if (!InMemoryDb.instance) {
      InMemoryDb.instance = new InMemoryDb();
    }
    return InMemoryDb.instance;
  }

  private seed(): void {
    for (const s of initialSpeciesSeeds) {
      const copy = { ...s };
      this.species.set(copy.id, copy);
      if (copy.isActive) {
        this.cachedActiveSpecies.push({
          id: copy.id,
          code: copy.code,
          name: copy.name,
          nameTh: copy.nameTh,
          group: copy.group,
          icon: copy.icon,
        });
      }
    }

    for (const b of initialBreedSeeds) {
      const copy = { ...b };
      this.breeds.set(copy.id, copy);
      if (copy.isActive) {
        const breedItem: BreedItem = {
          id: copy.id,
          speciesId: copy.speciesId,
          breedName: copy.breedName,
          isCustom: copy.isCustom,
        };
        this.cachedAllActiveBreeds.push(breedItem);
        const bySpecies = this.activeBreedsBySpeciesId.get(copy.speciesId);
        if (bySpecies) {
          bySpecies.push(breedItem);
        } else {
          this.activeBreedsBySpeciesId.set(copy.speciesId, [breedItem]);
        }
      }
    }

    for (const c of initialCustomerSeeds) {
      this.customers.set(c.id, { ...c });
    }
    for (const ct of initialCustomerContactSeeds) {
      const copy = { ...ct };
      this.contacts.set(copy.id, copy);
      this.indexContact(copy);
    }
    for (const a of initialCustomerAddressSeeds) {
      const copy = { ...a };
      this.addresses.set(copy.id, copy);
      if (copy.isPrimary) {
        this.primaryAddressByCustomerId.set(copy.customerId, copy);
      }
    }
    for (const p of initialCustomerPreferenceSeeds) {
      const copy = { ...p };
      this.preferences.set(copy.id, copy);
      this.preferenceByCustomerId.set(copy.customerId, copy);
    }
    for (const pet of initialPetSeeds) {
      this.pets.set(pet.id, { ...pet });
    }
    for (const o of initialPetOwnershipSeeds) {
      const copy = { ...o };
      this.ownerships.set(copy.id, copy);
      if (copy.isPrimary && !copy.endDate) {
        this.primaryOwnershipByPetId.set(copy.petId, copy);
      }
    }
  }

  private indexContact(contact: CustomerContactRecord): void {
    const existing = this.contactsByCustomerId.get(contact.customerId);
    if (existing) {
      existing.push(contact);
    } else {
      this.contactsByCustomerId.set(contact.customerId, [contact]);
    }
  }

  private unindexContact(contact: CustomerContactRecord): void {
    const existing = this.contactsByCustomerId.get(contact.customerId);
    if (!existing) return;
    const next = existing.filter((c) => c.id !== contact.id);
    if (next.length > 0) {
      this.contactsByCustomerId.set(contact.customerId, next);
    } else {
      this.contactsByCustomerId.delete(contact.customerId);
    }
  }

  // --- Network Latency Simulator ---
  public async simulateNetworkDelay(ms = 350): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  // --- Catalogs ---
  public getSpecies(): SpeciesItem[] {
    return [...this.cachedActiveSpecies];
  }

  public getBreedsBySpecies(speciesId?: number): BreedItem[] {
    if (speciesId) {
      return [...(this.activeBreedsBySpeciesId.get(speciesId) ?? [])];
    }
    return [...this.cachedAllActiveBreeds];
  }

  // --- Pets Relational Queries & Mutations ---
  public getAllPets(): PetDto[] {
    const results: PetDto[] = [];
    for (const pet of this.pets.values()) {
      if (pet.status !== "DECEASED") {
        results.push(this.mapPetRecordToDto(pet));
      }
    }
    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public getPetById(id: string): PetDto | null {
    const pet = this.pets.get(id);
    if (!pet || pet.status === "DECEASED") return null;
    return this.mapPetRecordToDto(pet);
  }

  public getPetsByOwnerId(ownerId: string): PetDto[] {
    const results: PetDto[] = [];
    for (const ownership of this.ownerships.values()) {
      if (ownership.customerId === ownerId && !ownership.endDate) {
        const dto = this.getPetById(ownership.petId);
        if (dto) {
          results.push(dto);
        }
      }
    }
    return results;
  }

  public insertPet(input: CreatePetInput): PetDto {
    const newId = crypto.randomUUID();
    const petCode = `PET-2026-${String(this.pets.size + 1).padStart(4, "0")}`;
    const now = new Date().toISOString();

    const record: PetRecord = {
      id: newId,
      petCode,
      petName: input.petName,
      speciesId: input.speciesId,
      breedId: input.breedId,
      customBreedName: input.customBreedName,
      photo: input.photo,
      sex: input.sex,
      reproductiveStatus: input.reproductiveStatus,
      birthDateIsEstimated: input.birthDateIsEstimated,
      dateOfBirth: input.dateOfBirth,
      estimatedYears: input.estimatedYears,
      estimatedMonths: input.estimatedMonths,
      color: input.color,
      weight: input.weight,
      microchipNumber: input.microchipNumber,
      temperament: input.temperament,
      allergies: input.allergies,
      medicalNotes: input.medicalNotes,
      status: "ACTIVE",
      createdAt: now,
    };

    this.pets.set(newId, record);

    const ownershipId = crypto.randomUUID();
    const ownershipRecord: PetOwnershipRecord = {
      id: ownershipId,
      petId: newId,
      customerId: input.ownerId,
      ownershipType: "PRIMARY",
      isPrimary: true,
      startDate: now.slice(0, 10),
    };
    this.ownerships.set(ownershipId, ownershipRecord);
    this.primaryOwnershipByPetId.set(newId, ownershipRecord);

    return this.mapPetRecordToDto(record);
  }

  public updatePet(input: UpdatePetInput): PetDto {
    const record = this.pets.get(input.id);
    if (!record || record.status === "DECEASED") {
      throw new Error(`ไม่พบข้อมูลสัตว์เลี้ยงรหัส ${input.id}`);
    }

    const now = new Date().toISOString();
    record.petName = input.petName;
    record.speciesId = input.speciesId;
    record.breedId = input.breedId;
    record.customBreedName = input.customBreedName;
    record.photo = input.photo;
    record.sex = input.sex;
    record.reproductiveStatus = input.reproductiveStatus;
    record.birthDateIsEstimated = input.birthDateIsEstimated;
    record.dateOfBirth = input.dateOfBirth;
    record.estimatedYears = input.estimatedYears;
    record.estimatedMonths = input.estimatedMonths;
    record.color = input.color;
    record.weight = input.weight;
    record.microchipNumber = input.microchipNumber;
    record.temperament = input.temperament;
    record.allergies = input.allergies;
    record.medicalNotes = input.medicalNotes;
    record.updatedAt = now;

    const ownership = this.primaryOwnershipByPetId.get(input.id);
    if (ownership && ownership.customerId !== input.ownerId) {
      ownership.customerId = input.ownerId;
    } else if (!ownership) {
      const ownershipId = crypto.randomUUID();
      const newOwnership: PetOwnershipRecord = {
        id: ownershipId,
        petId: input.id,
        customerId: input.ownerId,
        ownershipType: "PRIMARY",
        isPrimary: true,
        startDate: now.slice(0, 10),
      };
      this.ownerships.set(ownershipId, newOwnership);
      this.primaryOwnershipByPetId.set(input.id, newOwnership);
    }

    return this.mapPetRecordToDto(record);
  }

  private mapPetRecordToDto(record: PetRecord): PetDto {
    const species = this.species.get(record.speciesId);
    const breed = this.breeds.get(record.breedId);

    const ownership = this.primaryOwnershipByPetId.get(record.id);
    const customer = ownership ? this.customers.get(ownership.customerId) : undefined;

    const breedName =
      record.customBreedName && record.customBreedName.trim() !== ""
        ? record.customBreedName
        : (breed?.breedName ?? "ไม่ระบุ");

    const ownerName = customer
      ? customer.displayName || `${customer.firstName} ${customer.lastName}`.trim()
      : "ไม่ระบุเจ้าของ";

    const ownerId = customer ? customer.id : "";

    return {
      id: record.id,
      petCode: record.petCode,
      petName: record.petName,
      ownerId,
      ownerName,
      speciesId: record.speciesId,
      speciesName: species?.nameTh ?? species?.name ?? "อื่นๆ",
      breedId: record.breedId,
      breedName,
      customBreedName: record.customBreedName ?? "",
      photo: record.photo ?? "",
      sex: record.sex,
      reproductiveStatus: record.reproductiveStatus,
      birthDateIsEstimated: record.birthDateIsEstimated,
      dateOfBirth: record.dateOfBirth,
      estimatedYears: record.estimatedYears ?? 0,
      estimatedMonths: record.estimatedMonths ?? 0,
      color: record.color ?? "",
      weight: record.weight,
      microchipNumber: record.microchipNumber ?? "",
      temperament: record.temperament,
      allergies: record.allergies ?? "",
      medicalNotes: record.medicalNotes ?? "",
      status: record.status,
      createdAt: record.createdAt,
    };
  }

  // --- Customers Relational Queries & Mutations ---
  public getAllOwners(): OwnerDto[] {
    const results: OwnerDto[] = [];
    for (const c of this.customers.values()) {
      if (c.status === "ACTIVE") {
        results.push(this.mapCustomerRecordToDto(c));
      }
    }
    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public getOwnerById(id: string): OwnerDto | null {
    const customer = this.customers.get(id);
    if (customer?.status !== "ACTIVE") return null;
    return this.mapCustomerRecordToDto(customer);
  }

  public insertOwner(input: CreateOwnerInput): OwnerDto {
    const newId = crypto.randomUUID();
    const customerCode = `CUS-2026-${String(this.pets.size + 1).padStart(4, "0")}`;
    const now = new Date().toISOString();

    const displayName =
      input.customerType === "INDIVIDUAL"
        ? `${input.prefix} ${input.firstName} ${input.lastName}`.trim()
        : `${input.prefix} ${input.firstName}`.trim();

    const customerRecord: CustomerRecord = {
      id: newId,
      customerCode,
      customerType: input.customerType,
      prefix: input.prefix,
      firstName: input.firstName,
      lastName: input.lastName,
      displayName,
      taxId: input.taxId,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      status: "ACTIVE",
      createdAt: now,
    };
    this.customers.set(newId, customerRecord);

    // Primary Phone
    const contactPhoneId = crypto.randomUUID();
    const primaryPhoneRecord: CustomerContactRecord = {
      id: contactPhoneId,
      customerId: newId,
      contactType: "PHONE",
      contactValue: input.phonePrimary,
      isPrimary: true,
    };
    this.contacts.set(contactPhoneId, primaryPhoneRecord);
    this.indexContact(primaryPhoneRecord);

    // Secondary Phone
    if (input.phoneSecondary.trim() !== "") {
      const contactPhoneSecId = crypto.randomUUID();
      const secondaryPhoneRecord: CustomerContactRecord = {
        id: contactPhoneSecId,
        customerId: newId,
        contactType: "PHONE",
        contactValue: input.phoneSecondary,
        isPrimary: false,
      };
      this.contacts.set(contactPhoneSecId, secondaryPhoneRecord);
      this.indexContact(secondaryPhoneRecord);
    }

    // Line ID
    if (input.lineId.trim() !== "") {
      const contactLineId = crypto.randomUUID();
      const lineRecord: CustomerContactRecord = {
        id: contactLineId,
        customerId: newId,
        contactType: "LINE",
        contactValue: input.lineId,
        isPrimary: false,
      };
      this.contacts.set(contactLineId, lineRecord);
      this.indexContact(lineRecord);
    }

    // Email
    if (input.email.trim() !== "") {
      const contactEmailId = crypto.randomUUID();
      const emailRecord: CustomerContactRecord = {
        id: contactEmailId,
        customerId: newId,
        contactType: "EMAIL",
        contactValue: input.email,
        isPrimary: false,
      };
      this.contacts.set(contactEmailId, emailRecord);
      this.indexContact(emailRecord);
    }

    // Address
    const addressId = crypto.randomUUID();
    const addressRecord: CustomerAddressRecord = {
      id: addressId,
      customerId: newId,
      addressType: input.customerType === "JURISTIC" ? "BILLING" : "RESIDENTIAL",
      addressLine: input.addressLine,
      subdistrict: input.subdistrict,
      district: input.district,
      province: input.province,
      postalCode: input.postalCode,
      countryCode: "TH",
      isPrimary: true,
    };
    this.addresses.set(addressId, addressRecord);
    this.primaryAddressByCustomerId.set(newId, addressRecord);

    // Preferences & PDPA
    const prefId = crypto.randomUUID();
    const prefRecord: CustomerPreferenceRecord = {
      id: prefId,
      customerId: newId,
      referralSource: input.referralSource,
      preferredChannel: input.preferredChannel,
      preferredTime: input.preferredTime,
      preferredLanguage: input.preferredLanguage,
      pdpaPrivacyNotice: input.pdpaPrivacyNotice,
      pdpaReminders: input.pdpaReminders,
      pdpaMarketing: input.pdpaMarketing,
      pdpaMedia: input.pdpaMedia,
    };
    this.preferences.set(prefId, prefRecord);
    this.preferenceByCustomerId.set(newId, prefRecord);

    return this.mapCustomerRecordToDto(customerRecord);
  }

  public updateOwner(input: UpdateOwnerInput): OwnerDto {
    const customer = this.customers.get(input.id);
    if (customer?.status !== "ACTIVE") {
      throw new Error(`ไม่พบข้อมูลเจ้าของสัตว์เลี้ยงรหัส ${input.id}`);
    }

    const now = new Date().toISOString();
    customer.customerType = input.customerType;
    customer.prefix = input.prefix;
    customer.firstName = input.firstName;
    customer.lastName = input.lastName;
    customer.displayName =
      input.customerType === "INDIVIDUAL"
        ? `${input.prefix} ${input.firstName} ${input.lastName}`.trim()
        : `${input.prefix} ${input.firstName}`.trim();
    customer.taxId = input.taxId;
    customer.dateOfBirth = input.dateOfBirth;
    customer.gender = input.gender;
    customer.updatedAt = now;

    const customerContacts = this.contactsByCustomerId.get(input.id) ?? [];

    // Update primary phone
    const primaryPhoneContact = customerContacts.find(
      (c) => c.contactType === "PHONE" && c.isPrimary
    );
    if (primaryPhoneContact) {
      primaryPhoneContact.contactValue = input.phonePrimary;
    } else {
      const contactId = crypto.randomUUID();
      const newContact: CustomerContactRecord = {
        id: contactId,
        customerId: input.id,
        contactType: "PHONE",
        contactValue: input.phonePrimary,
        isPrimary: true,
      };
      this.contacts.set(contactId, newContact);
      this.indexContact(newContact);
    }

    // Secondary phone
    const secondaryPhoneContact = customerContacts.find(
      (c) => c.contactType === "PHONE" && !c.isPrimary
    );
    if (input.phoneSecondary.trim() !== "") {
      if (secondaryPhoneContact) {
        secondaryPhoneContact.contactValue = input.phoneSecondary;
      } else {
        const contactId = crypto.randomUUID();
        const newContact: CustomerContactRecord = {
          id: contactId,
          customerId: input.id,
          contactType: "PHONE",
          contactValue: input.phoneSecondary,
          isPrimary: false,
        };
        this.contacts.set(contactId, newContact);
        this.indexContact(newContact);
      }
    } else if (secondaryPhoneContact) {
      this.contacts.delete(secondaryPhoneContact.id);
      this.unindexContact(secondaryPhoneContact);
    }

    // Line ID
    const lineContact = customerContacts.find((c) => c.contactType === "LINE");
    if (input.lineId.trim() !== "") {
      if (lineContact) {
        lineContact.contactValue = input.lineId;
      } else {
        const contactId = crypto.randomUUID();
        const newContact: CustomerContactRecord = {
          id: contactId,
          customerId: input.id,
          contactType: "LINE",
          contactValue: input.lineId,
          isPrimary: false,
        };
        this.contacts.set(contactId, newContact);
        this.indexContact(newContact);
      }
    } else if (lineContact) {
      this.contacts.delete(lineContact.id);
      this.unindexContact(lineContact);
    }

    // Email
    const emailContact = customerContacts.find((c) => c.contactType === "EMAIL");
    if (input.email.trim() !== "") {
      if (emailContact) {
        emailContact.contactValue = input.email;
      } else {
        const contactId = crypto.randomUUID();
        const newContact: CustomerContactRecord = {
          id: contactId,
          customerId: input.id,
          contactType: "EMAIL",
          contactValue: input.email,
          isPrimary: false,
        };
        this.contacts.set(contactId, newContact);
        this.indexContact(newContact);
      }
    } else if (emailContact) {
      this.contacts.delete(emailContact.id);
      this.unindexContact(emailContact);
    }

    // Address
    const address = this.primaryAddressByCustomerId.get(input.id);
    if (address) {
      address.addressLine = input.addressLine;
      address.subdistrict = input.subdistrict;
      address.district = input.district;
      address.province = input.province;
      address.postalCode = input.postalCode;
    } else {
      const addressId = crypto.randomUUID();
      const newAddress: CustomerAddressRecord = {
        id: addressId,
        customerId: input.id,
        addressType: input.customerType === "JURISTIC" ? "BILLING" : "RESIDENTIAL",
        addressLine: input.addressLine,
        subdistrict: input.subdistrict,
        district: input.district,
        province: input.province,
        postalCode: input.postalCode,
        countryCode: "TH",
        isPrimary: true,
      };
      this.addresses.set(addressId, newAddress);
      this.primaryAddressByCustomerId.set(input.id, newAddress);
    }

    // Preferences & PDPA
    const pref = this.preferenceByCustomerId.get(input.id);
    if (pref) {
      pref.referralSource = input.referralSource;
      pref.preferredChannel = input.preferredChannel;
      pref.preferredTime = input.preferredTime;
      pref.preferredLanguage = input.preferredLanguage;
      pref.pdpaPrivacyNotice = input.pdpaPrivacyNotice;
      pref.pdpaReminders = input.pdpaReminders;
      pref.pdpaMarketing = input.pdpaMarketing;
      pref.pdpaMedia = input.pdpaMedia;
    } else {
      const prefId = crypto.randomUUID();
      const newPref: CustomerPreferenceRecord = {
        id: prefId,
        customerId: input.id,
        referralSource: input.referralSource,
        preferredChannel: input.preferredChannel,
        preferredTime: input.preferredTime,
        preferredLanguage: input.preferredLanguage,
        pdpaPrivacyNotice: input.pdpaPrivacyNotice,
        pdpaReminders: input.pdpaReminders,
        pdpaMarketing: input.pdpaMarketing,
        pdpaMedia: input.pdpaMedia,
      };
      this.preferences.set(prefId, newPref);
      this.preferenceByCustomerId.set(input.id, newPref);
    }

    return this.mapCustomerRecordToDto(customer);
  }

  private mapCustomerRecordToDto(customer: CustomerRecord): OwnerDto {
    const customerContacts = this.contactsByCustomerId.get(customer.id) ?? [];

    let primaryPhone = "";
    let secondaryPhone = "";
    let lineId = "";
    let email = "";

    for (const c of customerContacts) {
      if (c.contactType === "PHONE") {
        if (c.isPrimary) {
          primaryPhone = c.contactValue;
        } else {
          secondaryPhone = c.contactValue;
        }
      } else if (c.contactType === "LINE") {
        lineId = c.contactValue;
      } else {
        email = c.contactValue;
      }
    }

    const primaryAddress = this.primaryAddressByCustomerId.get(customer.id);
    const pref = this.preferenceByCustomerId.get(customer.id);

    return {
      id: customer.id,
      customerCode: customer.customerCode,
      customerType: customer.customerType,
      prefix: customer.prefix,
      firstName: customer.firstName,
      lastName: customer.lastName,
      taxId: customer.taxId,
      dateOfBirth: customer.dateOfBirth,
      gender: customer.gender,
      phonePrimary: primaryPhone,
      phoneSecondary: secondaryPhone,
      lineId,
      email,
      addressLine: primaryAddress?.addressLine ?? "",
      subdistrict: primaryAddress?.subdistrict ?? "",
      district: primaryAddress?.district ?? "",
      province: primaryAddress?.province ?? "",
      postalCode: primaryAddress?.postalCode ?? "",
      referralSource: pref?.referralSource ?? "มาที่คลินิกโดยตรง",
      preferredChannel: pref?.preferredChannel ?? "LINE",
      preferredTime: pref?.preferredTime ?? "13:00 - 17:00",
      preferredLanguage: pref?.preferredLanguage ?? "TH",
      pdpaPrivacyNotice: pref?.pdpaPrivacyNotice ?? true,
      pdpaReminders: pref?.pdpaReminders ?? true,
      pdpaMarketing: pref?.pdpaMarketing ?? false,
      pdpaMedia: pref?.pdpaMedia ?? false,
      createdAt: customer.createdAt,
    };
  }
}
