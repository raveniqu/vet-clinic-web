import type { IOwnerRepository } from "#/server/domain/owners/owner.repository.interface";
import type { CreateOwnerInput, OwnerDto, UpdateOwnerInput } from "#/shared/schemas/owner.schema";
import { InMemoryDb } from "./in-memory-db";

export class InMemoryOwnerRepository implements IOwnerRepository {
  private readonly db: InMemoryDb;

  constructor() {
    this.db = InMemoryDb.getInstance();
  }

  async getAll(): Promise<OwnerDto[]> {
    await this.db.simulateNetworkDelay(350);
    return this.db.getAllOwners();
  }

  async getById(id: string): Promise<OwnerDto | null> {
    await this.db.simulateNetworkDelay(300);
    return this.db.getOwnerById(id);
  }

  async create(input: CreateOwnerInput): Promise<OwnerDto> {
    await this.db.simulateNetworkDelay(450);
    return this.db.insertOwner(input);
  }

  async update(input: UpdateOwnerInput): Promise<OwnerDto> {
    await this.db.simulateNetworkDelay(450);
    return this.db.updateOwner(input);
  }
}
