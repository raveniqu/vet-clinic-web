import { CreateOwnerUseCase } from "#/server/application/owners/create-owner.use-case";
import { GetOwnerByIdUseCase } from "#/server/application/owners/get-owner-by-id.use-case";
import { GetOwnersUseCase } from "#/server/application/owners/get-owners.use-case";
import { UpdateOwnerUseCase } from "#/server/application/owners/update-owner.use-case";
import { ownerRepository } from "./repositories";

export const getOwnersUseCase = new GetOwnersUseCase(ownerRepository);
export const getOwnerByIdUseCase = new GetOwnerByIdUseCase(ownerRepository);
export const createOwnerUseCase = new CreateOwnerUseCase(ownerRepository);
export const updateOwnerUseCase = new UpdateOwnerUseCase(ownerRepository);
