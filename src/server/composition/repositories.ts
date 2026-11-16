import { InMemoryPetRepository } from "#/server/infrastructure/in-memory/in-memory-pet.repository";
import { InMemoryOwnerRepository } from "#/server/infrastructure/in-memory/in-memory-owner.repository";

// In-Memory Repositories for Frontend Development
export const petRepository = new InMemoryPetRepository();
export const ownerRepository = new InMemoryOwnerRepository();
