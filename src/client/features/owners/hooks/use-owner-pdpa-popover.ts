import { useCallback, useMemo, useState } from "react";
import { useOwnerFormContext } from "../contexts/owner-form.context";
import { useOwnerRow } from "../contexts/owner-row.context";
import {
	getOwnerDisplayName,
	getPdpaConsentSummary,
} from "../models/owners-table.model";

export function useOwnerPdpaPopover() {
	const owner = useOwnerRow();
	const { openEdit } = useOwnerFormContext();
	const [isOpen, setIsOpen] = useState(false);

	const displayName = useMemo(() => getOwnerDisplayName(owner), [owner]);
	const pdpa = useMemo(
		() => getPdpaConsentSummary(owner.consents),
		[owner.consents],
	);

	const handleEditConsent = useCallback(() => {
		setIsOpen(false);
		openEdit(owner.ownerId);
	}, [openEdit, owner.ownerId]);

	return {
		isOpen,
		setIsOpen,
		displayName,
		pdpa,
		handleEditConsent,
	};
}
