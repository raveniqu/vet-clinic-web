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
    title: "Exam / EMR",
    href: "/consultations",
    icon: Microscope,
    items: [],
  },
  {
    id: "diagnostics",
    title: "Lab & Imaging",
    href: "/diagnostics",
    icon: FlaskConical,
    items: [],
  },
  {
    id: "surgery",
    title: "Surgery",
    href: "/surgery",
    icon: Slice,
    items: [],
  },
];

export function AppSidebarMenuClinical() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Clinical</SidebarGroupLabel>
      <SidebarGroupContent>
        <AppSidebarMenus menus={clinicalMenus} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
