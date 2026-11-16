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
          <AppCardTitle>New Customers</AppCardTitle>
        </div>
        <AppCardDescription>Past 7 days registration</AppCardDescription>
        <AppCardAction>
          <SuccessBadge>+40% vs last week</SuccessBadge>
        </AppCardAction>
      </AppCardHeader>
      <AppCardContent className="justify-between">
        <AppCardTitle className="text-3xl font-bold tracking-tight text-foreground">4</AppCardTitle>
        <AppCardDescription className="leading-relaxed text-wrap">
          4 new clients joined the clinic recently (Liam O'Connor, Olivia Parker, Alexander Wright,
          Green Valley Sanctuary).
        </AppCardDescription>
      </AppCardContent>
      <AppCardFooter>
        <AppCardFooterDescription className="flex items-center gap-1">
          <PawPrint className="size-3 text-muted-foreground" />
          <span>12 new pets enrolled under recent registrations</span>
        </AppCardFooterDescription>
      </AppCardFooter>
    </AppCard>
  );
}
