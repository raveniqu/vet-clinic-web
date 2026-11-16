import { Settings, UserRoundGroup } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "#/client/shared/shadcn/components/ui/sidebar";
import { AppSidebarMenus } from "./app-sidebar-menus";
import type { AppSidebarMenusProps } from "./app-sidebar-menus";

const managementMenus: AppSidebarMenusProps[] = [
  {
    id: "staff",
    title: "Staff",
    href: "/staff",
    icon: UserRoundGroup,
    items: [],
  },
  {
    id: "settings",
    title: "Settings",
    href: "/settings",
    icon: Settings,
    items: [],
  },
];

export function AppSidebarMenuManagement() {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarGroupContent>
        <AppSidebarMenus menus={managementMenus} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
