import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { usePetQuickFilters } from "./use-pet-quick-filters";

export function usePetsToolbar() {
  const isMobile = useIsMobile();
  const quickFilterState = usePetQuickFilters();

  return {
    isMobile,
    ...quickFilterState,
  };
}
