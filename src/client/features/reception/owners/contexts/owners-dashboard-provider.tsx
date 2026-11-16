import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ownersListQueryOptions } from "#/client/caches/owners/queries/owners.query";
import { usePersistedColumns } from "#/client/shared/hooks/use-persisted-columns";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import {
  DEFAULT_VISIBLE_OWNER_COLUMNS,
  LOCKED_OWNER_COLUMNS,
  OWNER_COLUMNS_STORAGE_KEY,
  OWNER_QUICK_FILTER_PREDICATES,
  OWNER_TABLE_COLUMNS,
  getOwnerDisplayName,
} from "../models/owners-table";
import type { OwnerColumnKey, OwnerQuickFilterKey } from "../models/owners-table";

interface OwnersDashboardContextValue {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  quickFilters: OwnerQuickFilterKey[];
  setQuickFilters: (filters: OwnerQuickFilterKey[]) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  hasActiveFilter: boolean;
  filterResetKey: string;
  visibleColumns: OwnerColumnKey[];
  toggleColumn: (column: OwnerColumnKey) => void;
  resetColumns: () => void;
  allOwners: OwnerDto[];
  filteredOwners: OwnerDto[];
  isLoading: boolean;
  editingOwner: OwnerDto | null;
  setEditingOwner: (owner: OwnerDto | null) => void;
}

const OwnersDashboardContext = createContext<OwnersDashboardContextValue | null>(null);

export interface OwnersDashboardProviderProps {
  children: ReactNode;
}

export function OwnersDashboardProvider({ children }: OwnersDashboardProviderProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const editOwnerId = (search as { editOwnerId?: number } | undefined)?.editOwnerId;

  const [searchTerm, setSearchTerm] = useState("");
  const [quickFilters, setQuickFilters] = useState<OwnerQuickFilterKey[]>([]);
  const [editingOwnerState, setEditingOwnerState] = useState<OwnerDto | null>(null);

  const { visibleColumns, toggleColumn, resetColumns } = usePersistedColumns<OwnerColumnKey>({
    storageKey: OWNER_COLUMNS_STORAGE_KEY,
    columns: OWNER_TABLE_COLUMNS,
    defaultVisibleColumns: DEFAULT_VISIBLE_OWNER_COLUMNS,
    lockedColumns: LOCKED_OWNER_COLUMNS,
  });

  const { data: allOwners = [], isLoading } = useQuery(ownersListQueryOptions());

  const editingOwner = useMemo<OwnerDto | null>(() => {
    if (editingOwnerState && (!editOwnerId || editingOwnerState.id === editOwnerId)) {
      return editingOwnerState;
    }
    if (editOwnerId) {
      return allOwners.find((o) => o.id === editOwnerId) ?? null;
    }
    return null;
  }, [allOwners, editOwnerId, editingOwnerState]);

  const setEditingOwner = useCallback(
    (owner: OwnerDto | null) => {
      setEditingOwnerState(owner);
      void navigate({
        to: "/owners",
        search: (prev: Record<string, unknown>) => {
          if (owner) {
            return { ...prev, editOwnerId: owner.id };
          }
          const { editOwnerId: _, ...rest } = prev;
          return rest;
        },
        replace: true,
      });
    },
    [navigate]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setQuickFilters([]);
  }, []);

  const filteredOwners = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return allOwners.filter((owner) => {
      for (const filterKey of quickFilters) {
        if (!OWNER_QUICK_FILTER_PREDICATES[filterKey](owner)) {
          return false;
        }
      }

      if (!term) return true;

      const fullName = getOwnerDisplayName(owner).toLowerCase();
      const code = owner.customerCode.toLowerCase();
      const phone = owner.phonePrimary.toLowerCase();
      const phoneSecondary = owner.phoneSecondary.toLowerCase();
      const lineId = owner.lineId.toLowerCase();
      const taxId = owner.taxId.toLowerCase();
      const email = owner.email.toLowerCase();

      return (
        fullName.includes(term) ||
        code.includes(term) ||
        phone.includes(term) ||
        phoneSecondary.includes(term) ||
        lineId.includes(term) ||
        taxId.includes(term) ||
        email.includes(term)
      );
    });
  }, [allOwners, quickFilters, searchTerm]);

  const activeFilterCount = quickFilters.length + (searchTerm.trim() !== "" ? 1 : 0);
  const hasActiveFilter = activeFilterCount > 0;
  const filterResetKey = `${searchTerm}|${quickFilters.join(",")}`;

  const value = useMemo<OwnersDashboardContextValue>(
    () => ({
      searchTerm,
      setSearchTerm,
      quickFilters,
      setQuickFilters,
      clearFilters,
      activeFilterCount,
      hasActiveFilter,
      filterResetKey,
      visibleColumns,
      toggleColumn,
      resetColumns,
      allOwners,
      filteredOwners,
      isLoading,
      editingOwner,
      setEditingOwner,
    }),
    [
      searchTerm,
      quickFilters,
      clearFilters,
      activeFilterCount,
      hasActiveFilter,
      filterResetKey,
      visibleColumns,
      toggleColumn,
      resetColumns,
      allOwners,
      filteredOwners,
      isLoading,
      editingOwner,
      setEditingOwner,
    ]
  );

  return (
    <OwnersDashboardContext.Provider value={value}>{children}</OwnersDashboardContext.Provider>
  );
}

export function useOwnersDashboardContext(): OwnersDashboardContextValue {
  const context = useContext(OwnersDashboardContext);
  if (!context) {
    throw new Error("useOwnersDashboardContext must be used within an OwnersDashboardProvider");
  }
  return context;
}
