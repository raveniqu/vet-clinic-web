import { PetsLayout } from "#/client/features/reception/pets/screen/pets.layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/(reception)/pets")({
  component: PetsLayout,
});
