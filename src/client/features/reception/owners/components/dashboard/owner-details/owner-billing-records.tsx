import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";
import { Receipt } from "lucide-react";

export function OwnerBillingRecords() {
  return (
    <AppCard className="mt-4">
      <AppCardHeader>
        <AppCardTitle>
          <Receipt className="size-4 text-primary" />
          <span>ประวัติการชำระเงินและใบเสร็จ</span>
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent>
        <p className="text-sm text-muted-foreground">
          ยังไม่มีข้อมูลใบเสร็จและการชำระเงิน (โมดูลการเงินอยู่ระหว่างการพัฒนา)
        </p>
      </AppCardContent>
    </AppCard>
  );
}
