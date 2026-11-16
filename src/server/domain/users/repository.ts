import type { UserDto } from "#/shared/schemas/user.schema";

export interface IUsersRepository {
  readonly getAll: () => Promise<UserDto[]>;
  readonly getUserById: (id: number) => Promise<UserDto>;
}
