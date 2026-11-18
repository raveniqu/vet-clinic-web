import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound, useParams } from "@tanstack/react-router";
import { petDetailQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";

export function usePetDetails() {
  const isMobile = useIsMobile();
  const { petId } = useParams({ from: "/_private/(reception)/pets/$petId" });

  const { data: pet } = useSuspenseQuery(petDetailQueryOptions(petId));

  if (!pet) {
    throw notFound();
  }

  return {
    pet,
    isMobile,
  };
}
