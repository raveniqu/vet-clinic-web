import type { IPetRepository } from "#/server/domain/pets/pet.repository.interface";
import type { BreedItem } from "#/shared/schemas/pet.schema";

export class GetBreedsBySpeciesUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(speciesId?: number): Promise<BreedItem[]> {
    return this.petRepository.getBreedsBySpecies(speciesId);
  }
}
