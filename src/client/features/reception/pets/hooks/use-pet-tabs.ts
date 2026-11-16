import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { usePetsDashboardContext } from "../contexts/pets-dashboard-provider";
import type { PetTabValue } from "../contexts/pets-dashboard-provider";

export type { PetTabValue };

export function usePetTabs() {
  const isMobile = useIsMobile();
  const { selectedTab, setSelectedTab } = usePetsDashboardContext();

  const effectiveTab: PetTabValue = isMobile ? "grid" : selectedTab;

  const handleSelectedTab = (value: string | number) => {
    if (value === "grid" || value === "list") {
      setSelectedTab(value);
    }
  };

  return {
    isMobile,
    selectedTab,
    effectiveTab,
    onSelectedTab: handleSelectedTab,
  };
}
