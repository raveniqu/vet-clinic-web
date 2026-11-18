import type { IUsersRepository } from "#/server/domain/users/repository";

export class GetUserByIdUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(id: string) {
    return this.usersRepository.getUserById(id);
  }
}
