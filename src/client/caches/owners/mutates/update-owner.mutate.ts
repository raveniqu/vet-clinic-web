import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerKeys } from "#/client/caches/owners/keys";
import { petKeys } from "#/client/caches/pets/keys";
import { updateOwnerFn } from "#/server-functions/owners/update-owner.fn";
import type { OwnerDto, UpdateOwnerInput } from "#/shared/schemas/owner.schema";

export function useUpdateOwnerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateOwnerInput): Promise<OwnerDto> => {
      return updateOwnerFn({ data });
    },
    meta: {
      successToast: (data) => {
        const owner = data as OwnerDto;
        const fullName = `${owner.prefix} ${owner.firstName} ${owner.lastName}`.trim();
        return `Owner profile updated successfully (${fullName} - ${owner.customerCode})`;
      },
      errorToast: "Failed to update owner profile. Please check the details and try again.",
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(ownerKeys.detail(data.id), data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ownerKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: petKeys.all }),
      ]);
    },
  });
}
