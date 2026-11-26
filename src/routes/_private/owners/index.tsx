import { createFileRoute } from "@tanstack/react-router";
import { ownersListQuery } from "#/client/caches/owners/queries/get-owners.query";
import {
	ownersRouteSearchSchema,
	pickOwnersApiSearchParams,
} from "#/client/features/owners/models/owners-route-search.model";
import { OwnersScreen } from "#/client/features/owners/screens";
import { OwnersScreenLoader } from "#/client/features/owners/screens/loader";

export const Route = createFileRoute("/_private/owners/")({
	validateSearch: ownersRouteSearchSchema,
	loaderDeps: ({ search }) => pickOwnersApiSearchParams(search),
	loader: async ({ context, deps, cause }) => {
		if (cause === "stay") {
			void context.queryClient
				.query(ownersListQuery(deps))
				.catch(() => undefined);
			return;
		}
		return context.queryClient.query(ownersListQuery(deps));
	},
	component: OwnersScreen,
	pendingComponent: OwnersScreenLoader,
});
