import type { IPetRepository } from "#/server/domain/pets/pet.repository.interface";
import type { PetDto, UpdatePetInput } from "#/shared/schemas/pet.schema";

export class UpdatePetUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: UpdatePetInput): Promise<PetDto> {
    return this.petRepository.update(input);
  }
}
