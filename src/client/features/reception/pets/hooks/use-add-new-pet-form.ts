import { useCallback, useEffect, useRef, useState } from "react";
import { useCreatePetMutation } from "#/client/caches/pets/mutates/create-pet.mutate";
import { useUpdatePetMutation } from "#/client/caches/pets/mutates/update-pet.mutate";
import { useWizardForm } from "#/client/shared/hooks/use-wizard-form";
import type { OwnerDto } from "#/shared/schemas/owner.schema";
import { createPetInputSchema } from "#/shared/schemas/pet.schema";
import type { CreatePetInput, PetDto } from "#/shared/schemas/pet.schema";
import {
  INITIAL_PET_FORM_VALUES,
  mapOwnerToSelectedSummary,
  mapPetToInput,
  mapPetToSelectedOwnerSummary,
  PET_STEP_SCHEMAS,
  resolvePetFieldStep,
} from "../models/pet-form";
import type { SelectedOwnerSummary } from "../models/pet-form";

export interface UseAddNewPetFormOptions {
  mode?: "create" | "edit";
  pet?: PetDto | null;
  isOpenControlled?: boolean;
  onOpenChangeControlled?: (open: boolean) => void;
  onSuccess?: (pet: PetDto) => void;
}

export function useAddNewPetForm({
  mode = "create",
  pet = null,
  isOpenControlled,
  onOpenChangeControlled,
  onSuccess,
}: UseAddNewPetFormOptions) {
  const createMutation = useCreatePetMutation();
  const updateMutation = useUpdatePetMutation();

  const submitHandlerRef = useRef<((data: CreatePetInput) => Promise<void>) | null>(null);

  const wizard = useWizardForm<CreatePetInput>({
    initialValues: () => (mode === "edit" && pet ? mapPetToInput(pet) : INITIAL_PET_FORM_VALUES),
    resetValues: INITIAL_PET_FORM_VALUES,
    routePath: "/pets",
    isOpenControlled,
    onOpenChangeControlled,
    stepSchemas: PET_STEP_SCHEMAS,
    fullSchema: createPetInputSchema,
    resolveFieldStep: resolvePetFieldStep,
    onSubmit: async (data) => {
      await submitHandlerRef.current?.(data);
    },
  });

  const { setIsOpen, setFieldValue, resetWizardState } = wizard;

  const [isNewOwnerModalOpen, setIsNewOwnerModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedOwnerSummary, setSelectedOwnerSummary] = useState<SelectedOwnerSummary | null>(
    () => (mode === "edit" && pet ? mapPetToSelectedOwnerSummary(pet) : null)
  );

  const resetForm = useCallback(() => {
    resetWizardState();
    setSelectedOwnerSummary(null);
  }, [resetWizardState]);

  submitHandlerRef.current = async (data: CreatePetInput) => {
    try {
      if (mode === "edit" && pet) {
        const updated = await updateMutation.mutateAsync({
          ...data,
          id: pet.id,
        });
        setIsOpen(false);
        onSuccess?.(updated);
        return;
      }

      await createMutation.mutateAsync(data);
      setIsOpen(false);
      resetForm();
    } catch {
      // Error toast is centrally managed by MutationCache in client/caches/global.ts
      return;
    }
  };

  useEffect(() => {
    if (mode === "edit" && pet) {
      resetWizardState(mapPetToInput(pet));
      setSelectedOwnerSummary(mapPetToSelectedOwnerSummary(pet));
    }
  }, [mode, pet, resetWizardState]);

  const handleOwnerCreated = useCallback(
    (newOwner: OwnerDto) => {
      setFieldValue("ownerId", newOwner.id);
      setSelectedOwnerSummary(mapOwnerToSelectedSummary(newOwner));
      setIsNewOwnerModalOpen(false);
    },
    [setFieldValue]
  );

  return {
    ...wizard,
    mode,
    isEdit: mode === "edit",
    isNewOwnerModalOpen,
    setIsNewOwnerModalOpen,
    isQrModalOpen,
    setIsQrModalOpen,
    selectedOwnerSummary,
    setSelectedOwnerSummary,
    handleOwnerCreated,
    resetForm,
  };
}
