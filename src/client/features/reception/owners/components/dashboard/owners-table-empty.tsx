import { UsersRound } from "lucide-react";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";
import { useOwnersList } from "#/client/features/reception/owners/hooks/use-owners-list";
import { useOwnersSearch } from "#/client/features/reception/owners/hooks/use-owners-search";

export function OwnersTableEmpty() {
  const { isEmptyDataset, hasActiveFilter } = useOwnersList();
  const { resetFilters } = useOwnersSearch();

  return (
    <Empty className="py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UsersRound aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>
          {isEmptyDataset
            ? "ยังไม่มีข้อมูลเจ้าของสัตว์เลี้ยงในระบบ"
            : "ไม่พบข้อมูลเจ้าของสัตว์เลี้ยงที่ตรงกับตัวกรอง"}
        </EmptyTitle>
        <EmptyDescription>
          {isEmptyDataset
            ? "เริ่มต้นด้วยการลงทะเบียนเจ้าของสัตว์เลี้ยงใหม่จากปุ่มด้านบน"
            : "ลองปรับคำค้นหาหรือตัวกรองด่วนใหม่อีกครั้ง"}
        </EmptyDescription>
      </EmptyHeader>
      {hasActiveFilter ? (
        <EmptyContent>
          <Button type="button" size="sm" variant="outline" onClick={resetFilters}>
            ล้างตัวกรองทั้งหมด
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
