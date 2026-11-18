import { petDetailQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { PetDetailsScreen } from "#/client/features/reception/pets/screen/pet-details.screen";
import { getPetByIdSchema } from "#/shared/schemas/pet.schema";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(reception)/pets/$petId")({
  loader: async ({ context, params }) => {
    const parsed = getPetByIdSchema.safeParse({
      id: params.petId,
    });

    if (!parsed.success) {
      throw notFound();
    }

    const [pet] = await Promise.all([
      context.queryClient.query(petDetailQueryOptions(parsed.data.id)),
    ]);

    if (!pet) {
      throw notFound();
    }

    return pet;
  },
  component: PetDetailsScreen,
});
