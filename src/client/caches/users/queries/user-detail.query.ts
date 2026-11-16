import { queryOptions } from "@tanstack/react-query";
import { userKeys } from "../keys";
import { getUserByIdFn } from "#/server-functions/users/get-user-by-id.fn";

export const userDetailQueryOptions = (id: number) =>
  queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserByIdFn({ data: { id } }),
    staleTime: 60_000,
  });
