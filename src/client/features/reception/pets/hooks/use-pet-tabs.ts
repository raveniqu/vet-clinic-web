import { useCallback } from "react";
import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import type { PetTabValue } from "#/shared/schemas/pet.schema";
import { usePetsSearch } from "./use-pets-search";

export function usePetTabs() {
  const isMobile = useIsMobile();
  const { selectedTab, setSelectedTab } = usePetsSearch();

  const effectiveTab: PetTabValue = isMobile ? "grid" : selectedTab;

  const handleSelectedTab = useCallback(
    (value: string | number) => {
      if (value === "grid" || value === "list") {
        setSelectedTab(value);
      }
    },
    [setSelectedTab]
  );

  return {
    isMobile,
    selectedTab,
    effectiveTab,
    onSelectedTab: handleSelectedTab,
  };
}
