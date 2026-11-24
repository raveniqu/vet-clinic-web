import { FlaskConical, Microscope, Slice } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "#/client/shared/shadcn/components/ui/sidebar";
import { AppSidebarMenus } from "./app-sidebar-menus";
import type { AppSidebarMenusProps } from "./app-sidebar-menus";

const clinicalMenus: AppSidebarMenusProps[] = [
  {
    id: "consultations",
    title: "ห้องตรวจ / เวชระเบียน (EMR)",
    href: "/consultations",
    icon: Microscope,
    items: [],
  },
  {
    id: "diagnostics",
    title: "ตรวจแล็บและภาพถ่ายรังสี",
    href: "/diagnostics",
    icon: FlaskConical,
    items: [],
  },
  {
    id: "surgery",
    title: "ศัลยกรรม",
    href: "/surgery",
    icon: Slice,
    items: [],
  },
];

export function AppSidebarMenuClinical() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>งานคลินิก</SidebarGroupLabel>
      <SidebarGroupContent>
        <AppSidebarMenus menus={clinicalMenus} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
