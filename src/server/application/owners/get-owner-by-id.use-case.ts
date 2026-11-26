import { NotFoundDomainError } from "#/server/domain/common/errors";
import type { IOwnerRepository } from "#/server/domain/owners/interfaces/owner.interface";
import type { OwnerDetailsResponse } from "#/shared/schemas/owners.schema";
import { OwnerMapper } from "../mappers/owner.mapper";

export interface GetOwnerByIdUseCaseInput {
	readonly ownerId: number;
}

export class GetOwnerByIdUseCase {
	constructor(private readonly ownerRepository: IOwnerRepository) {}

	async execute(
		input: GetOwnerByIdUseCaseInput,
	): Promise<OwnerDetailsResponse> {
		const owner = await this.ownerRepository.findById(input.ownerId);
		if (!owner) {
			throw new NotFoundDomainError(`Owner ${input.ownerId} was not found.`);
		}
		return OwnerMapper.toDto(owner);
	}
}
