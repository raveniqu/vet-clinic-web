import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { usePersistedColumns } from "#/client/shared/hooks/use-persisted-columns";
import type { OwnerColumnKey } from "../models/owners-table.model";
import {
	DEFAULT_VISIBLE_OWNER_COLUMNS,
	LOCKED_OWNER_COLUMNS,
	OWNER_COLUMNS_STORAGE_KEY,
	OWNER_TABLE_COLUMNS,
} from "../models/owners-table.model";

interface OwnersDashboardContextValue {
	visibleColumns: OwnerColumnKey[];
	toggleColumn: (column: OwnerColumnKey) => void;
	resetColumns: () => void;
}

const OwnersDashboardContext =
	createContext<OwnersDashboardContextValue | null>(null);

export function OwnersDashboardProvider({ children }: { children: ReactNode }) {
	const { visibleColumns, toggleColumn, resetColumns } =
		usePersistedColumns<OwnerColumnKey>({
			storageKey: OWNER_COLUMNS_STORAGE_KEY,
			columns: OWNER_TABLE_COLUMNS,
			defaultVisibleColumns: DEFAULT_VISIBLE_OWNER_COLUMNS,
			lockedColumns: LOCKED_OWNER_COLUMNS,
		});

	const value = useMemo<OwnersDashboardContextValue>(
		() => ({
			visibleColumns,
			toggleColumn,
			resetColumns,
		}),
		[visibleColumns, toggleColumn, resetColumns],
	);

	return (
		<OwnersDashboardContext.Provider value={value}>
			{children}
		</OwnersDashboardContext.Provider>
	);
}

export function useOwnersDashboardContext(): OwnersDashboardContextValue {
	const context = useContext(OwnersDashboardContext);
	if (!context) {
		throw new Error(
			"useOwnersDashboardContext must be used inside <OwnersDashboardProvider>",
		);
	}
	return context;
}
