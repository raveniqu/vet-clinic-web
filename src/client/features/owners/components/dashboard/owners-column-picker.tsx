import { Columns3, Lock, RotateCcw } from "lucide-react";
import { useOwnerColumns } from "#/client/features/owners/hooks/use-owner-columns";
import { Badge } from "#/client/shared/shadcn/components/ui/badge";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/client/shared/shadcn/components/ui/dropdown-menu";

export function OwnersColumnPicker() {
	const {
		columns,
		visibleColumnsCount,
		isDefaultColumns,
		isDesktop,
		toggleColumn,
		resetColumns,
	} = useOwnerColumns();

	if (!isDesktop) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						type="button"
						variant="ghost"
						className="border-0 bg-transparent shadow-md/10 inset-shadow-sm/10"
					/>
				}
			>
				<Columns3 data-icon="inline-start" aria-hidden="true" />
				<span className="font-light">คอลัมน์</span>
				<Badge variant="secondary">{visibleColumnsCount}</Badge>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel>คอลัมน์ที่แสดง</DropdownMenuLabel>
					{columns.map((column) => (
						<DropdownMenuCheckboxItem
							key={column.key}
							checked={column.checked}
							disabled={column.locked}
							closeOnClick={false}
							onCheckedChange={() => toggleColumn(column.key)}
						>
							<span className="flex items-center gap-1.5">
								{column.locked ? (
									<Lock
										className="size-3 text-muted-foreground"
										aria-hidden="true"
									/>
								) : null}
								<span>{column.label}</span>
							</span>
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						disabled={isDefaultColumns}
						closeOnClick={false}
						onClick={resetColumns}
					>
						<RotateCcw aria-hidden="true" />
						<span>คืนค่าเริ่มต้น</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
