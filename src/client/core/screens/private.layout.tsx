import { Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "#/client/shared/shadcn/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { AppHeader } from "../components/app-header";

export function PrivateLayout() {
  return (
    <SidebarProvider className="min-w-0 overflow-x-clip">
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
