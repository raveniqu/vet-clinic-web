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
      prefix: "นางสาว",
      firstName: "วิภาดา",
      lastName: "ศรีสุวรรณ",
      taxId: "1100500123456",
      dateOfBirth: "1990-02-14",
      gender: "Female",
      phonePrimary: "0891234567",
      phoneSecondary: "",
      lineId: "",
      email: "",
      addressLine: "88/12",
      subdistrict: "คลองตันเหนือ",
      district: "วัฒนา",
      province: "กรุงเทพมหานคร",
      postalCode: "10110",
      referralSource: "มาที่คลินิกโดยตรง",
      preferredChannel: "LINE",
      preferredTime: "13:00 - 17:00",
      preferredLanguage: "TH",
      pdpaPrivacyNotice: true,
      pdpaReminders: true,
      pdpaMarketing: false,
      pdpaMedia: false,
    };

    const juristicOwner: OwnerDto = {
      ...individualOwner,
      id: "01950f4b-3d44-7000-8000-000000000102",
      customerType: "JURISTIC",
      prefix: "บริษัท",
      firstName: "แฮปปี้เพ็ท แคร์ จำกัด",
      lastName: "",
    };

    assert.equal(formatOwnerSummaryName(individualOwner), "นางสาว วิภาดา ศรีสุวรรณ");
    assert.equal(formatOwnerSummaryName(juristicOwner), "บริษัท แฮปปี้เพ็ท แคร์ จำกัด");
    assert.deepEqual(mapOwnerToSelectedSummary(juristicOwner), {
      id: juristicOwner.id,
      customerCode: "CUS-2026-0001",
      fullName: "บริษัท แฮปปี้เพ็ท แคร์ จำกัด",
      phone: "0891234567",
    });

    const pet: PetDto = {
      id: "01950f4b-3d44-7000-8000-000000000001",
      petCode: "PET-2026-0001",
      ownerId: individualOwner.id,
      ownerName: "นางสาว วิภาดา ศรีสุวรรณ",
      petName: "เบลล่า",
      speciesId: 1,
      speciesName: "สุนัข",
      breedId: 10,
      breedName: "บีเกิ้ล",
      customBreedName: "",
      photo: "",
      sex: "Female",
      reproductiveStatus: "Neutered",
      birthDateIsEstimated: false,
      dateOfBirth: "2022-05-01",
      estimatedYears: 0,
      estimatedMonths: 0,
      color: "สามสี",
      weight: "10.4",
      microchipNumber: "900123456789012",
      temperament: "Docile",
      allergies: "",
      medicalNotes: "",
      status: "ACTIVE",
      createdAt: "2026-01-10T00:00:00.000Z",
    };

    assert.equal(mapPetToInput(pet).petName, "เบลล่า");
    assert.deepEqual(mapPetToSelectedOwnerSummary(pet), {
      id: individualOwner.id,
      customerCode: "",
      fullName: "นางสาว วิภาดา ศรีสุวรรณ",
      phone: "",
    });
  });
});
