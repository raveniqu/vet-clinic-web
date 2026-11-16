import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerKeys } from "#/client/caches/owners/keys";
import { createOwnerFn } from "#/server-functions/owners/create-owner.fn";
import type { CreateOwnerInput, OwnerDto } from "#/shared/schemas/owner.schema";

export function useCreateOwnerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOwnerInput): Promise<OwnerDto> => {
      return createOwnerFn({ data });
    },
    meta: {
      successToast: (data) => {
        const owner = data as OwnerDto;
        const fullName = `${owner.prefix} ${owner.firstName} ${owner.lastName}`.trim();
        return `New owner registered successfully (${fullName} - ${owner.customerCode})`;
      },
      errorToast: "Failed to register new owner. Please check the details and try again.",
    },
    onSuccess: (data) => {
      queryClient.setQueryData(ownerKeys.detail(data.id), data);
      void queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
    },
  });
}
