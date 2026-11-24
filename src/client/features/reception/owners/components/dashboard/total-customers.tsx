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
          <AppCardTitle>ลูกค้าทั้งหมด</AppCardTitle>
        </div>
        <AppCardDescription>สรุปจำนวนเจ้าของสัตว์เลี้ยงที่ใช้งานอยู่</AppCardDescription>
      </AppCardHeader>
      <AppCardContent className="justify-between">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {totalOwnersCount}
          </div>
          <span className="text-xs font-medium text-muted-foreground">ใช้งานปกติ 100%</span>
        </div>

        <ItemGroup className="grid grid-cols-2 gap-2 text-xs">
          <Item variant="outline" size="xs" className="rounded-xl">
            <ItemContent className="flex flex-row justify-between">
              <ItemDescription className="text-sm">บุคคลธรรมดา</ItemDescription>
              <ItemTitle className="text-base">{individualCount}</ItemTitle>
            </ItemContent>
          </Item>
          <Item variant="outline" size="xs" className="rounded-xl">
            <ItemContent className="flex flex-row justify-between">
              <ItemDescription className="text-sm">นิติบุคคล / มูลนิธิ</ItemDescription>
              <ItemTitle className="text-base">{juristicCount}</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      </AppCardContent>
      <AppCardFooter>
        <AppCardFooterDescription className="flex items-center gap-1">
          <span>ยินยอม PDPA ครบทุกข้อ:</span>
          <strong className="font-medium text-foreground">
            {fullConsentCount} / {totalOwnersCount} ({fullConsentPercentage}%)
          </strong>
        </AppCardFooterDescription>
      </AppCardFooter>
    </AppCard>
  );
}
