import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { petsSearchSchema } from "#/shared/schemas/pet.schema";
import type { PetDto } from "#/shared/schemas/pet.schema";
import {
  computePetsMetrics,
  filterPets,
  getPetColumnVisibilityState,
  normalizeVisiblePetColumns,
} from "./pets-table";

function createPetFixture(overrides: Partial<PetDto> = {}): PetDto {
  return {
    id: "01950f4b-3d44-7000-8000-000000000001",
    petCode: "PET-2026-0001",
    ownerId: "01950f4b-3d44-7000-8000-000000000101",
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
    ...overrides,
  };
}

describe("petsSearchSchema", () => {
  it("parses valid dashboard search params and recovers cleanly from invalid params", () => {
    const validUuid = "01950f4b-3d44-7000-8000-000000000099";
    const parsed = petsSearchSchema.parse({
      editPetId: validUuid,
      search: "beagle",
      speciesId: "2",
      quickFilters: ["hasAllergies", "invalidFilter", "intact"],
      tab: "grid",
      page: "3",
      pageSize: "25",
    });

    assert.equal(parsed.editPetId, validUuid);
    assert.equal(parsed.search, "beagle");
    assert.equal(parsed.speciesId, 2);
    assert.deepEqual(parsed.quickFilters, ["hasAllergies", "intact"]);
    assert.equal(parsed.tab, "grid");
    assert.equal(parsed.page, 3);
    assert.equal(parsed.pageSize, 25);

    const invalid = petsSearchSchema.parse({
      editPetId: "not-a-uuid",
      speciesId: "-4",
      tab: "cards",
      page: "0",
      pageSize: "99",
    });

    assert.equal(invalid.editPetId, undefined);
    assert.equal(invalid.speciesId, undefined);
    assert.equal(invalid.tab, undefined);
    assert.equal(invalid.page, undefined);
    assert.equal(invalid.pageSize, undefined);
  });
});

describe("Pets table pure helpers", () => {
  const samplePets: PetDto[] = [
    createPetFixture({
      id: "01950f4b-3d44-7000-8000-000000000001",
      petCode: "PET-2026-0001",
      petName: "Bella",
      speciesId: 1,
      speciesName: "Dog",
      breedName: "Beagle",
      color: "Tricolor",
      ownerName: "Emily Watson",
      allergies: "",
      temperament: "Docile",
      reproductiveStatus: "Neutered",
      microchipNumber: "900123456789012",
    }),
    createPetFixture({
      id: "01950f4b-3d44-7000-8000-000000000002",
      petCode: "PET-2026-0002",
      petName: "Milo",
      speciesId: 2,
      speciesName: "Cat",
      breedName: "Siamese",
      color: "Cream",
      ownerName: "Kamonwan Siri",
      allergies: "Chicken meal",
      temperament: "Nervous",
      reproductiveStatus: "Intact",
      microchipNumber: "",
    }),
    createPetFixture({
      id: "01950f4b-3d44-7000-8000-000000000003",
      petCode: "PET-2026-0003",
      petName: "Hero",
      speciesId: 1,
      speciesName: "Dog",
      breedName: "Shih Tzu",
      color: "White & Gold",
      ownerName: "Happy Pet Co.",
      allergies: "   ",
      temperament: "Needs Muzzle",
      reproductiveStatus: "Intact",
      microchipNumber: "981000000000123",
    }),
  ];

  it("filters pets across search term fields, species id, and quick filters", () => {
    assert.deepEqual(
      filterPets(samplePets, {
        searchTerm: "cream",
        selectedSpeciesId: 0,
        quickFilters: [],
      }).map((pet) => pet.petCode),
      ["PET-2026-0002"]
    );

    assert.deepEqual(
      filterPets(samplePets, {
        searchTerm: "981000000000123",
        selectedSpeciesId: 0,
        quickFilters: [],
      }).map((pet) => pet.petCode),
      ["PET-2026-0003"]
    );

    assert.deepEqual(
      filterPets(samplePets, {
        searchTerm: "",
        selectedSpeciesId: 1,
        quickFilters: ["alertTemperament", "intact"],
      }).map((pet) => pet.petCode),
      ["PET-2026-0003"]
    );

    assert.deepEqual(
      filterPets(samplePets, {
        searchTerm: "",
        selectedSpeciesId: 0,
        quickFilters: ["hasAllergies", "missingMicrochip"],
      }).map((pet) => pet.petCode),
      ["PET-2026-0002"]
    );
  });

  it("computes dashboard pet metrics accurately", () => {
    assert.deepEqual(computePetsMetrics(samplePets), {
      totalPets: 3,
      totalDogs: 2,
      totalCats: 1,
      totalAllergies: 1,
    });
  });

  it("normalizes and maps visible columns while locking the primary pet column", () => {
    const normalized = normalizeVisiblePetColumns(["age", "unknown", "weight"]);
    assert.deepEqual(normalized, ["pet", "age", "weight"]);

    const visibility = getPetColumnVisibilityState(["age", "weight"]);
    assert.equal(visibility.pet, true);
    assert.equal(visibility.age, true);
    assert.equal(visibility.weight, true);
    assert.equal(visibility.allergies, false);
    assert.equal(visibility.actions, true);
  });
});
