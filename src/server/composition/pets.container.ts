import { CreatePetUseCase } from "#/server/application/pets/create-pet.use-case";
import { GetBreedsBySpeciesUseCase } from "#/server/application/pets/get-breeds-by-species.use-case";
import { GetPetByIdUseCase } from "#/server/application/pets/get-pet-by-id.use-case";
import { GetPetsByOwnerUseCase } from "#/server/application/pets/get-pets-by-owner.use-case";
import { GetPetsUseCase } from "#/server/application/pets/get-pets.use-case";
import { GetSpeciesUseCase } from "#/server/application/pets/get-species.use-case";
import { UpdatePetUseCase } from "#/server/application/pets/update-pet.use-case";
import { petRepository } from "./repositories";

export const getPetsUseCase = new GetPetsUseCase(petRepository);
export const getPetByIdUseCase = new GetPetByIdUseCase(petRepository);
export const getPetsByOwnerUseCase = new GetPetsByOwnerUseCase(petRepository);
export const createPetUseCase = new CreatePetUseCase(petRepository);
export const updatePetUseCase = new UpdatePetUseCase(petRepository);
export const getSpeciesUseCase = new GetSpeciesUseCase(petRepository);
export const getBreedsBySpeciesUseCase = new GetBreedsBySpeciesUseCase(petRepository);
