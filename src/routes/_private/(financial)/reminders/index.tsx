import { createFileRoute } from "@tanstack/react-router";
import { RemindersScreen } from "#/client/features/financial/reminders/screen";

export const Route = createFileRoute("/_private/(financial)/reminders/")({
  component: RemindersScreen,
});
