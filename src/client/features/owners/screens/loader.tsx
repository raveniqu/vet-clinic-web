import { UserRoundPlus } from "lucide-react";
import {
	AppDashboardActions,
	AppDashboardContent,
	AppDashboardDescription,
	AppDashboardHeader,
	AppDashboardRoot,
	AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { Skeleton } from "#/client/shared/shadcn/components/ui/skeleton";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function OwnersScreenLoader() {
	const isMobile = useIsMobile();

	return (
		<AppDashboardRoot className="mx-auto max-w-7xl">
			<AppDashboardHeader>
				<AppDashboardTitle>ข้อมูลเจ้าของสัตว์เลี้ยง</AppDashboardTitle>
				<AppDashboardDescription>
					จัดการประวัติเจ้าของสัตว์เลี้ยง ค้นหา แก้ไขข้อมูล และสถานะความยินยอม PDPA
				</AppDashboardDescription>
				<AppDashboardActions>
					<Button type="button" disabled size={isMobile ? "icon-sm" : "sm"}>
						<UserRoundPlus className="size-4" aria-hidden="true" />
						<span className="sr-only md:not-sr-only md:text-xs lg:text-sm">
							เพิ่มเจ้าของใหม่
						</span>
					</Button>
				</AppDashboardActions>
			</AppDashboardHeader>
			<AppDashboardContent>
				<div className="col-span-full flex flex-col gap-6 xl:col-span-8">
					<Skeleton className="h-44 w-full rounded-2xl" />
					<Skeleton className="h-96 w-full rounded-2xl" />
				</div>
				<div className="col-span-full flex flex-col gap-6 xl:col-span-4">
					<Skeleton className="h-48 w-full rounded-2xl" />
					<Skeleton className="h-44 w-full rounded-2xl" />
					<Skeleton className="h-52 w-full rounded-2xl" />
				</div>
			</AppDashboardContent>
		</AppDashboardRoot>
	);
}
