import { Building2, MessageCircle, UserRoundSearch } from "lucide-react";
import { useOwnersQuickFilters } from "#/client/features/reception/owners/hooks/use-owners-quick-filters";
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
import type { OwnerQuickFilterKey } from "#/shared/schemas/owner.schema";
import { OwnersColumnPicker } from "./owners-toolbar/owners-column-picker";
import { OwnersSearchInput } from "./owners-toolbar/owners-search-input";

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
  } = useOwnersQuickFilters();

  return (
    <AppCard className="h-fit">
      <AppCardHeader>
        <AppCardTitle>
          <UserRoundSearch className="size-4 text-primary" aria-hidden="true" />
          <span>ค้นหาเจ้าของสัตว์เลี้ยง</span>
        </AppCardTitle>
        <AppCardDescription>
          ค้นหาและกรองรายชื่อเจ้าของสัตว์เลี้ยงในระบบ
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
          ariaLabel="ตัวกรองด่วนเจ้าของสัตว์เลี้ยง"
          labelVisibility="md"
        />
      </AppCardFooter>
    </AppCard>
  );
}
