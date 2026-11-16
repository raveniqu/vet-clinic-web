import { UsersRound } from "lucide-react";
import {
  AppCard,
  AppCardContent,
  AppCardDescription,
  AppCardFooter,
  AppCardFooterDescription,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";
import { useOwnersMetrics } from "#/client/features/reception/owners/hooks/use-owners-metrics";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";

export function TotalCustomers() {
  const {
    totalOwnersCount,
    individualCount,
    juristicCount,
    fullConsentCount,
    fullConsentPercentage,
  } = useOwnersMetrics();

  return (
    <AppCard>
      <AppCardHeader>
        <div className="flex items-center gap-2">
          <UsersRound className="size-4 text-primary" />
          <AppCardTitle>Total Customers</AppCardTitle>
        </div>
        <AppCardDescription>Active client registry breakdown</AppCardDescription>
      </AppCardHeader>
      <AppCardContent className="justify-between">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {totalOwnersCount}
          </div>
          <span className="text-xs font-medium text-muted-foreground">100% Active</span>
        </div>

        <ItemGroup className="grid grid-cols-2 gap-2 text-xs">
          <Item variant="outline" size="xs" className="rounded-xl">
            <ItemContent className="flex flex-row justify-between">
              <ItemDescription className="text-sm">Individual</ItemDescription>
              <ItemTitle className="text-base">{individualCount}</ItemTitle>
            </ItemContent>
          </Item>
          <Item variant="outline" size="xs" className="rounded-xl">
            <ItemContent className="flex flex-row justify-between">
              <ItemDescription className="text-sm">Juristic / Shelter</ItemDescription>
              <ItemTitle className="text-base">{juristicCount}</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </AppCardContent>
      <AppCardFooter>
        <AppCardFooterDescription className="flex items-center gap-1">
          <span>Full PDPA Consent:</span>
          <strong className="font-medium text-foreground">
            {fullConsentCount} / {totalOwnersCount} ({fullConsentPercentage}%)
          </strong>
        </AppCardFooterDescription>
      </AppCardFooter>
    </AppCard>
  );
}
