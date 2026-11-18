import type { IPetRepository } from "#/server/domain/pets/pet.repository.interface";
import type { PetDto } from "#/shared/schemas/pet.schema";

export class GetPetsByOwnerUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(ownerId: string): Promise<PetDto[]> {
    return this.petRepository.getByOwnerId(ownerId);
  }
}
