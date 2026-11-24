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
import { OwnersTable } from "../components/dashboard/owners-table";
import { OwnersToolbar } from "../components/dashboard/owners-toolbar";
import { RecentVisits } from "../components/dashboard/recent-visits";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { AddNewOwnerForm } from "../components/form/create/add-new-owner-form";
import { EditOwnerForm } from "../components/form/update/edit-owner-form";
import { AddNewOwnerFormProvider } from "../contexts/add-new-owner-form-provider";
import { OwnersProvider } from "../contexts/owners.context";
import { useOwnersScreen } from "../hooks/use-owners-screen";

export function OwnersScreen() {
  const { isMobile } = useOwnersScreen();

  return (
    <OwnersProvider>
      <AppDashboardRoot className="mx-auto max-w-7xl">
        <AppDashboardHeader>
          <AppDashboardTitle>ข้อมูลเจ้าของสัตว์เลี้ยง</AppDashboardTitle>
          <AppDashboardDescription>
            จัดการประวัติเจ้าของสัตว์เลี้ยง ประวัติการเข้ารับบริการล่าสุด และสถานะความยินยอม PDPA
          </AppDashboardDescription>
          <AppDashboardActions>
            <AddNewOwnerFormProvider>
              <AddNewOwnerForm />
            </AddNewOwnerFormProvider>
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
        <EditOwnerForm />
      </AppDashboardRoot>
    </OwnersProvider>
  );
}
