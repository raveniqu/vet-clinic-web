import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerKeys } from "#/client/caches/owners/keys";
import { petKeys } from "#/client/caches/pets/keys";
import { createPetFn } from "#/server-functions/pets/create-pet.fn";
import type { CreatePetInput, PetDto } from "#/shared/schemas/pet.schema";

export function useCreatePetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePetInput): Promise<PetDto> => {
      return createPetFn({ data });
    },
    meta: {
      successToast: (data) => {
        const pet = data as PetDto;
        return `New pet registered successfully (${pet.petName} - ${pet.petCode})`;
      },
      errorToast: "Failed to register new pet. Please check the details and try again.",
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(petKeys.detail(data.id), data);
      const invalidations = [queryClient.invalidateQueries({ queryKey: petKeys.lists() })];

      // Invalidate owner's pets & details in owners cache (Bi-directional sync!)
      if (data.ownerId) {
        invalidations.push(
          queryClient.invalidateQueries({ queryKey: ownerKeys.detail(data.ownerId) }),
          queryClient.invalidateQueries({ queryKey: ownerKeys.lists() })
        );
      }

      await Promise.all(invalidations);
    },
  });
}
