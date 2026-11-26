import { useMemo } from "react";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { useOwnersDashboardContext } from "../contexts/owners-dashboard.context";
import {
	DEFAULT_VISIBLE_OWNER_COLUMNS,
	OWNER_TABLE_COLUMNS,
} from "../models/owners-table.model";

export function useOwnerColumns() {
	const isMobile = useIsMobile();
	const { visibleColumns, toggleColumn, resetColumns } =
		useOwnersDashboardContext();

	const isDesktop = !isMobile;

	const columns = useMemo(
		() =>
			OWNER_TABLE_COLUMNS.map((col) => ({
				...col,
				checked: visibleColumns.includes(col.key),
			})),
		[visibleColumns],
	);

	const isDefaultColumns = useMemo(() => {
		if (visibleColumns.length !== DEFAULT_VISIBLE_OWNER_COLUMNS.length) {
			return false;
		}
		return DEFAULT_VISIBLE_OWNER_COLUMNS.every(
			(key, index) => visibleColumns[index] === key,
		);
	}, [visibleColumns]);

	return {
		columns,
		visibleColumnsCount: visibleColumns.length,
		isDefaultColumns,
		isDesktop,
		toggleColumn,
		resetColumns,
	};
}
