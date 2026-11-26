import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { ownersKeys } from "#/client/caches/owners/keys";
import { useOwnerDetailsErrorContext } from "../contexts/owner-details-error.context";
import { classifyOwnerDetailsError } from "../models/owner-details-error.model";

export function useOwnerDetailsError() {
	const { error, reset } = useOwnerDetailsErrorContext();
	const params = useParams({ strict: false });
	const queryClient = useQueryClient();
	const router = useRouter();

	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [isRetrying, setIsRetrying] = useState(false);

	const rawOwnerId = typeof params.ownerId === "string" ? params.ownerId : "";
	const numericOwnerId = useMemo(() => {
		const parsed = Number(rawOwnerId);
		return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
	}, [rawOwnerId]);

	const ownerIdLabel = rawOwnerId ? `#${rawOwnerId}` : "ไม่ระบุรหัส";

	const presentation = useMemo(() => classifyOwnerDetailsError(error), [error]);

	const retryLoadOwner = useCallback(async () => {
		if (isRetrying) return;
		setIsRetrying(true);
		try {
			if (numericOwnerId !== null) {
				await queryClient.resetQueries({
					queryKey: ownersKeys.detail(numericOwnerId),
					exact: true,
				});
			}
			await router.invalidate();
			reset();
		} finally {
			setIsRetrying(false);
		}
	}, [isRetrying, numericOwnerId, queryClient, reset, router]);

	return {
		ownerIdLabel,
		presentation,
		isDetailsOpen,
		setIsDetailsOpen,
		isRetrying,
		retryLoadOwner,
	};
}
