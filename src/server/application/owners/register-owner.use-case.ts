import { Owner } from "#/server/domain/owners/entities/owner.entity";
import type { IOwnerRepository } from "#/server/domain/owners/interfaces/owner.interface";
import type {
	OwnerDetailsResponse,
	RegisterOwnerInput,
} from "#/shared/schemas/owners.schema";
import { OwnerMapper } from "../mappers/owner.mapper";

export interface RegisterOwnerUseCaseInput {
	readonly payload: RegisterOwnerInput;
}

export class RegisterOwnerUseCase {
	constructor(private readonly ownerRepository: IOwnerRepository) {}

	async execute(
		input: RegisterOwnerUseCaseInput,
	): Promise<OwnerDetailsResponse> {
		const owner = Owner.create(OwnerMapper.toCreateParams(input.payload));
		const persistedOwner = await this.ownerRepository.create(owner);
		return OwnerMapper.toDto(persistedOwner);
	}
}
