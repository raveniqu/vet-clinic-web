import type { IOwnerRepository } from "#/server/domain/owners/interfaces/owner.interface";

export interface DeleteOwnerUseCaseInput {
	readonly ownerId: number;
}

export class DeleteOwnerUseCase {
	constructor(private readonly ownerRepository: IOwnerRepository) {}

	async execute(input: DeleteOwnerUseCaseInput): Promise<void> {
		await this.ownerRepository.deleteById(input.ownerId);
	}
}
