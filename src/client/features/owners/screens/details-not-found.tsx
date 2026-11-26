import { Undo2 } from "lucide-react";
import {
	AppDashboardContent,
	AppDashboardFooter,
	AppDashboardRoot,
} from "#/client/shared/components/app-dashboard";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { OwnerDetailsNotFoundCard } from "../components/details/owner-details-not-found-card";
import { OwnerDetailsNotFoundHeader } from "../components/details/owner-details-not-found-header";

export function OwnerDetailsNotFoundScreen() {
	const isMobile = useIsMobile();

	return (
		<AppDashboardRoot className="mx-auto max-w-7xl pt-0!">
			<OwnerDetailsNotFoundHeader />
			<AppDashboardContent>
				<OwnerDetailsNotFoundCard />
			</AppDashboardContent>
			{isMobile ? (
				<AppDashboardFooter className="mt-auto">
					<AppButtonLink to="/owners" size="sm" variant="outline">
						<Undo2 aria-hidden="true" />
						<span>กลับไปหน้ารายชื่อเจ้าของ</span>
					</AppButtonLink>
				</AppDashboardFooter>
			) : null}
		</AppDashboardRoot>
	);
}
