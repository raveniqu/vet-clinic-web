import { cn } from "cn";
import { RefreshCw, Undo2 } from "lucide-react";
import { useOwnerDetailsError } from "#/client/features/owners/hooks/use-owner-details-error";
import {
	NegativeBadge,
	WarningBadge,
} from "#/client/shared/components/app-badge";
import {
	AppDashboardActions,
	AppDashboardDescription,
	AppDashboardHeader,
	AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function OwnerDetailsErrorHeader() {
	const isMobile = useIsMobile();
	const { ownerIdLabel, presentation, isRetrying, retryLoadOwner } =
		useOwnerDetailsError();

	const isWarningTone =
		presentation.kind === "unauthorized" || presentation.kind === "forbidden";

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
					<span>{presentation.title}</span>
					{isWarningTone ? (
						<WarningBadge>{presentation.badgeLabel}</WarningBadge>
					) : (
						<NegativeBadge>{presentation.badgeLabel}</NegativeBadge>
					)}
				</AppDashboardTitle>
				<AppDashboardDescription className="flex items-center gap-2">
					<span className="font-mono">ID: {ownerIdLabel}</span>
					<span>·</span>
					<span>ประวัติเจ้าของสัตว์เลี้ยง</span>
				</AppDashboardDescription>
				<AppDashboardActions>
					<Button
						type="button"
						size={isMobile ? "icon-sm" : "sm"}
						variant="outline"
						disabled={isRetrying}
						aria-label={isRetrying ? "กำลังลองโหลดข้อมูลใหม่" : "ลองโหลดข้อมูลใหม่"}
						onClick={() => void retryLoadOwner()}
					>
						<RefreshCw
							className={cn(
								isRetrying && "animate-spin motion-reduce:animate-none",
							)}
							aria-hidden="true"
						/>
						<span className="sr-only md:not-sr-only">
							{isRetrying ? "กำลังลองโหลดใหม่..." : "ลองโหลดข้อมูลใหม่"}
						</span>
					</Button>
				</AppDashboardActions>
			</AppDashboardHeader>
		</>
	);
}
