import { cn } from "cn";
import { EllipsisVertical, Eye, Microscope, Pencil } from "lucide-react";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/client/shared/shadcn/components/ui/dropdown-menu";
import { usePetRowActions } from "#/client/features/reception/pets/hooks/use-pet-row-actions";

export function PetRowActions() {
  const { pet, handleEdit } = usePetRowActions();

  return (
    <div className="relative flex items-center justify-end">
      <div
        className={cn(
          "pointer-events-none absolute right-3 flex translate-x-1 items-center gap-1 rounded-full p-1 opacity-0 shadow-md/10 inset-shadow-sm/5 backdrop-blur-xs transition duration-150 ease-out motion-reduce:transition-none",
          "group-hover/row:pointer-events-auto group-hover/row:translate-x-0 group-hover/row:opacity-100",
          "group-focus-within/row:pointer-events-auto group-focus-within/row:translate-x-0 group-focus-within/row:opacity-100 dark:ring-1 dark:ring-border",
          "group-has-[[data-slot=dropdown-menu-trigger][aria-expanded=true]]/row:pointer-events-auto group-has-[[data-slot=dropdown-menu-trigger][aria-expanded=true]]/row:translate-x-0 group-has-[[data-slot=dropdown-menu-trigger][aria-expanded=true]]/row:opacity-100",
          "pointer-coarse:pointer-events-auto pointer-coarse:static pointer-coarse:translate-x-0 pointer-coarse:bg-transparent pointer-coarse:p-0.5 pointer-coarse:opacity-100 pointer-coarse:shadow-sm pointer-coarse:backdrop-blur-xs"
        )}
      >
        <AppButtonLink
          to="/pets/$petId"
          params={{ petId: String(pet.id) }}
          type="button"
          size="xs"
          variant="ghost"
          className="bg-background! dark:bg-secondary!"
        >
          <Eye data-icon="inline-start" aria-hidden="true" />
          <span>ดูประวัติ</span>
        </AppButtonLink>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                aria-label={`ตัวเลือกเพิ่มเติมสำหรับ ${pet.petName}`}
              />
            }
          >
            <EllipsisVertical aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-transparent backdrop-blur-md">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil aria-hidden="true" />
                <span>แก้ไขข้อมูล</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Microscope aria-hidden="true" />
                <span>เปิดเวชระเบียน (EMR)</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
