import type {
	OwnerListResponse,
	OwnersSearchParams,
} from "#/shared/schemas/owners.schema";

export interface IOwnerQueryPort {
	listOwners(query: OwnersSearchParams): Promise<OwnerListResponse>;
}
