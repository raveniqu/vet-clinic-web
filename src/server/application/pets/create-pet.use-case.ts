import type { IPetRepository } from "#/server/domain/pets/pet.repository.interface";
import type { CreatePetInput, PetDto } from "#/shared/schemas/pet.schema";

export class CreatePetUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: CreatePetInput): Promise<PetDto> {
    return this.petRepository.create(input);
  }
}
