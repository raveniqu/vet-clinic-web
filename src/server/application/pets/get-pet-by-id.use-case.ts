import type { IPetRepository } from "#/server/domain/pets/pet.repository.interface";
import type { PetDto } from "#/shared/schemas/pet.schema";

export class GetPetByIdUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(id: number): Promise<PetDto | null> {
    return this.petRepository.getById(id);
  }
}
