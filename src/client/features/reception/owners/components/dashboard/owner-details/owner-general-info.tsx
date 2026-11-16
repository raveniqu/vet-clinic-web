import { ClipboardList, MapPin } from "lucide-react";
import { useOwnerDetails } from "#/client/features/reception/owners/hooks/use-owner-details";
import {
  AppCard,
  AppCardContent,
  AppCardHeader,
  AppCardTitle,
} from "#/client/shared/components/app-card";
import { formatTaxId } from "#/client/shared/helpers/formatters";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "#/client/shared/shadcn/components/ui/item";

export function OwnerGeneralInfo() {
  const { owner, fullBillingAddress, formattedRegisteredDate } = useOwnerDetails();

  return (
    <div className="flex flex-col gap-4 pt-4 lg:gap-6">
      <AppCard>
        <AppCardHeader>
          <AppCardTitle>
            <MapPin className="size-4 text-primary" />
            <span>Billing Address</span>
          </AppCardTitle>
        </AppCardHeader>
        <AppCardContent>
          <p>{fullBillingAddress}</p>
        </AppCardContent>
      </AppCard>
      <AppCard>
        <AppCardHeader>
          <AppCardTitle>
            <ClipboardList className="size-4 text-primary" />
            <span>Owner Details</span>
          </AppCardTitle>
        </AppCardHeader>
        <AppCardContent>
          <ItemGroup className="grid grid-cols-2 gap-y-4!">
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">Customer Code</ItemDescription>
                <ItemTitle>{owner.customerCode}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">Customer Type</ItemDescription>
                <ItemTitle>{owner.customerType}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">Tax ID</ItemDescription>
                <ItemTitle>{formatTaxId(owner.taxId)}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">Registered Date</ItemDescription>
                <ItemTitle>{formattedRegisteredDate}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">Referral Source</ItemDescription>
                <ItemTitle>{owner.referralSource}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">Line ID</ItemDescription>
                <ItemTitle>{owner.lineId}</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </AppCardContent>
      </AppCard>
    </div>
  );
}
