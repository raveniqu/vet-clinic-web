import { useCallback } from "react";
import { useAddNewPetFormContext } from "#/client/features/reception/pets/contexts/add-new-pet-form-provider";
import { useFormErrors, useFormValues } from "#/client/shared/hooks/use-wizard-form";
import type { CreatePetInput } from "#/shared/schemas/pet.schema";

const PET_BIO_KEYS = ["sex", "reproductiveStatus"] as const;

export function usePetPhysicalBiological() {
  const { form, setFieldValue } = useAddNewPetFormContext();
  const { sex, reproductiveStatus } = useFormValues(form, PET_BIO_KEYS);
  const stepErrors = useFormErrors(form, PET_BIO_KEYS);

  const handleSexChange = useCallback(
    (nextSex: CreatePetInput["sex"]) => {
      setFieldValue("sex", nextSex);
    },
    [setFieldValue]
  );

  const handleReproductiveStatusChange = useCallback(
    (status: CreatePetInput["reproductiveStatus"]) => {
      setFieldValue("reproductiveStatus", status);
    },
    [setFieldValue]
  );

  return {
    sex,
    sexError: stepErrors.sex,
    handleSexChange,

    reproductiveStatus,
    reproductiveStatusError: stepErrors.reproductiveStatus,
    handleReproductiveStatusChange,
  };
}
