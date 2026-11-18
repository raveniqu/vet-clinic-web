import type { ColumnVisibilityState } from "@tanstack/react-table";
import { formatRegisteredDate } from "#/client/shared/helpers/formatters";
import type {
  PetDto,
  PetQuickFilterKey,
  ReproductiveStatus,
  TemperamentAlert,
} from "#/shared/schemas/pet.schema";

export type PetColumnKey =
  | "pet"
  | "speciesBreed"
  | "age"
  | "weight"
  | "allergies"
  | "owner"
  | "sexReproductive"
  | "temperament"
  | "microchip"
  | "color"
  | "medicalNotes"
  | "status"
  | "createdAt";

export interface PetColumnDefinition {
  key: PetColumnKey;
  label: string;
  locked?: boolean;
  defaultVisible: boolean;
}

export const PET_TABLE_COLUMNS: readonly PetColumnDefinition[] = [
  { key: "pet", label: "Pet", locked: true, defaultVisible: true },
  { key: "speciesBreed", label: "Species / Breed", defaultVisible: true },
  { key: "age", label: "Age", defaultVisible: true },
  { key: "weight", label: "Weight", defaultVisible: true },
  { key: "allergies", label: "Allergies", defaultVisible: true },
  { key: "owner", label: "Owner", defaultVisible: true },
  { key: "sexReproductive", label: "Sex / Neutered", defaultVisible: false },
  { key: "temperament", label: "Temperament", defaultVisible: false },
  { key: "microchip", label: "Microchip", defaultVisible: false },
  { key: "color", label: "Color", defaultVisible: false },
  { key: "medicalNotes", label: "Medical Notes", defaultVisible: false },
  { key: "status", label: "Status", defaultVisible: false },
  { key: "createdAt", label: "Registered", defaultVisible: false },
] as const;

export const DEFAULT_VISIBLE_PET_COLUMNS: readonly PetColumnKey[] = PET_TABLE_COLUMNS.filter(
  (col) => col.defaultVisible
).map((col) => col.key);

export const LOCKED_PET_COLUMNS: ReadonlySet<PetColumnKey> = new Set(
  PET_TABLE_COLUMNS.filter((col) => col.locked).map((col) => col.key)
);

export const PET_COLUMNS_STORAGE_KEY = "vet-clinic.pets.list-visible-columns.v1";

export interface PetQuickFilterDefinition {
  key: PetQuickFilterKey;
  label: string;
  predicate: (pet: PetDto) => boolean;
}

export const PET_QUICK_FILTERS: readonly PetQuickFilterDefinition[] = [
  {
    key: "hasAllergies",
    label: "Has Allergies",
    predicate: (pet) => Boolean(pet.allergies && pet.allergies.trim() !== ""),
  },
  {
    key: "alertTemperament",
    label: "Alert Temperament",
    predicate: (pet) => pet.temperament !== "Docile",
  },
  {
    key: "intact",
    label: "Intact",
    predicate: (pet) => pet.reproductiveStatus === "Intact",
  },
  {
    key: "missingMicrochip",
    label: "Missing Microchip",
    predicate: (pet) => !pet.microchipNumber || pet.microchipNumber.trim() === "",
  },
] as const;

export const PET_QUICK_FILTER_PREDICATES: Record<PetQuickFilterKey, (pet: PetDto) => boolean> = {
  hasAllergies: PET_QUICK_FILTERS[0].predicate,
  alertTemperament: PET_QUICK_FILTERS[1].predicate,
  intact: PET_QUICK_FILTERS[2].predicate,
  missingMicrochip: PET_QUICK_FILTERS[3].predicate,
};

export const PET_GRID_BATCH_SIZE = 6;

export function hasNonEmptyText(value: string | null | undefined): boolean {
  return Boolean(value && value.trim() !== "");
}

export function normalizeVisiblePetColumns(raw: unknown): PetColumnKey[] {
  if (!Array.isArray(raw)) {
    return [...DEFAULT_VISIBLE_PET_COLUMNS];
  }

  const validKeys = new Set<string>(PET_TABLE_COLUMNS.map((col) => col.key));
  const selected = new Set<PetColumnKey>(LOCKED_PET_COLUMNS);

  for (const item of raw) {
    if (typeof item === "string" && validKeys.has(item)) {
      selected.add(item as PetColumnKey);
    }
  }

  return PET_TABLE_COLUMNS.map((col) => col.key).filter((key) => selected.has(key));
}

export function getPetInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "PT";
  return trimmed.slice(0, 2).toUpperCase();
}

export function formatPetRegisteredDate(isoDate: string): string {
  return formatRegisteredDate(isoDate, "—");
}

export function getTemperamentSeverity(
  temperament: TemperamentAlert
): "normal" | "warning" | "danger" {
  switch (temperament) {
    case "Docile":
      return "normal";
    case "Nervous":
      return "warning";
    case "Aggressive":
    case "Needs Muzzle":
      return "danger";
  }
}

export function getReproductiveSeverity(status: ReproductiveStatus): "neutral" | "warning" {
  return status === "Intact" ? "warning" : "neutral";
}

export interface PetFilterCriteria {
  searchTerm: string;
  selectedSpeciesId: number;
  quickFilters: readonly PetQuickFilterKey[];
}

export function filterPets(pets: readonly PetDto[], criteria: PetFilterCriteria): PetDto[] {
  const term = criteria.searchTerm.trim().toLowerCase();

  return pets.filter((pet) => {
    if (criteria.selectedSpeciesId > 0 && pet.speciesId !== criteria.selectedSpeciesId) {
      return false;
    }

    for (const filterKey of criteria.quickFilters) {
      if (!PET_QUICK_FILTER_PREDICATES[filterKey](pet)) {
        return false;
      }
    }

    if (!term) return true;

    const name = pet.petName.toLowerCase();
    const breed = pet.breedName.toLowerCase();
    const color = (pet.color || "").toLowerCase();
    const species = pet.speciesName.toLowerCase();
    const code = pet.petCode.toLowerCase();
    const owner = (pet.ownerName || "").toLowerCase();
    const microchip = (pet.microchipNumber || "").toLowerCase();

    return (
      name.includes(term) ||
      breed.includes(term) ||
      color.includes(term) ||
      species.includes(term) ||
      code.includes(term) ||
      owner.includes(term) ||
      microchip.includes(term)
    );
  });
}

export interface PetsMetrics {
  totalPets: number;
  totalDogs: number;
  totalCats: number;
  totalAllergies: number;
}

export function computePetsMetrics(pets: readonly PetDto[]): PetsMetrics {
  let totalDogs = 0;
  let totalCats = 0;
  let totalAllergies = 0;

  for (const pet of pets) {
    if (pet.speciesName === "Dog") {
      totalDogs += 1;
    } else if (pet.speciesName === "Cat") {
      totalCats += 1;
    }

    if (hasNonEmptyText(pet.allergies)) {
      totalAllergies += 1;
    }
  }

  return {
    totalPets: pets.length,
    totalDogs,
    totalCats,
    totalAllergies,
  };
}

export function getPetColumnVisibilityState(
  visibleColumns: readonly PetColumnKey[]
): ColumnVisibilityState {
  const visibleSet = new Set<PetColumnKey>(visibleColumns);
  const visibility: ColumnVisibilityState = { actions: true };

  for (const column of PET_TABLE_COLUMNS) {
    visibility[column.key] = Boolean(column.locked) || visibleSet.has(column.key);
  }

  return visibility;
}
