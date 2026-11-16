import { createFileRoute } from "@tanstack/react-router";
import { InventoryScreen } from "#/client/features/pharmacy/inventory/screen";

export const Route = createFileRoute("/_private/(pharmacy)/inventory/")({
  component: InventoryScreen,
});
