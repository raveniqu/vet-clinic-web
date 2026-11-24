import { Columns3, Lock, RotateCcw } from "lucide-react";

import { usePetColumns } from "#/client/features/reception/pets/hooks/use-pet-columns";
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

export function PetsColumnPicker() {
  const {
    columns,
    visibleColumnsCount,
    isDefaultColumns,
    isListTabActive,
    toggleColumn,
    resetColumns,
  } = usePetColumns();

  if (!isListTabActive) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="w-fit border-0 bg-background shadow-md/10 inset-shadow-sm/5 dark:ring-1 dark:ring-border"
          />
        }
      >
        <Columns3 data-icon="inline-start" />
        <span>คอลัมน์</span>
        <Badge variant="secondary" className="">
          {visibleColumnsCount}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit bg-transparent backdrop-blur-md">
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
                {column.locked ? <Lock className="size-3 text-muted-foreground" /> : null}
                <span>{column.label}</span>
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={isDefaultColumns} closeOnClick={false} onClick={resetColumns}>
            <RotateCcw />
            <span>คืนค่าเริ่มต้น</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
