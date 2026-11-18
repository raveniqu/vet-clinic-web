import { useSearchInput } from "#/client/shared/hooks/use-search-input";
import { usePetsSearch } from "./use-pets-search";

export function usePetSearch() {
  const { searchTerm, setSearchTerm } = usePetsSearch();
  return useSearchInput({ searchTerm, setSearchTerm });
}
