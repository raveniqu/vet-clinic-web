import { createFileRoute } from "@tanstack/react-router";
import { PrivateLayout } from "#/client/core/screens/private.layout";

export const Route = createFileRoute("/_private")({
	component: PrivateLayout,
});
