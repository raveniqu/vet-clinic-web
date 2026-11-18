import { useCallback, useEffect, useRef } from "react";
import { useCreateOwnerMutation } from "#/client/caches/owners/mutates/create-owner.mutate";
import { useUpdateOwnerMutation } from "#/client/caches/owners/mutates/update-owner.mutate";
import type { GeoAddressSuggestion } from "#/client/shared/hooks/use-geo-thai";
import { useWizardForm } from "#/client/shared/hooks/use-wizard-form";
import { createOwnerInputSchema } from "#/shared/schemas/owner.schema";
import type { CreateOwnerInput, OwnerDto } from "#/shared/schemas/owner.schema";
import {
  applyOwnerFieldSideEffects,
  INITIAL_OWNER_FORM_VALUES,
  mapOwnerToInput,
  OWNER_STEP_SCHEMAS,
  resolveOwnerFieldStep,
} from "../models/owner-form";

export interface UseAddNewOwnerFormOptions {
  mode?: "create" | "edit";
  owner?: OwnerDto | null;
  isOpenControlled?: boolean;
  onOpenChangeControlled?: (open: boolean) => void;
  onSuccess?: (owner: OwnerDto) => void;
}

export function useAddNewOwnerForm({
  mode = "create",
  owner = null,
  isOpenControlled,
  onOpenChangeControlled,
  onSuccess,
}: UseAddNewOwnerFormOptions) {
  const createMutation = useCreateOwnerMutation();
  const updateMutation = useUpdateOwnerMutation();

  const submitHandlerRef = useRef<((data: CreateOwnerInput) => Promise<void>) | null>(null);

  const wizard = useWizardForm<CreateOwnerInput>({
    initialValues: () =>
      mode === "edit" && owner ? mapOwnerToInput(owner) : INITIAL_OWNER_FORM_VALUES,
    resetValues: INITIAL_OWNER_FORM_VALUES,
    routePath: "/owners",
    isOpenControlled,
    onOpenChangeControlled,
    stepSchemas: OWNER_STEP_SCHEMAS,
    fullSchema: createOwnerInputSchema,
    resolveFieldStep: resolveOwnerFieldStep,
    onFieldChangeSideEffects: applyOwnerFieldSideEffects,
    onSubmit: async (data) => {
      await submitHandlerRef.current?.(data);
    },
  });

  const { setIsOpen, setMultipleFields, resetWizardState } = wizard;

  const resetForm = useCallback(() => {
    resetWizardState();
  }, [resetWizardState]);

  submitHandlerRef.current = async (data: CreateOwnerInput) => {
    try {
      if (mode === "edit" && owner) {
        const updated = await updateMutation.mutateAsync({
          ...data,
          id: owner.id,
        });
        setIsOpen(false);
        onSuccess?.(updated);
        return;
      }

      const createdOwner = await createMutation.mutateAsync(data);
      setIsOpen(false);
      resetForm();
      onSuccess?.(createdOwner);
    } catch {
      // Error toast is centrally managed by MutationCache in client/caches/global.ts
      return;
    }
  };

  useEffect(() => {
    if (mode === "edit" && owner) {
      resetWizardState(mapOwnerToInput(owner));
    }
  }, [mode, owner, resetWizardState]);

  const handleSelectAddress = useCallback(
    (suggestion: GeoAddressSuggestion) => {
      setMultipleFields({
        subdistrict: suggestion.subdistrict,
        district: suggestion.district,
        province: suggestion.province,
        postalCode: suggestion.postalCode,
      });
    },
    [setMultipleFields]
  );

  return {
    ...wizard,
    mode,
    isEdit: mode === "edit",
    editingOwnerId: owner?.id,
    customerCode: owner?.customerCode,
    handleSelectAddress,
    resetForm,
  };
}
