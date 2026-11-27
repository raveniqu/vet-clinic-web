import { createFileRoute } from "@tanstack/react-router";
import { petsRouteSearchSchema } from "#/client/features/pets/models/pets-route-search.model";
import { PetsScreen } from "#/client/features/pets/screens";
import { PetsScreenLoader } from "#/client/features/pets/screens/loader";

export const Route = createFileRoute("/_private/pets/")({
	validateSearch: petsRouteSearchSchema,
	component: PetsScreen,
	pendingComponent: PetsScreenLoader,
});
