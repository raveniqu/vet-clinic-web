import {
	AppDashboardContent,
	AppDashboardHeader,
	AppDashboardRoot,
} from "#/client/shared/components/app-dashboard";
import { Skeleton } from "#/client/shared/shadcn/components/ui/skeleton";

export function OwnerDetailsScreenLoader() {
	return (
		<AppDashboardRoot className="mx-auto max-w-7xl pt-0!">
			<Skeleton className="h-7 w-44" />
			<AppDashboardHeader>
				<Skeleton className="h-10 w-72" />
				<Skeleton className="h-5 w-48" />
			</AppDashboardHeader>
			<AppDashboardContent>
				<div className="col-span-full flex flex-col gap-4">
					<Skeleton className="h-10 w-80" />
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<Skeleton className="h-32 w-full rounded-2xl" />
						<Skeleton className="h-32 w-full rounded-2xl" />
					</div>
					<Skeleton className="h-64 w-full rounded-2xl" />
				</div>
			</AppDashboardContent>
		</AppDashboardRoot>
	);
}
