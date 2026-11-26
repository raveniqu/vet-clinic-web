import { useCallback } from "react";
import { useOwnerDeleteContext } from "../contexts/owner-delete.context";
import { useOwnerFormContext } from "../contexts/owner-form.context";
import { useOwnerRow } from "../contexts/owner-row.context";
import { getOwnerDisplayName } from "../models/owners-table.model";
import { useOwnerClipboard } from "./use-owner-clipboard";

export function useOwnerRowActions() {
	const owner = useOwnerRow();
	const { openEdit } = useOwnerFormContext();
	const { requestDelete } = useOwnerDeleteContext();
	const { copyPhone, isPhoneCopied } = useOwnerClipboard();

	const displayName = getOwnerDisplayName(owner);
	const phoneCopied = isPhoneCopied(owner.ownerId);

	const handleEditProfile = useCallback(() => {
		openEdit(owner.ownerId);
	}, [openEdit, owner.ownerId]);

	const handleCopyPhone = useCallback(() => {
		void copyPhone(owner.ownerId, owner.phoneNumber);
	}, [copyPhone, owner.ownerId, owner.phoneNumber]);

	const handleRequestDelete = useCallback(() => {
		requestDelete({
			ownerId: owner.ownerId,
			displayName,
			ownerCode: owner.ownerCode,
		});
	}, [displayName, owner.ownerCode, owner.ownerId, requestDelete]);

	return {
		ownerIdParam: String(owner.ownerId),
		displayName,
		phoneCopied,
		handleEditProfile,
		handleCopyPhone,
		handleRequestDelete,
	};
}
