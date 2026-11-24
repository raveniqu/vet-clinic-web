import { Boxes, PillBottle, Truck } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "#/client/shared/shadcn/components/ui/sidebar";
import { AppSidebarMenus } from "./app-sidebar-menus";
import type { AppSidebarMenusProps } from "./app-sidebar-menus";

const clinicalMenus: AppSidebarMenusProps[] = [
  {
    id: "dispense",
    title: "จ่ายยา",
    href: "/dispense",
    icon: PillBottle,
    items: [],
  },
  {
    id: "inventory",
    title: "คลังยาและเวชภัณฑ์",
    href: "/inventory",
    icon: Boxes,
    items: [],
  },
  {
    id: "procurement",
    title: "จัดซื้อ",
    href: "/procurement",
    icon: Truck,
    items: [],
  },
];

export function AppSidebarMenuPharmacy() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>ห้องยาและคลัง</SidebarGroupLabel>
      <SidebarGroupContent>
        <AppSidebarMenus menus={clinicalMenus} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
