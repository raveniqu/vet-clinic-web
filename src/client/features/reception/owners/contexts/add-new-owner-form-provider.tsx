import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useCreateOwnerMutation } from "#/client/caches/owners/mutates/create-owner.mutate";
import { useUpdateOwnerMutation } from "#/client/caches/owners/mutates/update-owner.mutate";
import type { GeoAddressSuggestion } from "#/client/shared/hooks/use-geo-thai";
import { useWizardForm } from "#/client/shared/hooks/use-wizard-form";
import type { WizardFormApi, WizardStepNumber } from "#/client/shared/hooks/use-wizard-form";
import {
  createOwnerInputSchema,
  step1IdentityContactSchema,
  step2AddressSchema,
  step3PreferencesPdpaSchema,
} from "#/shared/schemas/owner.schema";
import type { CreateOwnerInput, OwnerDto } from "#/shared/schemas/owner.schema";

const initialValues: CreateOwnerInput = {
  customerType: "INDIVIDUAL",
  prefix: "Mr.",
  firstName: "",
  lastName: "",
  taxId: "",
  dateOfBirth: "",
  gender: "Not Specified",
  phonePrimary: "",
  phoneSecondary: "",
  lineId: "",
  email: "",
  addressLine: "",
  subdistrict: "",
  district: "",
  province: "",
  postalCode: "",
  referralSource: "Walk-in",
  preferredChannel: "LINE",
  preferredTime: "13:00 - 17:00",
  preferredLanguage: "EN",
  pdpaPrivacyNotice: true,
  pdpaReminders: true,
  pdpaMarketing: false,
  pdpaMedia: false,
};

export type WizardStep = WizardStepNumber;

const OWNER_STEP_SCHEMAS = {
  1: step1IdentityContactSchema,
  2: step2AddressSchema,
  3: step3PreferencesPdpaSchema,
} as const;

const STEP_1_FIELDS = new Set<string>([
  "customerType",
  "prefix",
  "firstName",
  "lastName",
  "taxId",
  "dateOfBirth",
  "gender",
  "phonePrimary",
  "phoneSecondary",
  "lineId",
  "email",
]);

const STEP_2_FIELDS = new Set<string>([
  "addressLine",
  "subdistrict",
  "district",
  "province",
  "postalCode",
]);

function resolveOwnerFieldStep(fieldKey: string): WizardStep {
  if (STEP_1_FIELDS.has(fieldKey)) return 1;
  if (STEP_2_FIELDS.has(fieldKey)) return 2;
  return 3;
}

export function mapOwnerToInput(owner: OwnerDto): CreateOwnerInput {
  return {
    customerType: owner.customerType,
    prefix: owner.prefix,
    firstName: owner.firstName,
    lastName: owner.lastName,
    taxId: owner.taxId,
    dateOfBirth: owner.dateOfBirth,
    gender: owner.gender,
    phonePrimary: owner.phonePrimary,
    phoneSecondary: owner.phoneSecondary,
    lineId: owner.lineId,
    email: owner.email,
    addressLine: owner.addressLine,
    subdistrict: owner.subdistrict,
    district: owner.district,
    province: owner.province,
    postalCode: owner.postalCode,
    referralSource: owner.referralSource,
    preferredChannel: owner.preferredChannel,
    preferredTime: owner.preferredTime,
    preferredLanguage: owner.preferredLanguage,
    pdpaPrivacyNotice: owner.pdpaPrivacyNotice,
    pdpaReminders: owner.pdpaReminders,
    pdpaMarketing: owner.pdpaMarketing,
    pdpaMedia: owner.pdpaMedia,
  };
}

function applyOwnerFieldSideEffects<TField extends keyof CreateOwnerInput>(
  prev: CreateOwnerInput,
  field: TField,
  value: CreateOwnerInput[TField]
): CreateOwnerInput {
  const next = { ...prev, [field]: value };

  if (field === "customerType") {
    if (value === "JURISTIC") {
      next.lastName = "";
      if (prev.prefix !== "Company" && prev.prefix !== "Foundation") {
        next.prefix = "Company";
      }
    } else if (value === "INDIVIDUAL") {
      if (prev.prefix === "Company" || prev.prefix === "Foundation") {
        next.prefix = "Mr.";
      }
    }
  }

  return next;
}

interface AddNewOwnerFormContextValue {
  form: WizardFormApi<CreateOwnerInput>;
  mode: "create" | "edit";
  isEdit: boolean;
  editingOwnerId?: number;
  customerCode?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentStep: WizardStep;
  isSubmitting: boolean;
  setFieldValue: <TField extends keyof CreateOwnerInput>(
    field: TField,
    value: CreateOwnerInput[TField]
  ) => void;
  setMultipleFields: (patch: Partial<CreateOwnerInput>) => void;
  handleSelectAddress: (suggestion: GeoAddressSuggestion) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: WizardStep) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
}

const AddNewOwnerFormContext = createContext<AddNewOwnerFormContextValue | null>(null);

export interface AddNewOwnerFormProviderProps {
  children: ReactNode;
  mode?: "create" | "edit";
  owner?: OwnerDto | null;
  isOpenControlled?: boolean;
  onOpenChangeControlled?: (open: boolean) => void;
  onSuccess?: (owner: OwnerDto) => void;
}

export function AddNewOwnerFormProvider({
  children,
  mode = "create",
  owner = null,
  isOpenControlled,
  onOpenChangeControlled,
  onSuccess,
}: AddNewOwnerFormProviderProps) {
  const {
    form,
    isOpen,
    setIsOpen,
    currentStep,
    setFieldValue,
    setMultipleFields,
    validateAll,
    nextStep,
    prevStep,
    goToStep,
    resetWizardState,
  } = useWizardForm<CreateOwnerInput>({
    initialValues: () => (mode === "edit" && owner ? mapOwnerToInput(owner) : initialValues),
    resetValues: initialValues,
    routePath: "/owners",
    isOpenControlled,
    onOpenChangeControlled,
    stepSchemas: OWNER_STEP_SCHEMAS,
    fullSchema: createOwnerInputSchema,
    resolveFieldStep: resolveOwnerFieldStep,
    onFieldChangeSideEffects: applyOwnerFieldSideEffects,
  });

  const createMutation = useCreateOwnerMutation();
  const updateMutation = useUpdateOwnerMutation();

  // Sync values when owner changes in edit mode
  useEffect(() => {
    if (mode === "edit" && owner) {
      resetWizardState(mapOwnerToInput(owner));
    }
  }, [mode, owner, resetWizardState]);

  // Auto-fill Geo Thai address components atomically via TanStack Form store
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

  const resetForm = useCallback(() => {
    resetWizardState();
  }, [resetWizardState]);

  const submitForm = useCallback(async () => {
    const validated = validateAll();
    if (!validated.success) return;

    try {
      if (mode === "edit" && owner) {
        const updated = await updateMutation.mutateAsync({
          ...validated.data,
          id: owner.id,
        });
        setIsOpen(false);
        onSuccess?.(updated);
      } else {
        const createdOwner = await createMutation.mutateAsync(validated.data);
        setIsOpen(false);
        resetForm();
        onSuccess?.(createdOwner);
      }
    } catch (e) {
      console.error("Failed to save owner:", e);
    }
  }, [validateAll, mode, owner, updateMutation, createMutation, setIsOpen, resetForm, onSuccess]);

  const value = useMemo<AddNewOwnerFormContextValue>(
    () => ({
      form,
      mode,
      isEdit: mode === "edit",
      editingOwnerId: owner?.id,
      customerCode: owner?.customerCode,
      isOpen,
      setIsOpen,
      currentStep,
      isSubmitting: createMutation.isPending || updateMutation.isPending,
      setFieldValue,
      setMultipleFields,
      handleSelectAddress,
      nextStep,
      prevStep,
      goToStep,
      submitForm,
      resetForm,
    }),
    [
      form,
      mode,
      owner?.id,
      owner?.customerCode,
      isOpen,
      setIsOpen,
      currentStep,
      createMutation.isPending,
      updateMutation.isPending,
      setFieldValue,
      setMultipleFields,
      handleSelectAddress,
      nextStep,
      prevStep,
      goToStep,
      submitForm,
      resetForm,
    ]
  );

  return (
    <AddNewOwnerFormContext.Provider value={value}>{children}</AddNewOwnerFormContext.Provider>
  );
}

export function useAddNewOwnerFormContext() {
  const context = useContext(AddNewOwnerFormContext);
  if (!context) {
    throw new Error("useAddNewOwnerFormContext must be used within an AddNewOwnerFormProvider");
  }
  return context;
}
