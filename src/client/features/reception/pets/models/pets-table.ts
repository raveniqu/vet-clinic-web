import { formatRegisteredDate } from "#/client/shared/helpers/formatters";
import type { PetDto, ReproductiveStatus, TemperamentAlert } from "#/shared/schemas/pet.schema";

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

export type PetQuickFilterKey = "hasAllergies" | "alertTemperament" | "intact" | "missingMicrochip";

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

export const TABLE_PAGE_SIZE_ITEMS: { label: string; value: number }[] = [
  { label: "10", value: 10 },
  { label: "25", value: 25 },
  { label: "50", value: 50 },
];

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
