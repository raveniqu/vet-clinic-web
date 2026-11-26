import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { useDeleteOwnerMutation } from "#/client/caches/owners/mutates/delete-owner.mutate";

export interface DeleteOwnerTarget {
	readonly ownerId: number;
	readonly displayName: string;
	readonly ownerCode?: string;
	readonly redirectToList?: boolean;
}

interface OwnerDeleteContextValue {
	deletingTarget: DeleteOwnerTarget | null;
	isPending: boolean;
	requestDelete: (target: DeleteOwnerTarget) => void;
	closeDeleteDialog: () => void;
	confirmDelete: () => Promise<void>;
}

const OwnerDeleteContext = createContext<OwnerDeleteContextValue | null>(null);

export function OwnerDeleteProvider({ children }: { children: ReactNode }) {
	const navigate = useNavigate();
	const deleteMutation = useDeleteOwnerMutation();
	const [deletingTarget, setDeletingTarget] =
		useState<DeleteOwnerTarget | null>(null);

	const requestDelete = useCallback((target: DeleteOwnerTarget) => {
		setDeletingTarget(target);
	}, []);

	const closeDeleteDialog = useCallback(() => {
		if (deleteMutation.isPending) return;
		setDeletingTarget(null);
	}, [deleteMutation.isPending]);

	const confirmDelete = useCallback(async () => {
		if (!deletingTarget) return;
		const { ownerId, redirectToList } = deletingTarget;

		try {
			await deleteMutation.mutateAsync({ ownerId });
			setDeletingTarget(null);
			if (redirectToList) {
				await navigate({ to: "/owners", replace: true });
			}
		} catch {
			// Error toast is centrally handled by MutationCache in client/caches/global.ts
		}
	}, [deleteMutation, deletingTarget, navigate]);

	const value = useMemo<OwnerDeleteContextValue>(
		() => ({
			deletingTarget,
			isPending: deleteMutation.isPending,
			requestDelete,
			closeDeleteDialog,
			confirmDelete,
		}),
		[
			deletingTarget,
			deleteMutation.isPending,
			requestDelete,
			closeDeleteDialog,
			confirmDelete,
		],
	);

	return (
		<OwnerDeleteContext.Provider value={value}>
			{children}
		</OwnerDeleteContext.Provider>
	);
}

export function useOwnerDeleteContext(): OwnerDeleteContextValue {
	const context = useContext(OwnerDeleteContext);
	if (!context) {
		throw new Error(
			"useOwnerDeleteContext must be used inside <OwnerDeleteProvider>",
		);
	}
	return context;
}
