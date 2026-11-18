import { createFileRoute } from "@tanstack/react-router";
import { petsListQueryOptions, speciesQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { PetsScreen } from "#/client/features/reception/pets/screen/pets.screen";
import { petsSearchSchema } from "#/shared/schemas/pet.schema";

export const Route = createFileRoute("/_private/(reception)/pets/")({
  validateSearch: petsSearchSchema,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query(petsListQueryOptions()),
      context.queryClient.query(speciesQueryOptions()),
    ]);
  },
  component: PetsScreen,
});
