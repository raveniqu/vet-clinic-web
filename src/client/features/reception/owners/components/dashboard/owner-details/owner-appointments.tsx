import { Calendar } from "lucide-react";
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";

export function OwnerAppointments() {
  return (
    <AppCard className="mt-4">
      <AppCardHeader>
        <AppCardTitle>
          <Calendar className="size-4 text-primary" />
          <span>Appointment Record</span>
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent>
        <p className="text-lg">Waiting for Domain 2</p>
      </AppCardContent>
    </AppCard>
  );
}
