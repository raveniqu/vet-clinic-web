import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { petsListQueryOptions } from "#/client/caches/pets/queries/pets.query";
import { computePetsMetrics } from "../models/pets-table";

export function usePets() {
  const { data: allPets = [], isLoading, isError, error } = useQuery(petsListQueryOptions());

  const metrics = useMemo(() => computePetsMetrics(allPets), [allPets]);

  return {
    isLoading,
    isError,
    error,
    ...metrics,
  };
}
