import { PawPrint, UserRoundCheck } from "lucide-react";
import {
  AppCard,
  AppCardAction,
  AppCardContent,
  AppCardDescription,
  AppCardFooter,
  AppCardFooterDescription,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";

import { SuccessBadge } from "#/client/shared/components/app-badge";

export function NewCustomers() {
  return (
    <AppCard>
      <AppCardHeader>
        <div className="flex items-center gap-2">
          <UserRoundCheck className="size-4 text-primary" />
          <AppCardTitle>ลูกค้าใหม่</AppCardTitle>
        </div>
        <AppCardDescription>ลงทะเบียนในช่วง 7 วันที่ผ่านมา</AppCardDescription>
        <AppCardAction>
          <SuccessBadge>+40% จากสัปดาห์ก่อน</SuccessBadge>
        </AppCardAction>
      </AppCardHeader>
      <AppCardContent className="justify-between">
        <AppCardTitle className="text-3xl font-bold tracking-tight text-foreground">4</AppCardTitle>
        <AppCardDescription className="leading-relaxed text-wrap">
          มีลูกค้าลงทะเบียนใหม่ 4 รายล่าสุด (คุณชญานิศ ปัญญารัตน์, นายวิศรุต อัครเดช, นางสาววรรณพร
          จิตรประสงค์, บริษัท แฮปปี้เพ็ท แคร์ จำกัด)
        </AppCardDescription>
      </AppCardContent>
      <AppCardFooter>
        <AppCardFooterDescription className="flex items-center gap-1">
          <PawPrint className="size-3 text-muted-foreground" />
          <span>มีสัตว์เลี้ยงลงทะเบียนใหม่ 12 ตัวภายใต้ลูกค้ากลุ่มล่าสุด</span>
        </AppCardFooterDescription>
      </AppCardFooter>
    </AppCard>
  );
}
