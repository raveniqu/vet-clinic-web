import type { ErrorComponentProps } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

interface OwnerDetailsErrorContextValue {
	readonly error: ErrorComponentProps["error"];
	readonly reset: ErrorComponentProps["reset"];
}

const OwnerDetailsErrorContext =
	createContext<OwnerDetailsErrorContextValue | null>(null);

export function OwnerDetailsErrorProvider({
	error,
	reset,
	children,
}: ErrorComponentProps & {
	readonly children: ReactNode;
}) {
	const value = useMemo<OwnerDetailsErrorContextValue>(
		() => ({ error, reset }),
		[error, reset],
	);

	return (
		<OwnerDetailsErrorContext.Provider value={value}>
			{children}
		</OwnerDetailsErrorContext.Provider>
	);
}

export function useOwnerDetailsErrorContext(): OwnerDetailsErrorContextValue {
	const context = useContext(OwnerDetailsErrorContext);
	if (!context) {
		throw new Error(
			"useOwnerDetailsErrorContext must be used inside <OwnerDetailsErrorProvider>",
		);
	}
	return context;
}
