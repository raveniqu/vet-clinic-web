import { createFileRoute } from "@tanstack/react-router";
import { DiagnosticsScreen } from "#/client/features/clinical/diagnostics/screen";

export const Route = createFileRoute("/_private/(clinical)/diagnostics/")({
  component: DiagnosticsScreen,
});
