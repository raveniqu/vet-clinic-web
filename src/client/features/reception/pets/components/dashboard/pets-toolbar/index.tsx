import { AlertTriangle, Cpu, HeartPulse, PawPrint, ShieldAlert } from "lucide-react";
import {
  AppCard,
  AppCardAction,
  AppCardContent,
  AppCardDescription,
  AppCardFooter,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";

import { AppQuickFilters } from "#/client/shared/components/app-quick-filters";
import type { PetQuickFilterKey } from "#/client/features/reception/pets/models/pets-table";
import type { QuickFilterIconMeta } from "#/client/shared/components/app-quick-filters";

import { PetSearchInput } from "./pets-search-input";
import { PetsSpeciesSelect } from "./pets-species-select";
import { PetsColumnPicker } from "./pets-column-picker";
import { PetsViewTabs } from "./pets-view-tabs";

import { useIsMobile } from "#/client/shared/shadcn/hooks/use-mobile";
import { usePetQuickFilters } from "#/client/features/reception/pets/hooks/use-pet-quick-filters";

const QUICK_FILTER_ICON_META: Record<PetQuickFilterKey, QuickFilterIconMeta> = {
  hasAllergies: {
    icon: AlertTriangle,
    className: "stroke-destructive",
  },
  alertTemperament: {
    icon: ShieldAlert,
    className: "stroke-amber-600 dark:stroke-amber-400",
  },
  intact: {
    icon: HeartPulse,
    className: "stroke-lime-600 dark:stroke-lime-400",
  },
  missingMicrochip: {
    icon: Cpu,
  },
};

export function PetsToolbar() {
  const isMobile = useIsMobile();
  const {
    quickFilters,
    filterOptions,
    activeFilterCount,
    hasActiveFilter,
    filteredCount,
    totalCount,
    onQuickFiltersChange,
    clearAllFilters,
  } = usePetQuickFilters();

  return (
    <AppCard className="col-span-full h-fit">
      <AppCardHeader>
        <AppCardTitle>
          <PawPrint className="size-4 text-primary" aria-hidden="true" />
          <span className="line-clamp-1 text-ellipsis">Search Pets</span>
        </AppCardTitle>
        <AppCardDescription>Search and filter pets by conditions.</AppCardDescription>
        <AppCardAction>
          {isMobile ? (
            <PetsSpeciesSelect />
          ) : (
            <>
              <PetsColumnPicker />
              <PetsViewTabs />
            </>
          )}
        </AppCardAction>
      </AppCardHeader>
      <AppCardContent className="flex flex-row gap-3">
        <PetSearchInput />
        {!isMobile ? <PetsSpeciesSelect /> : null}
      </AppCardContent>
      <AppCardFooter>
        <AppQuickFilters
          quickFilters={quickFilters}
          filterOptions={filterOptions}
          activeFilterCount={activeFilterCount}
          hasActiveFilter={hasActiveFilter}
          filteredCount={filteredCount}
          totalCount={totalCount}
          onQuickFiltersChange={onQuickFiltersChange}
          clearAllFilters={clearAllFilters}
          iconMeta={QUICK_FILTER_ICON_META}
          ariaLabel="Quick pet filters"
          labelVisibility="lg"
        />
      </AppCardFooter>
    </AppCard>
  );
}
