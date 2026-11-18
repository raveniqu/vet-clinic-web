import {
  Calendar,
  CircleUserRound,
  Edit,
  PawPrint,
  PhoneCall,
  Plus,
  Receipt,
  Undo2,
} from "lucide-react";
import {
  AppDashboardActions,
  AppDashboardContent,
  AppDashboardDescription,
  AppDashboardFooter,
  AppDashboardHeader,
  AppDashboardRoot,
  AppDashboardTitle,
} from "#/client/shared/components/app-dashboard";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "#/client/shared/shadcn/components/ui/tabs";
import { AppButtonLink } from "#/client/shared/components/app-link";
import { InfoBadge } from "#/client/shared/components/app-badge";

import { formatPhoneNumber } from "#/client/shared/helpers/formatters";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { useOwnerDetails } from "../hooks/use-owner-details";

import { OwnerGeneralInfo } from "../components/dashboard/owner-details/owner-general-info";
import { OwnerPetsOwned } from "../components/dashboard/owner-details/owner-pets-owned";
import { OwnerBillingRecords } from "../components/dashboard/owner-details/owner-billing-records";
import { OwnerAppointments } from "../components/dashboard/owner-details/owner-appointments";

export function OwnerDetailsScreen() {
  const isMobile = useIsMobile();
  const { owner, displayName } = useOwnerDetails();

  return (
    <AppDashboardRoot className="mx-auto max-w-7xl pt-0!">
      {!isMobile ? (
        <AppButtonLink
          to="/owners"
          size="xs"
          variant="ghost"
          className="w-fit border-0 shadow-md/10 inset-shadow-sm/5"
        >
          <Undo2 />
          <span>Back to owners</span>
        </AppButtonLink>
      ) : null}
      <AppDashboardHeader>
        <AppDashboardTitle className="flex flex-wrap items-center gap-2">
          <span>{displayName}</span>
          <InfoBadge className="flex gap-2 p-2 text-xs md:p-3 md:text-sm lg:p-4 lg:text-base">
            <PhoneCall />
            <span className="font-semibold tracking-wider text-foreground">
              {formatPhoneNumber(owner.phonePrimary)}
            </span>
          </InfoBadge>
        </AppDashboardTitle>
        <AppDashboardDescription className="flex items-center gap-2"></AppDashboardDescription>
        <AppDashboardActions>
          <Button size={isMobile ? "icon-sm" : "sm"} variant="outline">
            <Edit />
            <span className="sr-only md:not-sr-only">Edit Owner</span>
          </Button>
          <Button size={isMobile ? "icon-sm" : "sm"}>
            <Plus />
            <span className="sr-only md:not-sr-only">Add New Pet</span>
          </Button>
        </AppDashboardActions>
      </AppDashboardHeader>
      <AppDashboardContent>
        <Tabs className="col-span-full">
          <TabsList
            variant="line"
            className="w-full overflow-x-auto **:after:bg-primary **:aria-selected:text-primary md:w-fit"
          >
            <TabsTrigger value="general-info">
              <CircleUserRound />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="pets-owned">
              <PawPrint />
              <span>Pets</span>
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="billing-records">
              <Receipt />
              <span>Billings</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general-info">
            <OwnerGeneralInfo />
          </TabsContent>
          <TabsContent value="pets-owned">
            <OwnerPetsOwned />
          </TabsContent>
          <TabsContent value="appointments">
            <OwnerAppointments />
          </TabsContent>
          <TabsContent value="billing-records">
            <OwnerBillingRecords />
          </TabsContent>
        </Tabs>
      </AppDashboardContent>
      {isMobile ? (
        <AppDashboardFooter className="mt-auto">
          <AppButtonLink
            to="/owners"
            size="sm"
            variant="ghost"
            className="border-0 shadow-md/10 inset-shadow-sm/5"
          >
            <Undo2 />
            <span>Back to owners</span>
          </AppButtonLink>
        </AppDashboardFooter>
      ) : null}
    </AppDashboardRoot>
  );
}
