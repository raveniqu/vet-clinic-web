import type {
	OwnerListResponse,
	OwnersSearchParams,
} from "#/shared/schemas/owners.schema";
import type { IOwnerQueryPort } from "./owner-query.port";

export interface ListOwnersUseCaseInput {
	readonly payload: OwnersSearchParams;
}

export class ListOwnersUseCase {
	constructor(private readonly ownerQueryPort: IOwnerQueryPort) {}

	async execute(input: ListOwnersUseCaseInput): Promise<OwnerListResponse> {
		return this.ownerQueryPort.listOwners(input.payload);
	}
}
