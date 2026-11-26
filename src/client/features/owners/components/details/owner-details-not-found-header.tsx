import { Undo2, UserRoundPlus } from "lucide-react";
import { useOwnerDetailsNotFound } from "#/client/features/owners/hooks/use-owner-details-not-found";
import { WarningBadge } from "#/client/shared/components/app-badge";
import {
	AppDashboardActions,
	AppDashboardDescription,
	AppDashboardHeader,
	AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function OwnerDetailsNotFoundHeader() {
	const isMobile = useIsMobile();
	const { ownerIdLabel } = useOwnerDetailsNotFound();

	return (
		<>
			{!isMobile ? (
				<AppButtonLink
					to="/owners"
					size="xs"
					variant="outline"
					className="w-fit"
				>
					<Undo2 aria-hidden="true" />
					<span>กลับไปหน้ารายชื่อเจ้าของ</span>
				</AppButtonLink>
			) : null}
			<AppDashboardHeader>
				<AppDashboardTitle className="flex flex-wrap items-center gap-2">
					<span>ไม่พบข้อมูลเจ้าของสัตว์เลี้ยง</span>
					<WarningBadge>404 ไม่พบข้อมูล</WarningBadge>
				</AppDashboardTitle>
				<AppDashboardDescription className="flex items-center gap-2">
					<span className="font-mono">ID: {ownerIdLabel}</span>
					<span>·</span>
					<span>ประวัติเจ้าของสัตว์เลี้ยง</span>
				</AppDashboardDescription>
				<AppDashboardActions>
					<AppButtonLink
						to="/owners"
						search={{ openAddNewForm: true }}
						size={isMobile ? "icon-sm" : "sm"}
						aria-label="เพิ่มเจ้าของใหม่"
					>
						<UserRoundPlus aria-hidden="true" />
						<span className="sr-only md:not-sr-only">เพิ่มเจ้าของใหม่</span>
					</AppButtonLink>
				</AppDashboardActions>
			</AppDashboardHeader>
		</>
	);
}
