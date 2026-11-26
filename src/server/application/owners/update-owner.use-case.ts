import { NotFoundDomainError } from "#/server/domain/common/errors";
import type { IOwnerRepository } from "#/server/domain/owners/interfaces/owner.interface";
import type { UpdateOwnerInput } from "#/shared/schemas/owners.schema";
import { OwnerMapper } from "../mappers/owner.mapper";

export interface UpdateOwnerUseCaseInput {
	readonly payload: UpdateOwnerInput;
}

export class UpdateOwnerUseCase {
	constructor(private readonly ownerRepository: IOwnerRepository) {}

	async execute(input: UpdateOwnerUseCaseInput): Promise<void> {
		const { ownerId, payload } = input.payload;
		const owner = await this.ownerRepository.findById(ownerId);
		if (!owner) {
			throw new NotFoundDomainError(`Owner ${ownerId} was not found.`);
		}

		owner.updateProfile(OwnerMapper.toUpdateProfileParams(payload));
		await this.ownerRepository.update(owner);
	}
}
