import { GetUsersUseCase } from "#/server/application/users/get-users.use-case";
import { UsersApiClient } from "#/server/infrastructure/users/users.api-client";
import { GetUserByIdUseCase } from "../application/users/get-user-by-id.use-case";

const usersApiClient = new UsersApiClient();

export const getUsersUseCase = new GetUsersUseCase(usersApiClient);
export const getUserByIdUseCase = new GetUserByIdUseCase(usersApiClient);
