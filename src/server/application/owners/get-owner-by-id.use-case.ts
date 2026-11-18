import type { IOwnerRepository } from "#/server/domain/owners/owner.repository.interface";
import type { OwnerDto } from "#/shared/schemas/owner.schema";

export class GetOwnerByIdUseCase {
  constructor(private readonly ownerRepository: IOwnerRepository) {}

  async execute(id: string): Promise<OwnerDto | null> {
    return this.ownerRepository.getById(id);
  }
}
