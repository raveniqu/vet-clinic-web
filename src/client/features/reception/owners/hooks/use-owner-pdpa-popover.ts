import { useCallback, useMemo, useState } from "react";
import { useOwnerRow } from "../contexts/owner-row.context";
import { useOwnersContext } from "../contexts/owners.context";
import { getOwnerDisplayName, getPdpaConsentSummary } from "../models/owners-table";

export function useOwnerPdpaPopover() {
  const owner = useOwnerRow();
  const { openEditDialog } = useOwnersContext();
  const [isOpen, setIsOpen] = useState(false);

  const displayName = useMemo(() => getOwnerDisplayName(owner), [owner]);
  const pdpa = useMemo(() => getPdpaConsentSummary(owner), [owner]);

  const handleEditConsent = useCallback(() => {
    setIsOpen(false);
    openEditDialog(owner);
  }, [openEditDialog, owner]);

  return {
    isOpen,
    setIsOpen,
    displayName,
    pdpa,
    handleEditConsent,
  };
}
