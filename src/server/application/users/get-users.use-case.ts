import type { IUsersRepository } from "#/server/domain/users/repository";
import type { UserDto } from "#/shared/schemas/user.schema";

export class GetUsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(): Promise<UserDto[]> {
    return this.usersRepository.getAll();
  }
}
