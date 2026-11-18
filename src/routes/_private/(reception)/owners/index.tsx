import { createFileRoute } from "@tanstack/react-router";
import { ownersListQueryOptions } from "#/client/caches/owners/queries/owners.query";
import { petsListQueryOptions, speciesQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { OwnersScreen } from "#/client/features/reception/owners/screen/owners.screen";
import { ownersSearchSchema } from "#/shared/schemas/owner.schema";

export const Route = createFileRoute("/_private/(reception)/owners/")({
  validateSearch: ownersSearchSchema,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query(ownersListQueryOptions()),
      context.queryClient.query(petsListQueryOptions()),
      context.queryClient.query(speciesQueryOptions()),
    ]);
  },
  component: OwnersScreen,
});
