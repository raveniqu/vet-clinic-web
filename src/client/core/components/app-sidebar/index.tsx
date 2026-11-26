import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "#/client/shared/shadcn/components/ui/sidebar";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { AppBranchSwitcher } from "../app-branch-switcher";
import { AppProfile } from "../app-profile";
import { AppSidebarMedicalRecord } from "./app-sidebar-medical-record";
import { AppSidebarTrigger } from "./app-sidebar-trigger";

export function AppSidebar() {
	const { open: isSidebarOpen } = useSidebar();
	const isMobile = useIsMobile();

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center pt-2">
						{isMobile ? (
							<AppBranchSwitcher />
						) : isSidebarOpen ? (
							<AppBranchSwitcher />
						) : null}
						{isMobile ? null : isSidebarOpen ? null : (
							<AppSidebarTrigger className="ml-auto" />
						)}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<AppSidebarMedicalRecord />
			</SidebarContent>
			<SidebarFooter>
				<AppProfile />
			</SidebarFooter>
		</Sidebar>
	);
}
