import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOwnerFn } from "#/server-functions/owners/update-owner.fn";
import type { UpdateOwnerInput } from "#/shared/schemas/owners.schema";
import { ownersKeys } from "../keys";

export function useUpdateOwnerMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: UpdateOwnerInput) => updateOwnerFn({ data: input }),
		meta: { successToast: "บันทึกการแก้ไขเจ้าของสำเร็จ" },
		onSuccess: async (_data, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ownersKeys.lists() }),
				queryClient.invalidateQueries({
					queryKey: ownersKeys.detail(variables.ownerId),
					exact: true,
				}),
			]);
		},
	});
}
