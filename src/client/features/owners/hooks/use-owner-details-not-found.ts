import { useParams } from "@tanstack/react-router";

export function useOwnerDetailsNotFound() {
	const params = useParams({ strict: false });
	const rawOwnerId = typeof params.ownerId === "string" ? params.ownerId : "";
	const ownerIdLabel = rawOwnerId ? `#${rawOwnerId}` : "ไม่ระบุรหัส";

	return {
		rawOwnerId,
		ownerIdLabel,
	};
}
