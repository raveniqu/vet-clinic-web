import { ClipboardList, MapPin } from "lucide-react";
import { useOwnerDetails } from "#/client/features/reception/owners/hooks/use-owner-details";
import { CUSTOMER_TYPE_LABEL_MAP } from "#/client/features/reception/owners/models/owners-table";
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
            <span>ที่อยู่สำหรับออกใบเสร็จ</span>
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
            <span>ข้อมูลเจ้าของสัตว์เลี้ยง</span>
          </AppCardTitle>
        </AppCardHeader>
        <AppCardContent>
          <ItemGroup className="grid grid-cols-2 gap-y-4!">
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">รหัสลูกค้า</ItemDescription>
                <ItemTitle>{owner.customerCode}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">ประเภทลูกค้า</ItemDescription>
                <ItemTitle>{CUSTOMER_TYPE_LABEL_MAP[owner.customerType]}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">เลขประจำตัวผู้เสียภาษี</ItemDescription>
                <ItemTitle>{formatTaxId(owner.taxId)}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">วันที่ลงทะเบียน</ItemDescription>
                <ItemTitle>{formattedRegisteredDate}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">ช่องทางที่รู้จักคลินิก</ItemDescription>
                <ItemTitle>{owner.referralSource}</ItemTitle>
              </ItemContent>
            </Item>
            <Item size="xs" className="p-0">
              <ItemContent>
                <ItemDescription className="text-xs">LINE ID</ItemDescription>
                <ItemTitle>{owner.lineId || "—"}</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </AppCardContent>
      </AppCard>
    </div>
  );
}
