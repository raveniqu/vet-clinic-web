import { createFileRoute } from "@tanstack/react-router";
import { CashierScreen } from "#/client/features/financial/cashier/screen";

export const Route = createFileRoute("/_private/(financial)/cashier/")({
  component: CashierScreen,
});
