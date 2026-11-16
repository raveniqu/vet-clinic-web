import { queryOptions } from "@tanstack/react-query";
import { getUsersFn } from "#/server-functions/users/get-users.fn";
import { userKeys } from "../keys";

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.list(),
    queryFn: () => getUsersFn(),
    staleTime: 60_000,
  });
