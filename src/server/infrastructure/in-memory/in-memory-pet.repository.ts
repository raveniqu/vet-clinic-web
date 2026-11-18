import type { IPetRepository } from "#/server/domain/pets/pet.repository.interface";
import type {
  BreedItem,
  CreatePetInput,
  PetDto,
  SpeciesItem,
  UpdatePetInput,
} from "#/shared/schemas/pet.schema";
import { InMemoryDb } from "./in-memory-db";

export class InMemoryPetRepository implements IPetRepository {
  private readonly db: InMemoryDb;

  constructor() {
    this.db = InMemoryDb.getInstance();
  }

  async getAll(): Promise<PetDto[]> {
    await this.db.simulateNetworkDelay(350);
    return this.db.getAllPets();
  }

  async getById(id: string): Promise<PetDto | null> {
    await this.db.simulateNetworkDelay(300);
    return this.db.getPetById(id);
  }

  async getByOwnerId(ownerId: string): Promise<PetDto[]> {
    await this.db.simulateNetworkDelay(300);
    return this.db.getPetsByOwnerId(ownerId);
  }

  async create(input: CreatePetInput): Promise<PetDto> {
    await this.db.simulateNetworkDelay(450);
    return this.db.insertPet(input);
  }

  async update(input: UpdatePetInput): Promise<PetDto> {
    await this.db.simulateNetworkDelay(450);
    return this.db.updatePet(input);
  }

  async getSpecies(): Promise<SpeciesItem[]> {
    await this.db.simulateNetworkDelay(200);
    return this.db.getSpecies();
  }

  async getBreedsBySpecies(speciesId?: number): Promise<BreedItem[]> {
    await this.db.simulateNetworkDelay(200);
    return this.db.getBreedsBySpecies(speciesId);
  }
}
