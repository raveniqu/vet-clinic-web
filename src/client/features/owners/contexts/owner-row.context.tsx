import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { OwnerListItem } from "#/shared/schemas/owners.schema";

const OwnerRowContext = createContext<OwnerListItem | null>(null);

export function OwnerRowProvider({
	owner,
	children,
}: {
	owner: OwnerListItem;
	children: ReactNode;
}) {
	return (
		<OwnerRowContext.Provider value={owner}>
			{children}
		</OwnerRowContext.Provider>
	);
}

export function useOwnerRow(): OwnerListItem {
	const owner = useContext(OwnerRowContext);
	if (!owner) {
		throw new Error("useOwnerRow must be used inside <OwnerRowProvider>");
	}
	return owner;
}
