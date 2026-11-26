import { useCallback } from "react";
import { useClipboardCopy } from "#/client/shared/hooks/use-clipboard-copy";

export function useOwnerClipboard() {
	const { copyValue, isCopied } = useClipboardCopy<string>();

	const copyPhone = useCallback(
		(ownerId: number, phone: string) => copyValue(`phone:${ownerId}`, phone),
		[copyValue],
	);

	const isPhoneCopied = useCallback(
		(ownerId: number) => isCopied(`phone:${ownerId}`),
		[isCopied],
	);

	const copyTaxId = useCallback(
		(ownerId: number, taxId: string) => copyValue(`tax:${ownerId}`, taxId),
		[copyValue],
	);

	const isTaxIdCopied = useCallback(
		(ownerId: number) => isCopied(`tax:${ownerId}`),
		[isCopied],
	);

	return {
		copyPhone,
		isPhoneCopied,
		copyTaxId,
		isTaxIdCopied,
	};
}
