import { cn } from "cn";
import { useCallback, useId } from "react";
import { Label } from "../shadcn/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../shadcn/components/ui/select";
import { useSidebar } from "../shadcn/components/ui/sidebar";
import type { PaginationReturn } from "./app-pagination";

export interface PageSizeOption {
	label: string;
	value: number;
}

export const DEFAULT_PAGE_SIZE_ITEMS: readonly PageSizeOption[] = [
	{ label: "10", value: 10 },
	{ label: "25", value: 25 },
	{ label: "50", value: 50 },
] as const;

export interface AppRowsPerPageSelectorProps {
	pagination: PaginationReturn;
	pageSizeItems?: readonly PageSizeOption[];
	onPageSizeChange?: (value: number | null) => void;
	totalCount?: number;
	itemLabel?: string;
}

export function AppRowsPerPageSelector({
	pagination,
	pageSizeItems = DEFAULT_PAGE_SIZE_ITEMS,
	onPageSizeChange,
	totalCount,
	itemLabel = "รายการ",
}: AppRowsPerPageSelectorProps) {
	const selectId = useId();
	const { open: isSidebarOpen } = useSidebar();

	const resolvedTotalCount = totalCount ?? pagination.totalCount;

	const handlePageSizeChange = useCallback(
		(value: number | null) => {
			if (onPageSizeChange) {
				onPageSizeChange(value);
				return;
			}
			if (typeof value === "number" && value > 0) {
				pagination.setPageSize(value);
			}
		},
		[onPageSizeChange, pagination.setPageSize],
	);

	return (
		<div className="flex flex-wrap items-center gap-3">
			<div className="flex items-center gap-2">
				<Label htmlFor={selectId} className="text-xs text-muted-foreground">
					แสดงต่อหน้า
				</Label>
				<Select
					value={pagination.pageSize}
					items={pageSizeItems}
					onValueChange={handlePageSizeChange}
				>
					<SelectTrigger
						id={selectId}
						size="sm"
						className="w-fit border-0 bg-transparent shadow-md/10 inset-shadow-sm/10"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent
						alignItemWithTrigger={false}
						align="end"
						className="bg-transparent backdrop-blur-md"
					>
						<SelectGroup>
							{pageSizeItems.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<span
				className={cn("text-xs text-muted-foreground", {
					"md:hidden lg:block": isSidebarOpen,
				})}
			>
				แสดง {pagination.startItemIndex}-{pagination.endItemIndex} จาก{" "}
				{resolvedTotalCount} {itemLabel}
			</span>
		</div>
	);
}
