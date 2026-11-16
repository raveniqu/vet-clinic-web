import { createFileRoute } from "@tanstack/react-router";
import { OverviewScreen } from "#/client/features/overview/screen";

export const Route = createFileRoute("/_private/")({
  component: OverviewScreen,
});
