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
          <span>Billings & Invoices</span>
        </AppCardTitle>
      </AppCardHeader>
      <AppCardContent>
        <p className="text-lg">Waiting for Domain 7</p>
      </AppCardContent>
    </AppCard>
  );
}
