import type { ColumnVisibilityState } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { petsListQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { usePersistedColumns } from "#/client/shared/hooks/use-persisted-columns";
import type { PetDto } from "#/shared/schemas/pet.schema";
import { usePetsSearch } from "../hooks/use-pets-search";
import {
  DEFAULT_VISIBLE_PET_COLUMNS,
  getPetColumnVisibilityState,
  LOCKED_PET_COLUMNS,
  PET_COLUMNS_STORAGE_KEY,
  PET_TABLE_COLUMNS,
} from "../models/pets-table";
import type { PetColumnKey } from "../models/pets-table";

interface PetsContextValue {
  editingPet: PetDto | null;
  openEditDialog: (pet: PetDto) => void;
  closeEditDialog: () => void;
  visibleColumns: PetColumnKey[];
  columnVisibility: ColumnVisibilityState;
  toggleColumn: (column: PetColumnKey) => void;
  resetColumns: () => void;
}

const PetsContext = createContext<PetsContextValue | null>(null);

interface PetsProviderProps {
  children: ReactNode;
}

export function PetsProvider({ children }: PetsProviderProps) {
  const { editPetId, setEditPetId } = usePetsSearch();
  const { data: allPets = [] } = useQuery(petsListQueryOptions());
  const [editingPetState, setEditingPetState] = useState<PetDto | null>(null);

  const { visibleColumns, toggleColumn, resetColumns } = usePersistedColumns<PetColumnKey>({
    storageKey: PET_COLUMNS_STORAGE_KEY,
    columns: PET_TABLE_COLUMNS,
    defaultVisibleColumns: DEFAULT_VISIBLE_PET_COLUMNS,
    lockedColumns: LOCKED_PET_COLUMNS,
  });

  const columnVisibility = useMemo(
    () => getPetColumnVisibilityState(visibleColumns),
    [visibleColumns]
  );

  const editingPet = useMemo<PetDto | null>(() => {
    if (editingPetState && (!editPetId || editingPetState.id === editPetId)) {
      return editingPetState;
    }
    if (editPetId) {
      return allPets.find((pet) => pet.id === editPetId) ?? null;
    }
    return null;
  }, [allPets, editPetId, editingPetState]);

  const openEditDialog = useCallback(
    (pet: PetDto) => {
      setEditingPetState(pet);
      setEditPetId(pet.id);
    },
    [setEditPetId]
  );

  const closeEditDialog = useCallback(() => {
    setEditingPetState(null);
    setEditPetId(undefined);
  }, [setEditPetId]);

  const value = useMemo<PetsContextValue>(
    () => ({
      editingPet,
      openEditDialog,
      closeEditDialog,
      visibleColumns,
      columnVisibility,
      toggleColumn,
      resetColumns,
    }),
    [
      editingPet,
      openEditDialog,
      closeEditDialog,
      visibleColumns,
      columnVisibility,
      toggleColumn,
      resetColumns,
    ]
  );

  return <PetsContext.Provider value={value}>{children}</PetsContext.Provider>;
}

export function usePetsContext(): PetsContextValue {
  const context = useContext(PetsContext);
  if (!context) {
    throw new Error("usePetsContext must be used within a PetsProvider");
  }
  return context;
}
