import { createFileRoute } from "@tanstack/react-router";
import { SurgeryScreen } from "#/client/features/clinical/surgery/screen";

export const Route = createFileRoute("/_private/(clinical)/surgery/")({
  component: SurgeryScreen,
});
