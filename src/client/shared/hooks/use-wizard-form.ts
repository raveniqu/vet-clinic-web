import { useSelector } from "@tanstack/react-form";
import type {
  AnyFieldLikeMetaBase,
  DeepKeys,
  DeepValue,
  FormValidateFn,
  GlobalFormValidationError,
} from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import type { ZodType } from "zod";
import {
  createZodStepValidatorErrors,
  extractFormErrorMessage,
  useAppForm,
} from "#/client/shared/components/app-form";
import type { AppFormApi } from "#/client/shared/components/app-form";

export type WizardStepNumber = 1 | 2 | 3;

export type WizardFormApi<TValues extends Record<string, unknown>> = AppFormApi<
  TValues,
  FormValidateFn<TValues>
>;

export interface UseWizardFormOptions<TValues extends Record<string, unknown>> {
  initialValues: TValues | (() => TValues);
  resetValues: TValues;
  routePath: "/owners" | "/pets";
  isOpenControlled?: boolean;
  onOpenChangeControlled?: (open: boolean) => void;
  stepSchemas: Record<WizardStepNumber, ZodType>;
  fullSchema: ZodType<TValues>;
  resolveFieldStep?: (fieldKey: string) => WizardStepNumber;
  onFieldChangeSideEffects?: <TField extends keyof TValues>(
    prev: TValues,
    field: TField,
    value: TValues[TField]
  ) => TValues;
  onSubmit?: (values: TValues) => Promise<void> | void;
}

export interface UseWizardFormReturn<TValues extends Record<string, unknown>> {
  form: WizardFormApi<TValues>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentStep: WizardStepNumber;
  setCurrentStep: (step: WizardStepNumber) => void;
  isSubmitting: boolean;
  clearFieldError: (fieldName: string) => void;
  setFieldValue: <TField extends keyof TValues>(field: TField, value: TValues[TField]) => void;
  setMultipleFields: (patch: Partial<TValues>) => void;
  validateStep: (step: WizardStepNumber) => boolean;
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: WizardStepNumber) => void;
  submitForm: () => Promise<void>;
  resetWizardState: (customValues?: TValues) => void;
}

function shallowEqualRecord<T extends Record<PropertyKey, unknown>>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.is(a[key], b[key])) return false;
  }
  return true;
}

function createInitialFieldMeta(
  prev: AnyFieldLikeMetaBase | undefined,
  patch: Partial<AnyFieldLikeMetaBase>
): AnyFieldLikeMetaBase {
  return {
    isValidating: prev?.isValidating ?? false,
    isTouched: prev?.isTouched ?? false,
    isBlurred: prev?.isBlurred ?? false,
    isDirty: prev?.isDirty ?? false,
    errorMap: prev?.errorMap ?? {},
    errorSourceMap: prev?.errorSourceMap ?? {},
    _arrayVersion: prev?._arrayVersion ?? 0,
    _pendingValidationsCount: prev?._pendingValidationsCount ?? 0,
    ...patch,
  };
}

export function resolveFirstFailedWizardStep(
  failedFieldKeys: readonly string[],
  resolveFieldStep?: (fieldKey: string) => WizardStepNumber
): WizardStepNumber {
  if (!resolveFieldStep) return 1;

  let firstFailedStep: WizardStepNumber = 3;
  for (const key of failedFieldKeys) {
    const step = resolveFieldStep(key);
    if (step < firstFailedStep) {
      firstFailedStep = step;
    }
  }
  return firstFailedStep;
}

export function useFormValues<
  TValues extends Record<string, unknown>,
  const TKeys extends readonly (keyof TValues)[],
>(form: WizardFormApi<TValues>, keys: TKeys): Pick<TValues, TKeys[number]> {
  return useSelector(
    form.store,
    (state) => {
      const slice = {} as Pick<TValues, TKeys[number]>;
      for (const key of keys) {
        slice[key] = state.values[key];
      }
      return slice;
    },
    { compare: shallowEqualRecord }
  );
}

export function useFormErrors<
  TValues extends Record<string, unknown>,
  const TKeys extends readonly (keyof TValues)[],
>(form: WizardFormApi<TValues>, keys: TKeys): Partial<Record<TKeys[number], string>> {
  return useSelector(
    form.store,
    (state) => {
      const slice = {} as Partial<Record<TKeys[number], string>>;
      const fieldMeta = state.fieldMeta as Record<
        string,
        { errors?: readonly unknown[] } | undefined
      >;
      for (const key of keys) {
        const message = extractFormErrorMessage(fieldMeta[String(key)]?.errors?.[0]);
        if (message) {
          slice[key] = message;
        }
      }
      return slice;
    },
    { compare: shallowEqualRecord }
  );
}

export function useFormField<TValues extends Record<string, unknown>, TKey extends keyof TValues>(
  form: WizardFormApi<TValues>,
  key: TKey
): TValues[TKey] {
  return useSelector(form.store, (state) => state.values[key]);
}

export function useFormFieldError<
  TValues extends Record<string, unknown>,
  TKey extends keyof TValues,
>(form: WizardFormApi<TValues>, key: TKey): string | undefined {
  return useSelector(form.store, (state) => {
    const fieldMeta = state.fieldMeta as Record<
      string,
      { errors?: readonly unknown[] } | undefined
    >;
    return extractFormErrorMessage(fieldMeta[String(key)]?.errors?.[0]);
  });
}

export function useWizardForm<TValues extends Record<string, unknown>>({
  initialValues,
  resetValues,
  routePath,
  isOpenControlled,
  onOpenChangeControlled,
  stepSchemas,
  fullSchema,
  resolveFieldStep,
  onFieldChangeSideEffects,
  onSubmit,
}: UseWizardFormOptions<TValues>): UseWizardFormReturn<TValues> {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const openAddNewForm = (search as { openAddNewForm?: boolean } | undefined)?.openAddNewForm;

  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const isOpen =
    isOpenControlled !== undefined ? isOpenControlled : isInternalOpen || Boolean(openAddNewForm);

  const setIsOpen = useCallback(
    (nextOpen: boolean) => {
      if (onOpenChangeControlled) {
        onOpenChangeControlled(nextOpen);
      } else {
        setIsInternalOpen(nextOpen);
      }

      if (!nextOpen && openAddNewForm && isOpenControlled === undefined) {
        void navigate({
          to: routePath,
          search: (prev: Record<string, unknown>) => {
            const { openAddNewForm: _, ...rest } = prev;
            return rest;
          },
          replace: true,
        });
      }
    },
    [navigate, openAddNewForm, onOpenChangeControlled, isOpenControlled, routePath]
  );

  const [currentStep, setCurrentStep] = useState<WizardStepNumber>(1);
  const [resolvedDefaultValues] = useState<TValues>(initialValues);

  const validateFullOnSubmit: FormValidateFn<TValues> = useCallback(
    ({ value }): GlobalFormValidationError<TValues> | undefined => {
      const fieldErrors = createZodStepValidatorErrors(fullSchema, value);
      if (Object.keys(fieldErrors).length === 0) {
        return undefined;
      }
      return {
        fields: fieldErrors as GlobalFormValidationError<TValues>["fields"],
      };
    },
    [fullSchema]
  );

  const form = useAppForm<
    TValues,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    FormValidateFn<TValues>,
    undefined,
    undefined,
    undefined,
    undefined,
    never
  >({
    defaultValues: resolvedDefaultValues,
    validators: {
      onSubmit: validateFullOnSubmit,
    },
    onSubmitInvalid: ({ formApi }) => {
      const fieldsErrors = formApi.getAllErrors().fields;
      const failedKeys = Object.keys(fieldsErrors);
      if (failedKeys.length > 0 && resolveFieldStep) {
        setCurrentStep(resolveFirstFailedWizardStep(failedKeys, resolveFieldStep));
      }
    },
    onSubmit: async ({ value }) => {
      if (!onSubmit) return;
      const parsed = fullSchema.parse(value);
      await onSubmit(parsed);
    },
  });

  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  const clearSubmitErrorOnField = useCallback(
    (fieldKey: DeepKeys<TValues>) => {
      const meta = form.getFieldMeta(fieldKey);
      if (!meta?.errorMap?.onSubmit) return;
      form.setFieldMeta(fieldKey, (prev) =>
        createInitialFieldMeta(prev, {
          errorMap: { ...prev?.errorMap, onSubmit: undefined },
        })
      );
    },
    [form]
  );

  const clearAllSubmitErrors = useCallback(() => {
    const metaKeys = Object.keys(form.state.fieldMeta) as DeepKeys<TValues>[];
    for (const key of metaKeys) {
      clearSubmitErrorOnField(key);
    }
  }, [form, clearSubmitErrorOnField]);

  const applyStepErrors = useCallback(
    (fieldErrors: Partial<Record<Extract<keyof TValues, string>, string>>) => {
      const activeErrorKeys = new Set(Object.keys(fieldErrors));
      const existingKeys = Object.keys(form.state.fieldMeta) as DeepKeys<TValues>[];

      for (const key of existingKeys) {
        if (!activeErrorKeys.has(String(key))) {
          clearSubmitErrorOnField(key);
        }
      }

      for (const [key, message] of Object.entries(fieldErrors)) {
        if (!message) continue;
        const fieldKey = key as DeepKeys<TValues>;
        form.setFieldMeta(fieldKey, (prev) =>
          createInitialFieldMeta(prev, {
            errorMap: { ...prev?.errorMap, onSubmit: message },
            errorSourceMap: { ...prev?.errorSourceMap, onSubmit: "form" },
          })
        );
      }
    },
    [form, clearSubmitErrorOnField]
  );

  const clearFieldError = useCallback(
    (fieldName: string) => {
      clearSubmitErrorOnField(fieldName as DeepKeys<TValues>);
    },
    [clearSubmitErrorOnField]
  );

  const setFieldValue = useCallback(
    <TField extends keyof TValues>(field: TField, value: TValues[TField]) => {
      if (onFieldChangeSideEffects) {
        const nextValues = onFieldChangeSideEffects(form.state.values, field, value);
        for (const key of Object.keys(nextValues) as (keyof TValues & string)[]) {
          if (key === field || !Object.is(nextValues[key], form.state.values[key])) {
            const fieldKey = key as DeepKeys<TValues>;
            form.setFieldValue(fieldKey, nextValues[key] as DeepValue<TValues, DeepKeys<TValues>>);
            clearSubmitErrorOnField(fieldKey);
          }
        }
        return;
      }

      const fieldKey = String(field) as DeepKeys<TValues>;
      form.setFieldValue(fieldKey, value as DeepValue<TValues, DeepKeys<TValues>>);
      clearSubmitErrorOnField(fieldKey);
    },
    [form, onFieldChangeSideEffects, clearSubmitErrorOnField]
  );

  const setMultipleFields = useCallback(
    (patch: Partial<TValues>) => {
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined) continue;
        const fieldKey = key as DeepKeys<TValues>;
        form.setFieldValue(fieldKey, value as DeepValue<TValues, DeepKeys<TValues>>);
        clearSubmitErrorOnField(fieldKey);
      }
    },
    [form, clearSubmitErrorOnField]
  );

  const validateStep = useCallback(
    (step: WizardStepNumber): boolean => {
      const schema = stepSchemas[step];
      const fieldErrors = createZodStepValidatorErrors(schema, form.state.values);
      if (Object.keys(fieldErrors).length === 0) {
        clearAllSubmitErrors();
        return true;
      }

      applyStepErrors(fieldErrors);
      return false;
    },
    [stepSchemas, form, clearAllSubmitErrors, applyStepErrors]
  );

  const nextStep = useCallback(() => {
    const isValid = validateStep(currentStep);
    if (!isValid) return false;

    if (currentStep < 3) {
      setCurrentStep((s) => (s + 1) as WizardStepNumber);
      clearAllSubmitErrors();
      return true;
    }
    return true;
  }, [currentStep, validateStep, clearAllSubmitErrors]);

  const prevStep = useCallback(() => {
    clearAllSubmitErrors();
    setCurrentStep((s) => (s > 1 ? ((s - 1) as WizardStepNumber) : s));
  }, [clearAllSubmitErrors]);

  const goToStep = useCallback(
    (step: WizardStepNumber) => {
      clearAllSubmitErrors();
      setCurrentStep(step);
    },
    [clearAllSubmitErrors]
  );

  const submitForm = useCallback(async () => {
    await form.handleSubmit();
  }, [form]);

  const resetWizardState = useCallback(
    (customValues?: TValues) => {
      form.reset(customValues ?? resetValues);
      setCurrentStep(1);
    },
    [form, resetValues]
  );

  return {
    form,
    isOpen,
    setIsOpen,
    currentStep,
    setCurrentStep,
    isSubmitting,
    clearFieldError,
    setFieldValue,
    setMultipleFields,
    validateStep,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    resetWizardState,
  };
}
