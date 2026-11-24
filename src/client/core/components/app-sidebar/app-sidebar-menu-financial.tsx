import { BellRing, HandCoins } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "#/client/shared/shadcn/components/ui/sidebar";
import { AppSidebarMenus } from "./app-sidebar-menus";
import type { AppSidebarMenusProps } from "./app-sidebar-menus";

const financialMenus: AppSidebarMenusProps[] = [
  {
    id: "cashier",
    title: "การเงิน / แคชเชียร์",
    href: "/cashier",
    icon: HandCoins,
    items: [],
  },
  {
    id: "reminders",
    title: "ติดตามอาการ / CRM",
    href: "/reminders",
    icon: BellRing,
    items: [],
  },
];

export function AppSidebarMenuFinancial() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>การเงินและลูกค้าสัมพันธ์</SidebarGroupLabel>
      <SidebarGroupContent>
        <AppSidebarMenus menus={financialMenus} />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
