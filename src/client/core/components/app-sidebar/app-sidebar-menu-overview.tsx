import { SidebarGroup, SidebarGroupContent } from "#/client/shared/shadcn/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import { AppSidebarMenus } from "./app-sidebar-menus";
import type { AppSidebarMenusProps } from "./app-sidebar-menus";

export const overviewMenus: AppSidebarMenusProps[] = [
  {
    id: "overview",
    title: "ทางลัด",
    href: "",
    icon: LayoutDashboard,
    items: [
      {
        id: "home",
        title: "หน้าหลัก",
        href: "/",
      },
      {
        id: "add-new-owner",
        title: "ลงทะเบียนเจ้าของใหม่",
        href: "/owners?openAddNewForm=true",
      },
      {
        id: "add-new-pet",
        title: "ลงทะเบียนสัตว์เลี้ยงใหม่",
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
