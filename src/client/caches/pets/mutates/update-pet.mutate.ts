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
        return `อัปเดตข้อมูลสัตว์เลี้ยงเรียบร้อยแล้ว (${pet.petName} - ${pet.petCode})`;
      },
      errorToast: "ไม่สามารถอัปเดตข้อมูลสัตว์เลี้ยงได้ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(petKeys.detail(data.id), data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: petKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: ownerKeys.all }),
      ]);
    },
  });
}
