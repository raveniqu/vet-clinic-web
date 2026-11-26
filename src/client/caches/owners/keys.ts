import type { OwnersSearchParams } from "#/shared/schemas/owners.schema";

export const ownersKeys = {
	all: ["owners"] as const,
	lists: () => [...ownersKeys.all, "list"] as const,
	list: (params: OwnersSearchParams) =>
		[...ownersKeys.lists(), "list", params] as const,
	detail: (ownerId: number) => [...ownersKeys.all, "detail", ownerId] as const,
};
