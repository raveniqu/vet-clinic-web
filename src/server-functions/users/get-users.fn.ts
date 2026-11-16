import { createServerFn } from "@tanstack/react-start";
import type { UserDto } from "#/shared/schemas/user.schema";
import { getUsersUseCase } from "#/server/composition/users.container";

export const getUsersFn = createServerFn({
  method: "GET",
}).handler(async (): Promise<UserDto[]> => {
  return getUsersUseCase.execute();
});
