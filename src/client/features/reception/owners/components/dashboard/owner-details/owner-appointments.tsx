import { Calendar } from "lucide-react";
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";

export function OwnerAppointments() {
  return (
    <AppCard className="mt-4">
      <AppCardHeader>
        <AppCardTitle>
          <Calendar className="size-4 text-primary" />
          <span>ประวัตินัดหมาย</span>
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent>
        <p className="text-sm text-muted-foreground">
          ยังไม่มีข้อมูลประวัตินัดหมาย (โมดูลนัดหมายอยู่ระหว่างการพัฒนา)
        </p>
      </AppCardContent>
    </AppCard>
  );
}
