import { useCallback, useEffect, useState } from "react";

export interface TableColumnDefinition<TKey extends string> {
  key: TKey;
  label: string;
  locked?: boolean;
  defaultVisible: boolean;
}

export interface UsePersistedColumnsOptions<TKey extends string> {
  storageKey: string;
  columns: readonly TableColumnDefinition<TKey>[];
  defaultVisibleColumns: readonly TKey[];
  lockedColumns: ReadonlySet<TKey>;
}

export interface UsePersistedColumnsReturn<TKey extends string> {
  visibleColumns: TKey[];
  toggleColumn: (column: TKey) => void;
  resetColumns: () => void;
}

export function normalizePersistedColumns<TKey extends string>(
  raw: unknown,
  columns: readonly TableColumnDefinition<TKey>[],
  defaultVisibleColumns: readonly TKey[],
  lockedColumns: ReadonlySet<TKey>
): TKey[] {
  if (!Array.isArray(raw)) {
    return [...defaultVisibleColumns];
  }

  const validKeys = new Set<string>(columns.map((col) => col.key));
  const selected = new Set<TKey>(lockedColumns);

  for (const item of raw) {
    if (typeof item === "string" && validKeys.has(item)) {
      selected.add(item as TKey);
    }
  }

  return columns.filter((col) => selected.has(col.key)).map((col) => col.key);
}

function persistColumnsToStorage<TKey extends string>(
  storageKey: string,
  columns: readonly TKey[]
) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(columns));
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

export function usePersistedColumns<TKey extends string>({
  storageKey,
  columns,
  defaultVisibleColumns,
  lockedColumns,
}: UsePersistedColumnsOptions<TKey>): UsePersistedColumnsReturn<TKey> {
  const [visibleColumns, setVisibleColumns] = useState<TKey[]>(() => [...defaultVisibleColumns]);

  // Hydrate persisted column visibility after mount to avoid SSR hydration mismatch
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        setVisibleColumns(
          normalizePersistedColumns(parsed, columns, defaultVisibleColumns, lockedColumns)
        );
      }
    } catch {
      // Fallback safely to default columns when localStorage is unavailable or invalid
    }
  }, [storageKey, columns, defaultVisibleColumns, lockedColumns]);

  const toggleColumn = useCallback(
    (column: TKey) => {
      if (lockedColumns.has(column)) return;

      setVisibleColumns((prev) => {
        const next = prev.includes(column)
          ? prev.filter((item) => item !== column)
          : [...prev, column];
        const normalized = normalizePersistedColumns(
          next,
          columns,
          defaultVisibleColumns,
          lockedColumns
        );
        persistColumnsToStorage(storageKey, normalized);
        return normalized;
      });
    },
    [storageKey, columns, defaultVisibleColumns, lockedColumns]
  );

  const resetColumns = useCallback(() => {
    const defaults = [...defaultVisibleColumns];
    setVisibleColumns(defaults);
    persistColumnsToStorage(storageKey, defaults);
  }, [storageKey, defaultVisibleColumns]);

  return {
    visibleColumns,
    toggleColumn,
    resetColumns,
  };
}
