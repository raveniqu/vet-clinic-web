import {
	AppDashboardActions,
	AppDashboardContent,
	AppDashboardDescription,
	AppDashboardHeader,
	AppDashboardRoot,
	AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";
import { MobileView } from "../components/dashboard/mobile-view";
import { NewCustomers } from "../components/dashboard/new-customers";
import { OwnerDeleteAlertDialog } from "../components/dashboard/owner-delete-alert-dialog";
import { OwnersTable } from "../components/dashboard/owners-table";
import { OwnersToolbar } from "../components/dashboard/owners-toolbar";
import { RecentVisits } from "../components/dashboard/recent-visits";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { AddNewOwnerTrigger } from "../components/form/add-new-owner-trigger";
import { OwnerFormSheet } from "../components/form/owner-form-sheet";
import { OwnerDeleteProvider } from "../contexts/owner-delete.context";
import { OwnerFormProvider } from "../contexts/owner-form.context";
import { OwnersDashboardProvider } from "../contexts/owners-dashboard.context";
import { useOwnersScreen } from "../hooks/use-owners-screen";

export function OwnersScreen() {
	const { isMobile } = useOwnersScreen();

	return (
		<OwnersDashboardProvider>
			<OwnerFormProvider>
				<OwnerDeleteProvider>
					<AppDashboardRoot className="mx-auto max-w-7xl">
						<AppDashboardHeader>
							<AppDashboardTitle>ข้อมูลเจ้าของสัตว์เลี้ยง</AppDashboardTitle>
							<AppDashboardDescription>
								จัดการประวัติเจ้าของสัตว์เลี้ยง ค้นหา แก้ไขข้อมูล และสถานะความยินยอม PDPA
							</AppDashboardDescription>
							<AppDashboardActions>
								<AddNewOwnerTrigger />
							</AppDashboardActions>
						</AppDashboardHeader>
						<AppDashboardContent>
							<div className="col-span-full flex flex-col gap-x-4 gap-y-6 xl:col-span-8">
								<OwnersToolbar />
								{isMobile ? <MobileView /> : <OwnersTable />}
							</div>
							<div className="col-span-full flex flex-col gap-x-4 gap-y-6 xl:col-span-4">
								<RecentVisits />
								<NewCustomers />
								<TotalCustomers />
							</div>
						</AppDashboardContent>
					</AppDashboardRoot>
					<OwnerFormSheet />
					<OwnerDeleteAlertDialog />
				</OwnerDeleteProvider>
			</OwnerFormProvider>
		</OwnersDashboardProvider>
	);
}
