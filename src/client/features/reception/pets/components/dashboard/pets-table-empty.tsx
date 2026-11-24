import { PawPrint } from "lucide-react";
import { Button } from "#/client/shared/shadcn/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/client/shared/shadcn/components/ui/empty";
import { usePetsEmpty } from "#/client/features/reception/pets/hooks/use-pets-empty";

export function PetsTableEmpty() {
  const { isEmptyDataset, hasActiveFilter, clearFilters } = usePetsEmpty();

  return (
    <Empty className="py-10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PawPrint aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>
          {isEmptyDataset
            ? "ยังไม่มีข้อมูลสัตว์เลี้ยงในระบบ"
            : "ไม่พบข้อมูลสัตว์เลี้ยงที่ตรงกับตัวกรอง"}
        </EmptyTitle>
        <EmptyDescription>
          {isEmptyDataset
            ? "เริ่มต้นด้วยการลงทะเบียนสัตว์เลี้ยงใหม่จากปุ่มด้านบน"
            : "ลองปรับคำค้นหา ชนิดสัตว์ หรือตัวกรองด่วนใหม่อีกครั้ง"}
        </EmptyDescription>
      </EmptyHeader>
      {hasActiveFilter ? (
        <EmptyContent>
          <Button size="sm" variant="outline" onClick={clearFilters}>
            ล้างตัวกรองทั้งหมด
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
