import { createFileRoute, notFound } from "@tanstack/react-router";
import { ownerDetailQueryOptions } from "#/client/caches/owners/queries/owners.query";
import {
  petsByOwnerQueryOptions,
  speciesQueryOptions,
} from "#/client/caches/pets/queries/pets.query";
import { OwnerDetailsScreen } from "#/client/features/reception/owners/screen/owner-details.screen";
import { OwnerNotFoundScreen } from "#/client/features/reception/owners/screen/owner-not-found.screen";
import { getOwnerByIdSchema } from "#/shared/schemas/owner.schema";

export const Route = createFileRoute("/_private/(reception)/owners/$ownerId")({
  loader: async ({ context, params }) => {
    const parsed = getOwnerByIdSchema.safeParse({
      id: Number(params.ownerId),
    });

    if (!parsed.success) {
      throw notFound();
    }

    const [owner] = await Promise.all([
      context.queryClient.query(ownerDetailQueryOptions(parsed.data.id)),
      context.queryClient.query(petsByOwnerQueryOptions(parsed.data.id)),
      context.queryClient.query(speciesQueryOptions()),
    ]);

    if (!owner) {
      throw notFound();
    }

    return owner;
  },
  notFoundComponent: OwnerNotFoundScreen,
  component: OwnerDetailsScreen,
});
