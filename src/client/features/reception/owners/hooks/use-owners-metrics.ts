import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ownersListQueryOptions } from "#/client/caches/owners/queries/owners.query";
import { computeOwnersMetrics } from "../models/owners-table";

export function useOwnersMetrics() {
  const { data: allOwners = [] } = useQuery(ownersListQueryOptions());

  return useMemo(() => computeOwnersMetrics(allOwners), [allOwners]);
}
