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
    title: "Owners",
    href: "/owners",
    icon: UsersRound,
    items: [],
  },
  {
    id: "pets",
    title: "Pets",
    href: "/pets",
    icon: PawPrint,
    items: [],
  },
  {
    id: "queue",
    title: "Queue",
    href: "/queue",
    icon: ClipboardList,
    items: [],
  },
  {
    id: "appointments",
    title: "Appointments",
    href: "/appointments",
    icon: CalendarCheck,
    items: [],
  },
];

export function AppSidebarMenuReception() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Reception</SidebarGroupLabel>
      <SidebarGroupContent>
        <AppSidebarMenus menus={receptionMenus} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
