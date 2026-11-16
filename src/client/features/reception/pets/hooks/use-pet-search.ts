import { useSearchInput } from "#/client/shared/hooks/use-search-input";
import { usePetsDashboardContext } from "../contexts/pets-dashboard-provider";

export function usePetSearch() {
  const { searchTerm, setSearchTerm } = usePetsDashboardContext();
  return useSearchInput({ searchTerm, setSearchTerm });
}
