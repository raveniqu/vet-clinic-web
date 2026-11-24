import { CalendarCheck, ClipboardList, PawPrint, UsersRound } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "#/client/shared/shadcn/components/ui/sidebar";
import { AppSidebarMenus } from "./app-sidebar-menus";
import type { AppSidebarMenusProps } from "./app-sidebar-menus";

const receptionMenus: AppSidebarMenusProps[] = [
  {
    id: "owners",
    title: "เจ้าของสัตว์เลี้ยง",
    href: "/owners",
    icon: UsersRound,
    items: [],
  },
  {
    id: "pets",
    title: "สัตว์เลี้ยง",
    href: "/pets",
    icon: PawPrint,
    items: [],
  },
  {
    id: "queue",
    title: "คิวตรวจ",
    href: "/queue",
    icon: ClipboardList,
    items: [],
  },
  {
    id: "appointments",
    title: "นัดหมาย",
    href: "/appointments",
    icon: CalendarCheck,
    items: [],
  },
];

export function AppSidebarMenuReception() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>งานต้อนรับ</SidebarGroupLabel>
      <SidebarGroupContent>
        <AppSidebarMenus menus={receptionMenus} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
