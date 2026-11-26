import { PhoneCall, Undo2 } from "lucide-react";
import { useOwnerDetails } from "#/client/features/owners/hooks/use-owner-details";
import { InfoBadge } from "#/client/shared/components/app-badge";
import {
	AppDashboardActions,
	AppDashboardDescription,
	AppDashboardHeader,
	AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { OwnerDetailsActions } from "./owner-details-actions";

export function OwnerDetailsHeader() {
	const isMobile = useIsMobile();
	const { owner, displayName, formattedPhone, ownerTypeLabel } =
		useOwnerDetails();

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
					<span>{displayName}</span>
					<InfoBadge className="flex gap-2 p-2 text-xs md:p-3 md:text-sm">
						<PhoneCall aria-hidden="true" />
						<span className="font-semibold tracking-wider text-foreground">
							{formattedPhone}
						</span>
					</InfoBadge>
				</AppDashboardTitle>
				<AppDashboardDescription className="flex items-center gap-2">
					<span className="font-mono">{owner.ownerCode}</span>
					<span>·</span>
					<span>{ownerTypeLabel}</span>
				</AppDashboardDescription>
				<AppDashboardActions>
					<OwnerDetailsActions />
				</AppDashboardActions>
			</AppDashboardHeader>
		</>
	);
}
