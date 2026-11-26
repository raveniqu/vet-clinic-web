import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOwnerFn } from "#/server-functions/owners/delete-owner.fn";
import type { DeleteOwnerInput } from "#/shared/schemas/owners.schema";
import { ownersKeys } from "../keys";

export function useDeleteOwnerMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: DeleteOwnerInput) => deleteOwnerFn({ data: input }),
		meta: {
			successToast: "ลบข้อมูลเจ้าของสัตว์เรียบร้อยแล้ว",
		},
		onSuccess: async (_data, variables) => {
			const detailKey = ownersKeys.detail(variables.ownerId);
			await queryClient.cancelQueries({ queryKey: detailKey });
			queryClient.removeQueries({
				queryKey: detailKey,
				exact: true,
				type: "inactive",
			});
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: detailKey,
					exact: true,
					refetchType: "none",
				}),
				queryClient.invalidateQueries({ queryKey: ownersKeys.lists() }),
			]);
		},
	});
}
