import { createFileRoute } from "@tanstack/react-router";
import { QueueScreen } from "#/client/features/reception/queue/screen";

export const Route = createFileRoute("/_private/(reception)/queue/")({
  component: QueueScreen,
});
