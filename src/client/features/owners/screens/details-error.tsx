import type { ErrorComponentProps } from "@tanstack/react-router";
import { Undo2 } from "lucide-react";
import {
	AppDashboardContent,
	AppDashboardFooter,
	AppDashboardRoot,
} from "#/client/shared/components/app-dashboard";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { OwnerDetailsErrorCard } from "../components/details/owner-details-error-card";
import { OwnerDetailsErrorHeader } from "../components/details/owner-details-error-header";
import { OwnerDetailsErrorProvider } from "../contexts/owner-details-error.context";

export function OwnerDetailsErrorScreen({ error, reset }: ErrorComponentProps) {
	const isMobile = useIsMobile();

	return (
		<OwnerDetailsErrorProvider error={error} reset={reset}>
			<AppDashboardRoot className="mx-auto max-w-7xl pt-0!">
				<OwnerDetailsErrorHeader />
				<AppDashboardContent>
					<OwnerDetailsErrorCard />
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
		</OwnerDetailsErrorProvider>
	);
}
