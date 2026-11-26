import type { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorComponent } from "@tanstack/react-router";

export function AppErrorScreen({ error }: ErrorComponentProps) {
	return (
		<div className="rounded border border-red-500 p-4">
			<h2>Something went wrong!</h2>
			<ErrorComponent error={error} />
		</div>
	);
}
