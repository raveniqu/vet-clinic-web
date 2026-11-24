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
        return `ลงทะเบียนเจ้าของสัตว์เลี้ยงเรียบร้อยแล้ว (${fullName} - ${owner.customerCode})`;
      },
      errorToast: "ไม่สามารถลงทะเบียนเจ้าของสัตว์เลี้ยงได้ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(ownerKeys.detail(data.id), data);
      await queryClient.invalidateQueries({ queryKey: ownerKeys.lists() });
    },
  });
}
