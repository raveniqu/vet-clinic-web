import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { petsListQueryOptions, speciesQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { PetsScreen } from "#/client/features/reception/pets/screen";

export const petsSearchSchema = z.object({
  openAddNewForm: z.boolean().optional().catch(undefined),
  editPetId: z.coerce.number().optional().catch(undefined),
});

export type PetsSearch = z.infer<typeof petsSearchSchema>;

export const Route = createFileRoute("/_private/(reception)/pets/")({
  validateSearch: (search) => petsSearchSchema.parse(search),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query(petsListQueryOptions()),
      context.queryClient.query(speciesQueryOptions()),
    ]);
  },
  component: PetsScreen,
});
