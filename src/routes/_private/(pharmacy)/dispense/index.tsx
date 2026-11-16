import { createFileRoute } from "@tanstack/react-router";
import { DispenseScreen } from "#/client/features/pharmacy/dispense/screen";

export const Route = createFileRoute("/_private/(pharmacy)/dispense/")({
  component: DispenseScreen,
});
