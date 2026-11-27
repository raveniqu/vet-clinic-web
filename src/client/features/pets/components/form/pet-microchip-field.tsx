import { QrCode } from "lucide-react";
import { usePetCautionForm } from "#/client/features/pets/hooks/use-pet-caution-form";
import { formatMicrochipNumber } from "#/client/features/pets/models/pet-form.model";
import {
	AppFieldDescription,
	AppFieldError,
	AppFieldLabel,
	AppFieldLegend,
	AppFieldSet,
} from "#/client/shared/components/app-field";
import {
	AppInputGroup,
	AppInputGroupInput,
} from "#/client/shared/components/app-input-group";
import { Field } from "#/client/shared/shadcn/components/ui/field";
import { InputGroupAddon } from "#/client/shared/shadcn/components/ui/input-group";

export function PetMicrochipField() {
	const { microchipNumber, microchipNumberError, handleMicrochipChange } =
		usePetCautionForm();

	return (
		<AppFieldSet>
			<AppFieldLegend>
				<QrCode aria-hidden="true" />
				<span>รหัสไมโครชิประบุตัวตน</span>
			</AppFieldLegend>

			<Field data-invalid={Boolean(microchipNumberError)}>
				<AppFieldLabel htmlFor="pet-microchip">
					หมายเลขไมโครชิป (ไม่บังคับ)
				</AppFieldLabel>
				<AppInputGroup>
					<InputGroupAddon align="inline-start">
						<QrCode
							className="size-4 text-muted-foreground"
							aria-hidden="true"
						/>
					</InputGroupAddon>
					<AppInputGroupInput
						id="pet-microchip"
						type="text"
						inputMode="numeric"
						maxLength={19}
						placeholder="เช่น 900-115-000-123-456"
						value={formatMicrochipNumber(microchipNumber)}
						onChange={handleMicrochipChange}
						aria-invalid={Boolean(microchipNumberError)}
						className="tracking-wider placeholder:text-xs placeholder:tracking-normal"
					/>
				</AppInputGroup>
				{microchipNumberError ? (
					<AppFieldError>{microchipNumberError}</AppFieldError>
				) : (
					<AppFieldDescription>
						หมายเลขไมโครชิป RFID มาตรฐาน ISO 11784/11785 จำนวน 15 หลัก
					</AppFieldDescription>
				)}
			</Field>
		</AppFieldSet>
	);
}
