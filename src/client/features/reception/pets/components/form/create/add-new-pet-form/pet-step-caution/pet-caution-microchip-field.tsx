import { QrCode } from "lucide-react";
import { Field } from "#/client/shared/shadcn/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "#/client/shared/shadcn/components/ui/input-group";
import {
  AppFieldDescription,
  AppFieldError,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
} from "#/client/shared/components/app-field";
import { formatMicrochipNumber } from "#/client/shared/helpers/formatters";
import { usePetCaution } from "#/client/features/reception/pets/hooks/use-pet-caution";

export function PetCautionMicrochipField() {
  const { microchipNumber, microchipNumberError, handleMicrochipChange } = usePetCaution();

  return (
    <AppFieldSet>
      <AppFieldLegend>
        <QrCode className="size-4 text-primary" />
        <span>Microchip Identification</span>
      </AppFieldLegend>

      <Field data-invalid={!!microchipNumberError}>
        <AppFieldLabel htmlFor="pet-microchip">Microchip Number (Optional)</AppFieldLabel>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <QrCode className="size-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            id="pet-microchip"
            type="text"
            inputMode="numeric"
            maxLength={19}
            placeholder="e.g., 900-115-000-123-456"
            value={formatMicrochipNumber(microchipNumber)}
            onChange={handleMicrochipChange}
            className="tracking-wider placeholder:text-xs placeholder:tracking-normal"
          />
        </InputGroup>
        {microchipNumberError ? (
          <AppFieldError>{microchipNumberError}</AppFieldError>
        ) : (
          <AppFieldDescription>
            Standard 15-digit ISO 11784/11785 RFID microchip identification
          </AppFieldDescription>
        )}
      </Field>
    </AppFieldSet>
  );
}
