import {
	CalendarCheck,
	ClipboardList,
	PawPrint,
	UsersRound,
} from "lucide-react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
} from "#/client/shared/shadcn/components/ui/sidebar";
import type { AppSidebarMenusProps } from "./app-sidebar-menus";
import { AppSidebarMenus } from "./app-sidebar-menus";

const medicalRecordMenus: AppSidebarMenusProps[] = [
	{
		id: "owners",
		title: "เจ้าของ",
		href: "/owners",
		icon: UsersRound,
		items: [],
	},
	{
		id: "pets",
		title: "สัตว์เลี้ยง",
		href: "/pets",
		icon: PawPrint,
		items: [],
	},
	{
		id: "queue",
		title: "คิวตรวจ",
		href: "/queue",
		icon: ClipboardList,
		items: [],
	},
	{
		id: "appointments",
		title: "นัดหมาย",
		href: "/appointments",
		icon: CalendarCheck,
		items: [],
	},
];

export function AppSidebarMedicalRecord() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>งานต้อนรับ</SidebarGroupLabel>
			<SidebarGroupContent>
				<AppSidebarMenus menus={medicalRecordMenus} />
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
