import { Edit } from "lucide-react";
import { usePetDetailEditForm } from "#/client/features/reception/pets/hooks/use-pet-detail-edit-form";
import { Button } from "#/client/shared/shadcn/components/ui/button";

export function PetDetailEditButton() {
  const { openEditDialog } = usePetDetailEditForm();

  return (
    <Button variant="outline" onClick={openEditDialog}>
      <Edit aria-hidden="true" />
      <span>แก้ไขข้อมูลสัตว์เลี้ยง</span>
    </Button>
  );
}
