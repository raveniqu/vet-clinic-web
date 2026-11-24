import { cn } from "cn";
import { Archive, Copy, EllipsisVertical, Eye, Pencil } from "lucide-react";
import { useOwnerRowActions } from "#/client/features/reception/owners/hooks/use-owner-row-actions";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/client/shared/shadcn/components/ui/dropdown-menu";

export function OwnerRowActions() {
  const { owner, displayName, phoneCopied, handleEditProfile, handleCopyPhone } =
    useOwnerRowActions();

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
          to="/owners/$ownerId"
          params={{ ownerId: owner.id }}
          type="button"
          size="xs"
          variant="secondary"
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
                aria-label={`ตัวเลือกเพิ่มเติมสำหรับ ${displayName}`}
              />
            }
          >
            <EllipsisVertical aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleEditProfile}>
                <Pencil aria-hidden="true" />
                <span>แก้ไขข้อมูล</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyPhone}>
                <Copy aria-hidden="true" />
                <span>{phoneCopied ? "คัดลอกเบอร์โทรแล้ว" : "คัดลอกเบอร์โทร"}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-amber-600 dark:text-amber-400">
                <Archive aria-hidden="true" />
                <span>จัดเก็บถาวร</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
