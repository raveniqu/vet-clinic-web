import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { notFound, useParams } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { ownerDetailQueryOptions } from "#/client/caches/owners/queries/owners.query";
import {
  petsByOwnerQueryOptions,
  speciesQueryOptions,
} from "#/client/caches/pets/queries/pets.query";
import { formatThaiLongDate } from "#/client/shared/helpers/formatters";
import { toast } from "#/client/shared/shadcn/components/ui/toast";
import { formatFullAddress, getOwnerDisplayName } from "../models/owners-table";

export function useOwnerDetails() {
  const { ownerId } = useParams({ from: "/_private/(reception)/owners/$ownerId" });

  const { data: owner } = useSuspenseQuery(ownerDetailQueryOptions(ownerId));
  const { data: petsByOwner } = useSuspenseQuery(petsByOwnerQueryOptions(ownerId));
  const { data: speciesList = [] } = useQuery(speciesQueryOptions());

  if (!owner) {
    throw notFound();
  }

  const displayName = getOwnerDisplayName(owner);
  const fullBillingAddress = formatFullAddress(owner);

  const formattedRegisteredDate = useMemo(
    () => formatThaiLongDate(owner.createdAt),
    [owner.createdAt]
  );

  const speciesCodeById = useMemo(() => {
    const map = new Map<number, string>();
    for (const species of speciesList) {
      map.set(species.id, species.code);
    }
    return map;
  }, [speciesList]);

  const handleOpenEmr = useCallback(() => {
    toast.add({
      title: "ฟีเจอร์เวชระเบียน (EMR) อยู่ระหว่างการพัฒนา",
    });
  }, []);

  return {
    owner,
    petsByOwner,
    displayName,
    fullBillingAddress,
    formattedRegisteredDate,
    speciesCodeById,
    handleOpenEmr,
  };
}
