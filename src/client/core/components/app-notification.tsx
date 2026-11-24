import { Bell, Calendar, Syringe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/client/shared/shadcn/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { Button } from "#/client/shared/shadcn/components/ui/button";

export function AppNotification() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon-sm" className="ml-auto" aria-label="การแจ้งเตือน" />
        }
      >
        <div className="relative">
          <Bell className="size-4" />
          <span className="absolute top-0 size-1.5 rounded-full bg-destructive" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex w-fit min-w-60 flex-col bg-transparent backdrop-blur-md"
        align="end"
      >
        <div className="flex items-center justify-between py-1 pl-2">
          <p className="text-sm">การแจ้งเตือน</p>
          <Button size="xs" variant="link" className="text-muted-foreground">
            อ่านทั้งหมดแล้ว
          </Button>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-xl! pl-1 hover:bg-primary/10!">
          <span className="rounded-full bg-primary/10 p-2.5">
            <Calendar />
          </span>
          <div className="flex max-w-48 flex-col gap-0">
            <p className="truncate">แจ้งเตือนนัดหมายตรวจสุขภาพ</p>
            <small className="text-muted-foreground">12 นาทีที่แล้ว</small>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl! pl-1 hover:bg-primary/10!">
          <span className="rounded-full bg-primary/10 p-2.5">
            <Syringe />
          </span>
          <div className="flex max-w-48 flex-col gap-0">
            <p className="truncate">แจ้งเตือนยาและเวชภัณฑ์ใกล้หมด</p>
            <small className="text-muted-foreground">12 นาทีที่แล้ว</small>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-center py-1">
          <Link to="/reminders" className="text-xs text-primary">
            ดูการแจ้งเตือนทั้งหมด
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
