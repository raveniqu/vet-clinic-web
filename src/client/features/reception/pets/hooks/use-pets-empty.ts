import { usePetsList } from "./use-pets-list";
import { usePetsSearch } from "./use-pets-search";

export function usePetsEmpty() {
  const { isEmptyDataset } = usePetsList();
  const { hasActiveFilter, clearFilters } = usePetsSearch();

  return {
    isEmptyDataset,
    hasActiveFilter,
    clearFilters,
  };
}
