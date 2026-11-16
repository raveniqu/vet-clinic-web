import { Building2, MessageCircle, UserRoundSearch } from "lucide-react";

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
import type { QuickFilterIconMeta } from "#/client/shared/components/app-quick-filters";

import { useOwnerQuickFilters } from "#/client/features/reception/owners/hooks/use-owner-quick-filters";
import type { OwnerQuickFilterKey } from "#/client/features/reception/owners/models/owners-table";

import { OwnersColumnPicker } from "./owners-column-picker";
import { OwnersSearchInput } from "./owners-search-input";

const QUICK_FILTER_ICON_META: Record<OwnerQuickFilterKey, QuickFilterIconMeta> = {
  preferredLine: {
    icon: MessageCircle,
    className: "stroke-emerald-600 dark:stroke-emerald-400",
  },
  juristic: {
    icon: Building2,
  },
};

export function OwnersToolbar() {
  const {
    quickFilters,
    filterOptions,
    activeFilterCount,
    hasActiveFilter,
    filteredCount,
    totalCount,
    onQuickFiltersChange,
    clearAllFilters,
  } = useOwnerQuickFilters();

  return (
    <AppCard className="h-fit">
      <AppCardHeader>
        <AppCardTitle>
          <UserRoundSearch className="size-4 text-primary" aria-hidden="true" />
          <span>Search Owners</span>
        </AppCardTitle>
        <AppCardDescription>
          Find pet's owners and filter through list of owners.
        </AppCardDescription>
        <AppCardAction>
          <OwnersColumnPicker />
        </AppCardAction>
      </AppCardHeader>
      <AppCardContent>
        <OwnersSearchInput />
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
          ariaLabel="Quick owner filters"
          labelVisibility="md"
        />
      </AppCardFooter>
    </AppCard>
  );
}
