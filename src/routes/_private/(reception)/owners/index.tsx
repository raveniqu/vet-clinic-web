import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ownersListQueryOptions } from "#/client/caches/owners/queries/owners.query";
import { petsListQueryOptions, speciesQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { OwnersScreen } from "#/client/features/reception/owners/screen";

export const ownersSearchSchema = z.object({
  openAddNewForm: z.boolean().optional().catch(undefined),
  editOwnerId: z.coerce.number().optional().catch(undefined),
});

export type OwnersSearch = z.infer<typeof ownersSearchSchema>;

export const Route = createFileRoute("/_private/(reception)/owners/")({
  validateSearch: (search) => ownersSearchSchema.parse(search),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query(ownersListQueryOptions()),
      context.queryClient.query(petsListQueryOptions()),
      context.queryClient.query(speciesQueryOptions()),
    ]);
  },
  component: OwnersScreen,
});
