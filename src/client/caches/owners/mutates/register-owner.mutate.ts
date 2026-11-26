import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerOwnerFn } from "#/server-functions/owners/register-owner.fn";
import type { RegisterOwnerInput } from "#/shared/schemas/owners.schema";
import { ownersKeys } from "../keys";

export function useRegisterOwnerMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: RegisterOwnerInput) => registerOwnerFn({ data: input }),
		meta: {
			successToast: "เพิ่มเจ้าของใหม่สำเร็จ",
		},
		onSuccess: async (createdOwner) => {
			queryClient.setQueryData(
				ownersKeys.detail(createdOwner.ownerId),
				createdOwner,
			);
			await queryClient.invalidateQueries({ queryKey: ownersKeys.lists() });
		},
	});
}
