import { getUserByIdUseCase } from "#/server/composition/users.container";
import { getUserByIdSchema } from "#/shared/schemas/user.schema";
import type { UserDto } from "#/shared/schemas/user.schema";
import { createServerFn } from "@tanstack/react-start";

export const getUserByIdFn = createServerFn({ method: "GET" })
  .validator(getUserByIdSchema)
  .handler(async ({ data }): Promise<UserDto> => {
    return getUserByIdUseCase.execute(data.id);
  });
