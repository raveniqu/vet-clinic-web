import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "#/client/shared/shadcn/components/ui/sidebar";
import { AppSidebarMenuOverview } from "./app-sidebar-menu-overview";
import { AppSidebarMenuReception } from "./app-sidebar-menu-reception";
import { AppSidebarMenuClinical } from "./app-sidebar-menu-clinical";
import { AppSidebarMenuPharmacy } from "./app-sidebar-menu-pharmacy";
import { AppSidebarMenuFinancial } from "./app-sidebar-menu-financial";
import { AppSidebarMenuManagement } from "./app-sidebar-menu-management";
import { AppSidebarTrigger } from "./app-sidebar-trigger";
import { AppBranchSwitcher } from "../app-branch-switcher";
import { AppProfile } from "../app-profile";

import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function AppSidebar() {
  const { open: isSidebarOpen } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center pt-2">
            {isMobile ? <AppBranchSwitcher /> : isSidebarOpen ? <AppBranchSwitcher /> : null}
            {isMobile ? null : isSidebarOpen ? null : <AppSidebarTrigger className="ml-auto" />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarMenuOverview />
        <AppSidebarMenuReception />
        <AppSidebarMenuClinical />
        <AppSidebarMenuPharmacy />
        <AppSidebarMenuFinancial />
        <AppSidebarMenuManagement />
      </SidebarContent>
      <SidebarFooter>
        <AppProfile />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
