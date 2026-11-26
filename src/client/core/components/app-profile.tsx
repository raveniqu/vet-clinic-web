import { ChevronsUpDown, LogOut, Ticket } from "lucide-react";
import { AppThemeSwitcher } from "#/client/shared/components/app-theme-switcher";
import { AppUserProfile } from "#/client/shared/components/app-user-profile";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/client/shared/shadcn/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "#/client/shared/shadcn/components/ui/sidebar";

import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function AppProfile() {
	const isMobile = useIsMobile();
	const { open: isSidebarOpen } = useSidebar();
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							/>
						}
					>
						<AppUserProfile
							imageSrc=""
							prefix="น.สพ."
							firstName="สมศักดิ์"
							lastName="มักแมวมาก"
							subText="สัตวแพทย์เวร / เจ้าหน้าที่คลินิก"
						/>
						<ChevronsUpDown className="size-3.5! stroke-muted-foreground" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						side={isMobile ? "top" : isSidebarOpen ? "top" : "right"}
						className={`${isMobile ? "" : isSidebarOpen ? "max-w-64" : "w-fit max-w-64"} bg-transparent backdrop-blur-md`}
					>
						<DropdownMenuItem>
							<AppUserProfile
								imageSrc=""
								prefix="น.สพ."
								firstName="สมศักดิ์"
								lastName="มักแมวมาก"
								subText="สัตวแพทย์เวร / เจ้าหน้าที่คลินิก"
							/>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<AppThemeSwitcher />
						<DropdownMenuItem>
							<Ticket />
							<span>ช่วยเหลือและสนับสนุน</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive">
							<LogOut />
							<span>ออกจากระบบ</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
