import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveFirstFailedWizardStep } from "#/client/shared/hooks/use-wizard-form";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import type { PetDto } from "#/shared/schemas/pet.schema";
import {
  formatOwnerSummaryName,
  mapOwnerToSelectedSummary,
  mapPetToInput,
  mapPetToSelectedOwnerSummary,
  resolvePetFieldStep,
} from "./pet-form";

describe("Pet form pure helpers", () => {
  it("resolves wizard steps across identity, physical, and caution fields", () => {
    assert.equal(resolvePetFieldStep("ownerId"), 1);
    assert.equal(resolvePetFieldStep("breedId"), 1);
    assert.equal(resolvePetFieldStep("weight"), 2);
    assert.equal(resolvePetFieldStep("dateOfBirth"), 2);
    assert.equal(resolvePetFieldStep("microchipNumber"), 3);

    assert.equal(
      resolveFirstFailedWizardStep(["microchipNumber", "weight", "petName"], resolvePetFieldStep),
      1
    );
    assert.equal(
      resolveFirstFailedWizardStep(["microchipNumber", "dateOfBirth"], resolvePetFieldStep),
      2
    );
  });

  it("formats owner summary names consistently for Individual and Juristic owners", () => {
    const individualOwner: OwnerDto = {
      id: "01950f4b-3d44-7000-8000-000000000101",
      customerCode: "CUS-2026-0001",
      createdAt: "2026-01-10T00:00:00.000Z",
      customerType: "INDIVIDUAL",
      prefix: "Ms.",
      firstName: "Emily",
      lastName: "Watson",
      taxId: "1100500123456",
      dateOfBirth: "1990-02-14",
      gender: "Female",
      phonePrimary: "0891234567",
      phoneSecondary: "",
      lineId: "",
      email: "",
      addressLine: "88/12",
      subdistrict: "Khlong Tan Nuea",
      district: "Watthana",
      province: "Bangkok",
      postalCode: "10110",
      referralSource: "Walk-in",
      preferredChannel: "LINE",
      preferredTime: "13:00 - 17:00",
      preferredLanguage: "EN",
      pdpaPrivacyNotice: true,
      pdpaReminders: true,
      pdpaMarketing: false,
      pdpaMedia: false,
    };

    const juristicOwner: OwnerDto = {
      ...individualOwner,
      id: "01950f4b-3d44-7000-8000-000000000102",
      customerType: "JURISTIC",
      prefix: "Company",
      firstName: "Happy Pet Care Co.",
      lastName: "",
    };

    assert.equal(formatOwnerSummaryName(individualOwner), "Ms. Emily Watson");
    assert.equal(formatOwnerSummaryName(juristicOwner), "Company: Happy Pet Care Co.");
    assert.deepEqual(mapOwnerToSelectedSummary(juristicOwner), {
      id: juristicOwner.id,
      customerCode: "CUS-2026-0001",
      fullName: "Company: Happy Pet Care Co.",
      phone: "0891234567",
    });

    const pet: PetDto = {
      id: "01950f4b-3d44-7000-8000-000000000001",
      petCode: "PET-2026-0001",
      ownerId: individualOwner.id,
      ownerName: "Ms. Emily Watson",
      petName: "Bella",
      speciesId: 1,
      speciesName: "Dog",
      breedId: 10,
      breedName: "Beagle",
      customBreedName: "",
      photo: "",
      sex: "Female",
      reproductiveStatus: "Neutered",
      birthDateIsEstimated: false,
      dateOfBirth: "2022-05-01",
      estimatedYears: 0,
      estimatedMonths: 0,
      color: "Tricolor",
      weight: "10.4",
      microchipNumber: "900123456789012",
      temperament: "Docile",
      allergies: "",
      medicalNotes: "",
      status: "ACTIVE",
      createdAt: "2026-01-10T00:00:00.000Z",
    };

    assert.equal(mapPetToInput(pet).petName, "Bella");
    assert.deepEqual(mapPetToSelectedOwnerSummary(pet), {
      id: individualOwner.id,
      customerCode: "",
      fullName: "Ms. Emily Watson",
      phone: "",
    });
  });
});
