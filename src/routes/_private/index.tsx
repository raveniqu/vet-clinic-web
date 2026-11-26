import { createFileRoute } from "@tanstack/react-router";
import { WorkSpaceScreen } from "#/client/features/workspace/screen";

export const Route = createFileRoute("/_private/")({
	component: WorkSpaceScreen,
});
