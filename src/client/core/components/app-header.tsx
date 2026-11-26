import { AppShellHeader } from "#/client/shared/components/app-shell";
import { useSidebar } from "#/client/shared/shadcn/components/ui/sidebar";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { AppNotification } from "./app-notification.tsx";
import { AppSidebarTrigger } from "./app-sidebar/app-sidebar-trigger";

export function AppHeader() {
	const isMobile = useIsMobile();
	const { open: isSidebarOpen } = useSidebar();

	return (
		<AppShellHeader className="justify-between gap-2">
			{isMobile ? (
				<AppSidebarTrigger />
			) : isSidebarOpen ? (
				<AppSidebarTrigger />
			) : null}
			<AppNotification />
		</AppShellHeader>
	);
}
