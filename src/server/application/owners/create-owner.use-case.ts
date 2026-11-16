import type { IOwnerRepository } from "#/server/domain/owners/owner.repository.interface";
import type { CreateOwnerInput, OwnerDto } from "#/shared/schemas/owner.schema";

export class CreateOwnerUseCase {
  constructor(private readonly ownerRepository: IOwnerRepository) {}

  async execute(input: CreateOwnerInput): Promise<OwnerDto> {
    return this.ownerRepository.create(input);
  }
}
