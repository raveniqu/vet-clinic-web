import type {
  BreedItem,
  CreatePetInput,
  PetDto,
  SpeciesItem,
  UpdatePetInput,
} from "#/shared/schemas/pet.schema";

export interface IPetRepository {
  readonly getAll: () => Promise<PetDto[]>;
  readonly getById: (id: number) => Promise<PetDto | null>;
  readonly getByOwnerId: (ownerId: number) => Promise<PetDto[]>;
  readonly create: (input: CreatePetInput) => Promise<PetDto>;
  readonly update: (input: UpdatePetInput) => Promise<PetDto>;
  readonly getSpecies: () => Promise<SpeciesItem[]>;
  readonly getBreedsBySpecies: (speciesId?: number) => Promise<BreedItem[]>;
}
