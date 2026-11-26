import "@tanstack/react-start/server-only";
import { GetOwnerByIdUseCase } from "#/server/application/owners/get-owner-by-id.use-case";
import { ListOwnersUseCase } from "#/server/application/owners/list-owners.use-case";
import { DeleteOwnerUseCase } from "../application/owners/delete-owner.use-case";
import { RegisterOwnerUseCase } from "../application/owners/register-owner.use-case";
import { UpdateOwnerUseCase } from "../application/owners/update-owner.use-case";
import { ownerQueryAdapter, ownerRepository } from "./repositories";

export const listOwnersUseCase = new ListOwnersUseCase(ownerQueryAdapter);
export const getOwnerByIdUseCase = new GetOwnerByIdUseCase(ownerRepository);
export const registerOwnerUseCase = new RegisterOwnerUseCase(ownerRepository);
export const updateOwnerUseCase = new UpdateOwnerUseCase(ownerRepository);
export const deleteOwnerUseCase = new DeleteOwnerUseCase(ownerRepository);
