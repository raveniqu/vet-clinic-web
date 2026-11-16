import { SidebarGroup, SidebarGroupContent } from "#/client/shared/shadcn/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import { AppSidebarMenus } from "./app-sidebar-menus";
import type { AppSidebarMenusProps } from "./app-sidebar-menus";

export const overviewMenus: AppSidebarMenusProps[] = [
  {
    id: "overview",
    title: "Quick Access",
    href: "",
    icon: LayoutDashboard,
    items: [
      {
        id: "home",
        title: "Home",
        href: "/",
      },
      {
        id: "add-new-owner",
        title: "Add new owners",
        href: "/owners?openAddNewForm=true",
      },
      {
        id: "add-new-pet",
        title: "Add new pets",
        href: "/pets?openAddNewForm=true",
      },
    ],
  },
];
export function AppSidebarMenuOverview() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <AppSidebarMenus menus={overviewMenus} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
