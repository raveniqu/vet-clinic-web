import { createFileRoute, notFound } from "@tanstack/react-router";
import { getOwnerByIdQuery } from "#/client/caches/owners/queries/get-owner-by-id.query";
import { OwnerDetailsScreen } from "#/client/features/owners/screens/details";
import { OwnerDetailsErrorScreen } from "#/client/features/owners/screens/details-error";
import { OwnerDetailsScreenLoader } from "#/client/features/owners/screens/details-loader";
import { OwnerDetailsNotFoundScreen } from "#/client/features/owners/screens/details-not-found";
import { parseRpcError } from "#/client/shared/helpers/rpc-error";

export const Route = createFileRoute("/_private/owners/$ownerId")({
	loader: async ({ context, params }) => {
		const ownerId = Number(params.ownerId);
		if (!Number.isInteger(ownerId) || ownerId <= 0) {
			throw notFound();
		}

		try {
			return await context.queryClient.ensureQueryData(
				getOwnerByIdQuery(ownerId),
			);
		} catch (error) {
			const parsed = parseRpcError(error);
			if (parsed?.code === "NOT_FOUND") {
				throw notFound();
			}
			throw error;
		}
	},
	component: OwnerDetailsScreen,
	pendingComponent: OwnerDetailsScreenLoader,
	errorComponent: OwnerDetailsErrorScreen,
	notFoundComponent: OwnerDetailsNotFoundScreen,
});
