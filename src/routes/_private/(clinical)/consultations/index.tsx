import { createFileRoute } from "@tanstack/react-router";
import { ConsultationScreen } from "#/client/features/clinical/consultations/screen";

export const Route = createFileRoute("/_private/(clinical)/consultations/")({
  component: ConsultationScreen,
});
