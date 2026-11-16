import type { IOwnerRepository } from "#/server/domain/owners/owner.repository.interface";
import type { OwnerDto, UpdateOwnerInput } from "#/shared/schemas/owner.schema";

export class UpdateOwnerUseCase {
  constructor(private readonly ownerRepository: IOwnerRepository) {}

  async execute(input: UpdateOwnerInput): Promise<OwnerDto> {
    return this.ownerRepository.update(input);
  }
}
