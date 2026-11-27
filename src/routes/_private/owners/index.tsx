import { createFileRoute } from "@tanstack/react-router";
import { getOwnersQuery } from "#/client/caches/owners/queries/get-owners.query";
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
				.query(getOwnersQuery(deps))
				.catch(() => undefined);
			return;
		}
		return context.queryClient.query(getOwnersQuery(deps));
	},
	component: OwnersScreen,
	pendingComponent: OwnersScreenLoader,
});
