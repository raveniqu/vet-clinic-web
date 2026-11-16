import { AppDashboardContent, AppDashboardRoot } from "#/client/shared/components/app-dashboard";
import { useParams } from "@tanstack/react-router";

export function OwnerNotFoundScreen() {
  const { ownerId } = useParams({ from: "/_private/(reception)/owners/$ownerId" });

  return (
    <AppDashboardRoot>
      <AppDashboardContent>
        <p className="col-span-full">Owner with ID "{ownerId}" not found</p>
      </AppDashboardContent>
    </AppDashboardRoot>
  );
}
