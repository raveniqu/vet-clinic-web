import { queryOptions } from "@tanstack/react-query";
import { ownerKeys } from "#/client/caches/owners/keys";
import { getOwnerByIdFn } from "#/server-functions/owners/get-owner-by-id.fn";
import { getOwnersFn } from "#/server-functions/owners/get-owners.fn";
import type { OwnerDto } from "#/shared/schemas/owner.schema";

export function ownersListQueryOptions() {
  return queryOptions<OwnerDto[]>({
    queryKey: ownerKeys.lists(),
    queryFn: async () => {
      return getOwnersFn();
    },
  });
}

export function ownerDetailQueryOptions(id: number) {
  return queryOptions<OwnerDto | null>({
    queryKey: ownerKeys.detail(id),
    queryFn: async () => {
      return getOwnerByIdFn({ data: { id } });
    },
    enabled: Boolean(id),
  });
}
