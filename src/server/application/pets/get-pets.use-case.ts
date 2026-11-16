import type { IPetRepository } from "#/server/domain/pets/pet.repository.interface";
import type { PetDto } from "#/shared/schemas/pet.schema";

export class GetPetsUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(): Promise<PetDto[]> {
    return this.petRepository.getAll();
  }
}
