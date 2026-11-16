import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { petsListQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { usePersistedColumns } from "#/client/shared/hooks/use-persisted-columns";
import type { PetDto } from "#/shared/schemas/pet.schema";
import {
  DEFAULT_VISIBLE_PET_COLUMNS,
  LOCKED_PET_COLUMNS,
  PET_COLUMNS_STORAGE_KEY,
  PET_QUICK_FILTER_PREDICATES,
  PET_TABLE_COLUMNS,
} from "../models/pets-table";
import type { PetColumnKey, PetQuickFilterKey } from "../models/pets-table";

export type PetTabValue = "grid" | "list";

interface PetsDashboardContextValue {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSpeciesId: number;
  setSelectedSpeciesId: (speciesId: number) => void;
  quickFilters: PetQuickFilterKey[];
  setQuickFilters: (filters: PetQuickFilterKey[]) => void;
  toggleQuickFilter: (filter: PetQuickFilterKey) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  hasActiveFilter: boolean;
  filterResetKey: string;
  allPets: PetDto[];
  filteredPets: PetDto[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  selectedTab: PetTabValue;
  setSelectedTab: (tab: PetTabValue) => void;
  visibleColumns: PetColumnKey[];
  toggleColumn: (column: PetColumnKey) => void;
  resetColumns: () => void;
  editingPet: PetDto | null;
  setEditingPet: (pet: PetDto | null) => void;
}

const PetsDashboardContext = createContext<PetsDashboardContextValue | null>(null);

export interface PetsDashboardProviderProps {
  children: ReactNode;
}

export function PetsDashboardProvider({ children }: PetsDashboardProviderProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const editPetId = (search as { editPetId?: number } | undefined)?.editPetId;

  const [selectedTab, setSelectedTab] = useState<PetTabValue>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number>(0);
  const [quickFilters, setQuickFilters] = useState<PetQuickFilterKey[]>([]);
  const [editingPetState, setEditingPetState] = useState<PetDto | null>(null);

  const { visibleColumns, toggleColumn, resetColumns } = usePersistedColumns<PetColumnKey>({
    storageKey: PET_COLUMNS_STORAGE_KEY,
    columns: PET_TABLE_COLUMNS,
    defaultVisibleColumns: DEFAULT_VISIBLE_PET_COLUMNS,
    lockedColumns: LOCKED_PET_COLUMNS,
  });

  const { data: allPets = [], isLoading, isError, error } = useQuery(petsListQueryOptions());

  const editingPet = useMemo<PetDto | null>(() => {
    if (editingPetState && (!editPetId || editingPetState.id === editPetId)) {
      return editingPetState;
    }
    if (editPetId) {
      return allPets.find((p) => p.id === editPetId) ?? null;
    }
    return null;
  }, [allPets, editPetId, editingPetState]);

  const setEditingPet = useCallback(
    (pet: PetDto | null) => {
      setEditingPetState(pet);
      void navigate({
        to: "/pets",
        search: (prev: Record<string, unknown>) => {
          if (pet) {
            return { ...prev, editPetId: pet.id };
          }
          const { editPetId: _, ...rest } = prev;
          return rest;
        },
        replace: true,
      });
    },
    [navigate]
  );

  const toggleQuickFilter = useCallback((filter: PetQuickFilterKey) => {
    setQuickFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    );
  }, []);

  const filteredPets = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return allPets.filter((pet) => {
      if (selectedSpeciesId > 0 && pet.speciesId !== selectedSpeciesId) {
        return false;
      }

      for (const filterKey of quickFilters) {
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
  }, [allPets, searchTerm, selectedSpeciesId, quickFilters]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedSpeciesId(0);
    setQuickFilters([]);
  }, []);

  const activeFilterCount = useMemo(
    () =>
      (searchTerm.trim().length > 0 ? 1 : 0) +
      (selectedSpeciesId > 0 ? 1 : 0) +
      quickFilters.length,
    [searchTerm, selectedSpeciesId, quickFilters]
  );

  const hasActiveFilter = activeFilterCount > 0;

  const filterResetKey = useMemo(
    () => `${selectedSpeciesId}|${searchTerm.trim()}|${[...quickFilters].sort().join(",")}`,
    [selectedSpeciesId, searchTerm, quickFilters]
  );

  const value = useMemo<PetsDashboardContextValue>(
    () => ({
      searchTerm,
      setSearchTerm,
      selectedSpeciesId,
      setSelectedSpeciesId,
      quickFilters,
      setQuickFilters,
      toggleQuickFilter,
      clearFilters,
      activeFilterCount,
      hasActiveFilter,
      filterResetKey,
      allPets,
      filteredPets,
      isLoading,
      isError,
      error,
      selectedTab,
      setSelectedTab,
      visibleColumns,
      toggleColumn,
      resetColumns,
      editingPet,
      setEditingPet,
    }),
    [
      searchTerm,
      selectedSpeciesId,
      quickFilters,
      toggleQuickFilter,
      clearFilters,
      activeFilterCount,
      hasActiveFilter,
      filterResetKey,
      allPets,
      filteredPets,
      isLoading,
      isError,
      error,
      selectedTab,
      visibleColumns,
      toggleColumn,
      resetColumns,
      editingPet,
      setEditingPet,
    ]
  );

  return <PetsDashboardContext.Provider value={value}>{children}</PetsDashboardContext.Provider>;
}

export function usePetsDashboardContext(): PetsDashboardContextValue {
  const context = useContext(PetsDashboardContext);
  if (!context) {
    throw new Error("usePetsDashboardContext must be used within a PetsDashboardProvider");
  }
  return context;
}
