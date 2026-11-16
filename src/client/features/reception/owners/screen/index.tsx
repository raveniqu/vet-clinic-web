import {
  AppDashboardActions,
  AppDashboardContent,
  AppDashboardDescription,
  AppDashboardHeader,
  AppDashboardRoot,
  AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";

import { AddNewOwnerFormProvider } from "../contexts/add-new-owner-form-provider";
import { OwnersDashboardProvider } from "../contexts/owners-dashboard-provider";
import { AddNewOwnerForm } from "../components/form/create/add-new-owner-form";
import { EditOwnerForm } from "../components/form/update/edit-owner-form";

import { OwnersToolbar } from "../components/dashboard/owners-toolbar";
import { MainTable } from "../components/dashboard/main-table";
import { MobileView } from "../components/dashboard/mobile-view";
import { NewCustomers } from "../components/dashboard/new-customers";
import { TotalCustomers } from "../components/dashboard/total-customers";
import { RecentVisits } from "../components/dashboard/recent-visits";

import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function OwnersScreen() {
  const isMobile = useIsMobile();

  return (
    <OwnersDashboardProvider>
      <AppDashboardRoot className="mx-auto max-w-7xl">
        <AppDashboardHeader>
          <AppDashboardTitle>Owner Information</AppDashboardTitle>
          <AppDashboardDescription>
            Manage pet owner profiles, recent visits, and PDPA compliance status.
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
            {isMobile ? <MobileView /> : <MainTable />}
          </div>
          <div className="col-span-full flex flex-col gap-x-4 gap-y-6 xl:col-span-4">
            <RecentVisits />
            <NewCustomers />
            <TotalCustomers />
          </div>
        </AppDashboardContent>
        <EditOwnerForm />
      </AppDashboardRoot>
    </OwnersDashboardProvider>
  );
}
