import { Pill } from "lucide-react";
import { Field } from "#/client/shared/shadcn/components/ui/field";
import { Textarea } from "#/client/shared/shadcn/components/ui/textarea";
import {
  AppFieldDescription,
  AppFieldError,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
} from "#/client/shared/components/app-field";
import { usePetCaution } from "#/client/features/reception/pets/hooks/use-pet-caution";

export function PetCautionMedicalField() {
  const {
    allergies,
    allergiesError,
    handleAllergiesChange,

    medicalNotes,
    medicalNotesError,
    handleMedicalNotesChange,
  } = usePetCaution();

  return (
    <AppFieldSet>
      <AppFieldLegend>
        <Pill className="size-4 text-primary" />
        <span>ข้อควรระวังทางการแพทย์และประวัติการแพ้</span>
      </AppFieldLegend>

      {/* 1. Allergies & Known Sensitivities */}
      <Field data-invalid={!!allergiesError}>
        <AppFieldLabel htmlFor="pet-allergies">ประวัติแพ้ยาและอาหาร (ไม่บังคับ)</AppFieldLabel>
        <Textarea
          id="pet-allergies"
          value={allergies}
          onChange={handleAllergiesChange}
          placeholder="เช่น ยาเพนิซิลลิน, เซฟาเลกซิน, ไอเวอร์เมกติน, โปรตีนจากไก่"
          className="min-h-18"
        />
        <AppFieldDescription>ข้อมูลความปลอดภัยสำคัญสำหรับการตรวจและสั่งจ่ายยา</AppFieldDescription>
        {allergiesError && <AppFieldError>{allergiesError}</AppFieldError>}
      </Field>

      {/* 2. Pre-existing Conditions / Medical Notes */}
      <Field data-invalid={!!medicalNotesError}>
        <AppFieldLabel htmlFor="pet-notes">โรคประจำตัว / บันทึกทางการแพทย์ (ไม่บังคับ)</AppFieldLabel>
        <Textarea
          id="pet-notes"
          value={medicalNotes}
          onChange={handleMedicalNotesChange}
          placeholder="เช่น โรคไตเรื้อรัง, เคยขาหักมาก่อน, ผิวหนังแพ้ง่าย"
          className="min-h-18"
        />
        <AppFieldDescription>โรคประจำตัว ประวัติการรักษาเดิม หรือข้อสังเกตทางคลินิก</AppFieldDescription>
        {medicalNotesError && <AppFieldError>{medicalNotesError}</AppFieldError>}
      </Field>
    </AppFieldSet>
  );
}
