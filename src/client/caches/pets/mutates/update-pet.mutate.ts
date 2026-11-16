import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerKeys } from "#/client/caches/owners/keys";
import { petKeys } from "#/client/caches/pets/keys";
import { updatePetFn } from "#/server-functions/pets/update-pet.fn";
import type { PetDto, UpdatePetInput } from "#/shared/schemas/pet.schema";

export function useUpdatePetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePetInput): Promise<PetDto> => {
      return updatePetFn({ data });
    },
    meta: {
      successToast: (data) => {
        const pet = data as PetDto;
        return `Pet profile updated successfully (${pet.petName} - ${pet.petCode})`;
      },
      errorToast: "Failed to update pet profile. Please check the details and try again.",
    },
    onSuccess: (data) => {
      queryClient.setQueryData(petKeys.detail(data.id), data);
      void queryClient.invalidateQueries({ queryKey: petKeys.lists() });
      if (data.ownerId) {
        void queryClient.invalidateQueries({ queryKey: ownerKeys.detail(data.ownerId) });
        void queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
      }
    },
  });
}
