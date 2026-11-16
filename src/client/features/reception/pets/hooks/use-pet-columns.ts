import { useMemo } from "react";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { usePetsDashboardContext } from "../contexts/pets-dashboard-provider";
import { DEFAULT_VISIBLE_PET_COLUMNS, PET_TABLE_COLUMNS } from "../models/pets-table";

export function usePetColumns() {
  const isMobile = useIsMobile();
  const { selectedTab, visibleColumns, toggleColumn, resetColumns } = usePetsDashboardContext();

  const isListTabActive = !isMobile && selectedTab === "list";

  const columns = useMemo(
    () =>
      PET_TABLE_COLUMNS.map((col) => ({
        ...col,
        checked: visibleColumns.includes(col.key),
      })),
    [visibleColumns]
  );

  const isDefaultColumns = useMemo(() => {
    if (visibleColumns.length !== DEFAULT_VISIBLE_PET_COLUMNS.length) return false;
    return DEFAULT_VISIBLE_PET_COLUMNS.every((key, index) => visibleColumns[index] === key);
  }, [visibleColumns]);

  return {
    columns,
    visibleColumns,
    visibleColumnsCount: visibleColumns.length,
    isDefaultColumns,
    isListTabActive,
    toggleColumn,
    resetColumns,
  };
}
