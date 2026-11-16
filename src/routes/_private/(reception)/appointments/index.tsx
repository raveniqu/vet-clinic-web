import { AppointmentsScreen } from "#/client/features/reception/appointments/screen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(reception)/appointments/")({
  component: AppointmentsScreen,
});
