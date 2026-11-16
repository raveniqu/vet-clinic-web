import { AppShellHeader } from "#/client/shared/components/app-shell";
import { AppSidebarTrigger } from "./app-sidebar/app-sidebar-trigger";
import { AppNotification } from "./app-notification";

import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { useSidebar } from "#/client/shared/shadcn/components/ui/sidebar";

export function AppHeader() {
  const isMobile = useIsMobile();
  const { open: isSidebarOpen } = useSidebar();

  return (
    <AppShellHeader className="justify-between gap-2">
      {isMobile ? <AppSidebarTrigger /> : isSidebarOpen ? <AppSidebarTrigger /> : null}
      <AppNotification />
    </AppShellHeader>
  );
}
