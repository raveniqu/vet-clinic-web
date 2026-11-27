import { Pill } from "lucide-react";
import { usePetCautionForm } from "#/client/features/pets/hooks/use-pet-caution-form";
import {
	AppFieldDescription,
	AppFieldError,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
} from "#/client/shared/components/app-field";
import { Field } from "#/client/shared/shadcn/components/ui/field";
import { Textarea } from "#/client/shared/shadcn/components/ui/textarea";

export function PetMedicalField() {
	const {
		allergies,
		allergiesError,
		handleAllergiesChange,
		medicalNotes,
		medicalNotesError,
		handleMedicalNotesChange,
	} = usePetCautionForm();

	return (
		<AppFieldSet>
			<AppFieldLegend>
				<Pill aria-hidden="true" />
				<span>ข้อควรระวังทางการแพทย์และประวัติการแพ้</span>
			</AppFieldLegend>

			<Field data-invalid={Boolean(allergiesError)}>
				<AppFieldLabel htmlFor="pet-allergies">
					ประวัติแพ้ยาและอาหาร (ไม่บังคับ)
				</AppFieldLabel>
				<Textarea
					id="pet-allergies"
					value={allergies}
					onChange={handleAllergiesChange}
					placeholder="เช่น ยาเพนิซิลลิน, เซฟาเลกซิน, ไอเวอร์เมกติน, โปรตีนจากไก่"
					className="min-h-18"
					aria-invalid={Boolean(allergiesError)}
				/>
				<AppFieldDescription>
					ข้อมูลความปลอดภัยสำคัญสำหรับการตรวจและสั่งจ่ายยา
				</AppFieldDescription>
				{allergiesError ? (
					<AppFieldError>{allergiesError}</AppFieldError>
				) : null}
			</Field>

			<Field data-invalid={Boolean(medicalNotesError)}>
				<AppFieldLabel htmlFor="pet-notes">
					โรคประจำตัว / บันทึกทางการแพทย์ (ไม่บังคับ)
				</AppFieldLabel>
				<Textarea
					id="pet-notes"
					value={medicalNotes}
					onChange={handleMedicalNotesChange}
					placeholder="เช่น โรคไตเรื้อรัง, เคยขาหักมาก่อน, ผิวหนังแพ้ง่าย"
					className="min-h-18"
					aria-invalid={Boolean(medicalNotesError)}
				/>
				<AppFieldDescription>
					โรคประจำตัว ประวัติการรักษาเดิม หรือข้อสังเกตทางคลินิก
				</AppFieldDescription>
				{medicalNotesError ? (
					<AppFieldError>{medicalNotesError}</AppFieldError>
				) : null}
			</Field>
		</AppFieldSet>
	);
}
