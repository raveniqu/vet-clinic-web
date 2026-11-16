import { useSearchInput } from "#/client/shared/hooks/use-search-input";
import { useOwnersDashboardContext } from "../contexts/owners-dashboard-provider";

export function useOwnersSearch() {
  const { searchTerm, setSearchTerm } = useOwnersDashboardContext();
  return useSearchInput({ searchTerm, setSearchTerm });
}
