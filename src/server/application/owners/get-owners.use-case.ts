import type { IOwnerRepository } from "#/server/domain/owners/owner.repository.interface";
import type { OwnerDto } from "#/shared/schemas/owner.schema";

export class GetOwnersUseCase {
  constructor(private readonly ownerRepository: IOwnerRepository) {}

  async execute(): Promise<OwnerDto[]> {
    return this.ownerRepository.getAll();
  }
}
