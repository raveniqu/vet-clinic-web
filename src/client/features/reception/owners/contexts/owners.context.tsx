import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ownersListQueryOptions } from "#/client/caches/owners/queries/owners.query";
import { usePersistedColumns } from "#/client/shared/hooks/use-persisted-columns";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { useOwnersSearch } from "../hooks/use-owners-search";
import type { OwnerColumnKey } from "../models/owners-table";
import {
  DEFAULT_VISIBLE_OWNER_COLUMNS,
  LOCKED_OWNER_COLUMNS,
  OWNER_COLUMNS_STORAGE_KEY,
  OWNER_TABLE_COLUMNS,
} from "../models/owners-table";

interface OwnersContextValue {
  editingOwner: OwnerDto | null;
  setEditingOwner: (owner: OwnerDto | null) => void;
  openEditDialog: (owner: OwnerDto) => void;
  closeEditDialog: () => void;
  visibleColumns: OwnerColumnKey[];
  toggleColumn: (column: OwnerColumnKey) => void;
  resetColumns: () => void;
}

const OwnersContext = createContext<OwnersContextValue | null>(null);

export function OwnersProvider({ children }: { children: ReactNode }) {
  const { search, updateSearch } = useOwnersSearch();
  const [editingOwnerState, setEditingOwnerState] = useState<OwnerDto | null>(null);

  const { visibleColumns, toggleColumn, resetColumns } = usePersistedColumns<OwnerColumnKey>({
    storageKey: OWNER_COLUMNS_STORAGE_KEY,
    columns: OWNER_TABLE_COLUMNS,
    defaultVisibleColumns: DEFAULT_VISIBLE_OWNER_COLUMNS,
    lockedColumns: LOCKED_OWNER_COLUMNS,
  });

  // Lookup fallback when navigating directly via ?editOwnerId=<uuid>
  const { data: allOwners = [] } = useQuery({
    ...ownersListQueryOptions(),
    enabled: Boolean(search.editOwnerId) && editingOwnerState?.id !== search.editOwnerId,
  });

  const editingOwner = useMemo<OwnerDto | null>(() => {
    if (editingOwnerState && (!search.editOwnerId || editingOwnerState.id === search.editOwnerId)) {
      return editingOwnerState;
    }
    if (search.editOwnerId) {
      return allOwners.find((owner) => owner.id === search.editOwnerId) ?? null;
    }
    return null;
  }, [allOwners, editingOwnerState, search.editOwnerId]);

  const setEditingOwner = useCallback(
    (owner: OwnerDto | null) => {
      setEditingOwnerState(owner);
      updateSearch({ editOwnerId: owner ? owner.id : undefined }, { replace: true });
    },
    [updateSearch]
  );

  const openEditDialog = useCallback(
    (owner: OwnerDto) => {
      setEditingOwner(owner);
    },
    [setEditingOwner]
  );

  const closeEditDialog = useCallback(() => {
    setEditingOwner(null);
  }, [setEditingOwner]);

  const value = useMemo<OwnersContextValue>(
    () => ({
      editingOwner,
      setEditingOwner,
      openEditDialog,
      closeEditDialog,
      visibleColumns,
      toggleColumn,
      resetColumns,
    }),
    [
      editingOwner,
      setEditingOwner,
      openEditDialog,
      closeEditDialog,
      visibleColumns,
      toggleColumn,
      resetColumns,
    ]
  );

  return <OwnersContext.Provider value={value}>{children}</OwnersContext.Provider>;
}

export function useOwnersContext(): OwnersContextValue {
  const context = useContext(OwnersContext);
  if (!context) {
    throw new Error("useOwnersContext must be used inside <OwnersProvider>");
  }
  return context;
}
