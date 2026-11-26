import { Outlet } from "@tanstack/react-router";
import { AppShellContent } from "#/client/shared/components/app-shell";
import {
	SidebarInset,
	SidebarProvider,
} from "#/client/shared/shadcn/components/ui/sidebar";
import { AppHeader } from "../components/app-header";
import { AppSidebar } from "../components/app-sidebar";

export function PrivateLayout() {
	return (
		<SidebarProvider className="min-w-0 overflow-x-clip">
			<AppSidebar />
			<SidebarInset>
				<AppHeader />
				<AppShellContent>
					<Outlet />
				</AppShellContent>
			</SidebarInset>
		</SidebarProvider>
	);
}
