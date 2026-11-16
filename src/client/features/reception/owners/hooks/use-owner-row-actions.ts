import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { petsListQueryOptions, speciesQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { useClipboardCopy } from "#/client/shared/hooks/use-clipboard-copy";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import type { PetDto } from "#/shared/schemas/pet.schema";

export function useOwnerPetRelations() {
  const { data: allPets = [] } = useQuery(petsListQueryOptions());
  const { data: speciesList = [] } = useQuery(speciesQueryOptions());

  const petsByOwnerId = useMemo(() => {
    const grouped = new Map<number, PetDto[]>();
    for (const pet of allPets) {
      const existing = grouped.get(pet.ownerId);
      if (existing) {
        existing.push(pet);
      } else {
        grouped.set(pet.ownerId, [pet]);
      }
    }
    return grouped;
  }, [allPets]);

  const speciesCodeById = useMemo(() => {
    const map = new Map<number, string>();
    for (const species of speciesList) {
      map.set(species.id, species.code);
    }
    return map;
  }, [speciesList]);

  return {
    petsByOwnerId,
    speciesCodeById,
  };
}

export function usePdpaPopoverControl(setEditingOwner: (owner: OwnerDto | null) => void) {
  const [openPdpaPopoverOwnerId, setOpenPdpaPopoverOwnerId] = useState<number | null>(null);

  const onPdpaPopoverOpenChange = useCallback((ownerId: number, open: boolean) => {
    setOpenPdpaPopoverOwnerId(open ? ownerId : null);
  }, []);

  const openEditConsent = useCallback(
    (owner: OwnerDto) => {
      setOpenPdpaPopoverOwnerId(null);
      setEditingOwner(owner);
    },
    [setEditingOwner]
  );

  return {
    openPdpaPopoverOwnerId,
    onPdpaPopoverOpenChange,
    openEditConsent,
  };
}

export function useOwnerClipboard() {
  const { copyValue, isCopied } = useClipboardCopy<string>();

  const copyPhone = useCallback(
    (ownerId: number, phone: string) => copyValue(`phone:${ownerId}`, phone),
    [copyValue]
  );

  const isPhoneCopied = useCallback((ownerId: number) => isCopied(`phone:${ownerId}`), [isCopied]);

  const copyTaxId = useCallback(
    (ownerId: number, taxId: string) => copyValue(`tax:${ownerId}`, taxId),
    [copyValue]
  );

  const isTaxIdCopied = useCallback((ownerId: number) => isCopied(`tax:${ownerId}`), [isCopied]);

  return {
    copyPhone,
    isPhoneCopied,
    copyTaxId,
    isTaxIdCopied,
  };
}
