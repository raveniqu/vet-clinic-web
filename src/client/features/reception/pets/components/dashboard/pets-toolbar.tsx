import { AlertTriangle, Cpu, HeartPulse, PawPrint, ShieldAlert } from "lucide-react";
import { usePetsToolbar } from "#/client/features/reception/pets/hooks/use-pets-toolbar";
import {
  AppCard,
  AppCardAction,
  AppCardContent,
  AppCardDescription,
  AppCardFooter,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";
import type { QuickFilterIconMeta } from "#/client/shared/components/app-quick-filters";
import { AppQuickFilters } from "#/client/shared/components/app-quick-filters";
import type { PetQuickFilterKey } from "#/shared/schemas/pet.schema";
import { PetsColumnPicker } from "./pets-toolbar/pets-column-picker";
import { PetSearchInput } from "./pets-toolbar/pets-search-input";
import { PetsSpeciesSelect } from "./pets-toolbar/pets-species-select";
import { PetsViewTabs } from "./pets-toolbar/pets-view-tabs";

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
  const {
    isMobile,
    quickFilters,
    filterOptions,
    activeFilterCount,
    hasActiveFilter,
    filteredCount,
    totalCount,
    onQuickFiltersChange,
    clearAllFilters,
  } = usePetsToolbar();

  return (
    <AppCard className="col-span-full h-fit">
      <AppCardHeader>
        <AppCardTitle>
          <PawPrint className="size-4 text-primary" aria-hidden="true" />
          <span className="line-clamp-1 text-ellipsis">ค้นหาสัตว์เลี้ยง</span>
        </AppCardTitle>
        <AppCardDescription>ค้นหาและกรองรายชื่อสัตว์เลี้ยงตามเงื่อนไขที่ต้องการ</AppCardDescription>
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
          ariaLabel="ตัวกรองด่วนสัตว์เลี้ยง"
          labelVisibility="lg"
        />
      </AppCardFooter>
    </AppCard>
  );
}
