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
        <span>Medical Cautions & Allergies</span>
      </AppFieldLegend>

      {/* 1. Allergies & Known Sensitivities */}
      <Field data-invalid={!!allergiesError}>
        <AppFieldLabel htmlFor="pet-allergies">
          Known Drug & Food Allergies (Optional)
        </AppFieldLabel>
        <Textarea
          id="pet-allergies"
          value={allergies}
          onChange={handleAllergiesChange}
          placeholder="e.g., Penicillin, Cephalexin, Ivermectin, Chicken protein"
          className="min-h-18"
        />
        <AppFieldDescription>
          Critical safety information for clinical treatment
        </AppFieldDescription>
        {allergiesError && <AppFieldError>{allergiesError}</AppFieldError>}
      </Field>

      {/* 2. Pre-existing Conditions / Medical Notes */}
      <Field data-invalid={!!medicalNotesError}>
        <AppFieldLabel htmlFor="pet-notes">Pre-existing Medical Notes (Optional)</AppFieldLabel>
        <Textarea
          id="pet-notes"
          value={medicalNotes}
          onChange={handleMedicalNotesChange}
          placeholder="e.g., Chronic kidney disease, previous leg fracture, sensitive skin"
          className="min-h-18"
        />
        <AppFieldDescription>Prior chronic conditions or clinical observations</AppFieldDescription>
        {medicalNotesError && <AppFieldError>{medicalNotesError}</AppFieldError>}
      </Field>
    </AppFieldSet>
  );
}
