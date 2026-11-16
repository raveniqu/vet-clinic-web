import type { ChangeEvent } from "react";
import { useCallback } from "react";
import { useAddNewPetFormContext } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";
import { useFormErrors, useFormValues } from "#/client/shared/hooks/use-wizard-form";
import type { TemperamentAlert } from "#/shared/schemas/pet.schema";

const PET_CAUTION_KEYS = ["microchipNumber", "temperament", "allergies", "medicalNotes"] as const;
const PET_CAUTION_ERROR_KEYS = ["microchipNumber", "allergies", "medicalNotes"] as const;

export function usePetCaution() {
  const { form, setFieldValue } = useAddNewPetFormContext();
  const values = useFormValues(form, PET_CAUTION_KEYS);
  const stepErrors = useFormErrors(form, PET_CAUTION_ERROR_KEYS);

  const handleMicrochipChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 15);
      setFieldValue("microchipNumber", rawDigits);
    },
    [setFieldValue]
  );

  const handleTemperamentChange = useCallback(
    (val: TemperamentAlert) => {
      setFieldValue("temperament", val);
    },
    [setFieldValue]
  );

  const handleAllergiesChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setFieldValue("allergies", e.target.value);
    },
    [setFieldValue]
  );

  const handleMedicalNotesChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setFieldValue("medicalNotes", e.target.value);
    },
    [setFieldValue]
  );

  return {
    // Microchip
    microchipNumber: values.microchipNumber,
    microchipNumberError: stepErrors.microchipNumber,
    handleMicrochipChange,

    // Temperament
    temperament: values.temperament,
    handleTemperamentChange,

    // Allergies
    allergies: values.allergies,
    allergiesError: stepErrors.allergies,
    handleAllergiesChange,

    // Medical Notes
    medicalNotes: values.medicalNotes,
    medicalNotesError: stepErrors.medicalNotes,
    handleMedicalNotesChange,
  };
}
