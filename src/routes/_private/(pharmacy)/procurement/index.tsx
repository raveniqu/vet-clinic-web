import { createFileRoute } from "@tanstack/react-router";
import { ProcurementScreen } from "#/client/features/pharmacy/procurement/screen";

export const Route = createFileRoute("/_private/(pharmacy)/procurement/")({
  component: ProcurementScreen,
});
