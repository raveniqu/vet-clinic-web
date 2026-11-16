import type { IPetRepository } from "#/server/domain/pets/pet.repository.interface";
import type { SpeciesItem } from "#/shared/schemas/pet.schema";

export class GetSpeciesUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(): Promise<SpeciesItem[]> {
    return this.petRepository.getSpecies();
  }
}
