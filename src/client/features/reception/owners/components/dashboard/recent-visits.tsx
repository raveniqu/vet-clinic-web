import { Clock, ExternalLink, History } from "lucide-react";
import { Button } from "#/client/shared/shadcn/components/ui/button";

import {
  AppCard,
  AppCardAction,
  AppCardContent,
  AppCardDescription,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";
import { InfoBadge, SuccessBadge } from "#/client/shared/components/app-badge";

// ข้อมูลจำลองประวัติการเข้ารับบริการล่าสุด
const recentVisits = [
  {
    id: 1,
    ownerName: "วิภาดา ศรีสุวรรณ",
    petName: "โมจิ",
    species: "กระต่าย",
    service: "ตรวจสุขภาพทั่วไปและปรึกษาอาการแพ้",
    time: "วันนี้, 14:30",
    status: "เสร็จสิ้น",
    variant: "success" as const,
  },
  {
    id: 2,
    ownerName: "ปกรณ์ วัฒนากูล",
    petName: "โอริโอ้",
    species: "แมว",
    service: "ตรวจเซลล์ช่องหูและล้างช่องหู",
    time: "วันนี้, 11:15",
    status: "เสร็จสิ้น",
    variant: "success" as const,
  },
  {
    id: 3,
    ownerName: "ชญานิศ ปัญญารัตน์",
    petName: "เต้าหู้",
    species: "สุนัข",
    service: "ประเมินระบบทางเดินหายใจ",
    time: "เมื่อวาน, 16:00",
    status: "นัดติดตามอาการ",
    variant: "info" as const,
  },
  {
    id: 4,
    ownerName: "ปกรณ์ วัฒนากูล",
    petName: "ธอร์",
    species: "สุนัข",
    service: "ฉีดวัคซีนและตรวจคัดกรองพยาธิหนอนหัวใจ",
    time: "เมื่อวาน, 10:30",
    status: "เสร็จสิ้น",
    variant: "success" as const,
  },
  {
    id: 5,
    ownerName: "วิภาดา ศรีสุวรรณ",
    petName: "ลูน่า",
    species: "แมว",
    service: "ขูดหินปูนและดูแลสุขภาพช่องปาก",
    time: "2 วันที่แล้ว, 15:45",
    status: "เสร็จสิ้น",
    variant: "success" as const,
  },
];

export function RecentVisits() {
  return (
    <AppCard className="flex flex-col xl:max-h-124">
      <AppCardHeader>
        <div className="flex items-center gap-2">
          <History className="size-4 text-primary" />
          <AppCardTitle>การเข้ารับบริการล่าสุด</AppCardTitle>
        </div>
        <AppCardDescription>รายการตรวจและเข้ารับบริการล่าสุดของคลินิก</AppCardDescription>
        <AppCardAction>
          <Button size="icon-sm" variant="ghost" title="ดูประวัติการเข้ารับบริการทั้งหมด">
            <ExternalLink className="size-3.5" />
          </Button>
        </AppCardAction>
      </AppCardHeader>
      <AppCardContent className="flex min-h-0 flex-1 flex-col">
        <ItemGroup className="min-h-0 flex-1 overflow-y-auto">
          {recentVisits.map((visit) => (
            <Item key={visit.id} variant="outline" className="gap-2" size="xs">
              <ItemHeader>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Clock className="size-3" />
                  <span>{visit.time}</span>
                </div>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  className="text-muted-foreground"
                  title="ดูรายละเอียดการตรวจ"
                >
                  <ExternalLink className="size-3" />
                </Button>
              </ItemHeader>
              <ItemContent>
                <ItemTitle className="truncate text-foreground">
                  {visit.petName} ({visit.ownerName})
                </ItemTitle>
                <ItemDescription className="truncate text-xs text-muted-foreground">
                  {visit.service}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                {visit.variant === "success" ? (
                  <SuccessBadge>{visit.status}</SuccessBadge>
                ) : (
                  <InfoBadge>{visit.status}</InfoBadge>
                )}
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </AppCardContent>
    </AppCard>
  );
}
