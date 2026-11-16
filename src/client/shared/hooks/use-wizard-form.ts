import { useForm, useSelector } from "@tanstack/react-form";
import type { AnyFieldLikeMetaBase, ReactFormExtendedApi } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import type { ZodType } from "zod";

export type WizardStepNumber = 1 | 2 | 3;

export type WizardFormApi<TValues extends Record<string, unknown>> = ReactFormExtendedApi<
  TValues,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  never
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
}

export interface UseWizardFormReturn<TValues extends Record<string, unknown>> {
  form: WizardFormApi<TValues>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentStep: WizardStepNumber;
  setCurrentStep: (step: WizardStepNumber) => void;
  clearFieldError: (fieldName: string) => void;
  setFieldValue: <TField extends keyof TValues>(field: TField, value: TValues[TField]) => void;
  setMultipleFields: (patch: Partial<TValues>) => void;
  validateStep: (step: WizardStepNumber) => boolean;
  validateAll: () => { success: true; data: TValues } | { success: false };
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: WizardStepNumber) => void;
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

function createFieldMetaBase(
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

function extractFirstIssuePerField(
  issues: readonly { path: PropertyKey[]; message: string }[]
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
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
        const firstErr = fieldMeta[String(key)]?.errors?.[0];
        if (typeof firstErr === "string" && firstErr.length > 0) {
          slice[key] = firstErr;
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
    const firstErr = fieldMeta[String(key)]?.errors?.[0];
    return typeof firstErr === "string" && firstErr.length > 0 ? firstErr : undefined;
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

  const form: WizardFormApi<TValues> = useForm<
    TValues,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    never
  >({
    defaultValues: resolvedDefaultValues,
  });

  const applyFieldErrors = useCallback(
    (fieldErrors: Record<string, string>) => {
      form.baseStore.setState((prev) => {
        const existingEntries = Object.entries(prev.fieldMetaBase) as [
          string,
          AnyFieldLikeMetaBase | undefined,
        ][];
        const hasNewErrors = Object.keys(fieldErrors).length > 0;
        const hasExistingSubmitErrors = existingEntries.some(
          ([, meta]) => meta?.errorMap?.onSubmit !== undefined
        );

        if (!hasNewErrors && !hasExistingSubmitErrors) {
          return prev;
        }

        const nextFieldMetaBase: Record<string, AnyFieldLikeMetaBase | undefined> = {};

        for (const [key, meta] of existingEntries) {
          if (!meta) continue;
          if (meta.errorMap?.onSubmit !== undefined && !(key in fieldErrors)) {
            nextFieldMetaBase[key] = createFieldMetaBase(meta, {
              errorMap: { ...meta.errorMap, onSubmit: undefined },
            });
          } else {
            nextFieldMetaBase[key] = meta;
          }
        }

        for (const [key, message] of Object.entries(fieldErrors)) {
          const existing = nextFieldMetaBase[key];
          nextFieldMetaBase[key] = createFieldMetaBase(existing, {
            errorMap: { ...existing?.errorMap, onSubmit: message },
            errorSourceMap: { ...existing?.errorSourceMap, onSubmit: "form" },
          });
        }

        return {
          ...prev,
          fieldMetaBase: nextFieldMetaBase as typeof prev.fieldMetaBase,
        };
      });
    },
    [form]
  );

  const clearFieldError = useCallback(
    (fieldName: string) => {
      const currentMeta = form.baseStore.state.fieldMetaBase[fieldName as never] as
        | AnyFieldLikeMetaBase
        | undefined;
      if (!currentMeta?.errorMap?.onSubmit) return;

      form.setFieldMeta(fieldName as never, (prev) =>
        createFieldMetaBase(prev, {
          errorMap: { ...prev?.errorMap, onSubmit: undefined },
        })
      );
    },
    [form]
  );

  const setFieldValue = useCallback(
    <TField extends keyof TValues>(field: TField, value: TValues[TField]) => {
      form.baseStore.setState((prev) => {
        const currentValues = prev.values;
        const nextValues = onFieldChangeSideEffects
          ? onFieldChangeSideEffects(currentValues, field, value)
          : { ...currentValues, [field]: value };

        const fieldKey = String(field);
        const existingMeta = prev.fieldMetaBase[fieldKey as never] as
          | AnyFieldLikeMetaBase
          | undefined;

        const nextFieldMetaBase: Record<string, AnyFieldLikeMetaBase | undefined> = {
          ...prev.fieldMetaBase,
          [fieldKey]: createFieldMetaBase(existingMeta, {
            isTouched: true,
            isDirty: true,
            errorMap: { ...existingMeta?.errorMap, onSubmit: undefined },
          }),
        };

        return {
          ...prev,
          values: nextValues,
          fieldMetaBase: nextFieldMetaBase as typeof prev.fieldMetaBase,
        };
      });
    },
    [form, onFieldChangeSideEffects]
  );

  const setMultipleFields = useCallback(
    (patch: Partial<TValues>) => {
      form.baseStore.setState((prev) => {
        const nextValues = { ...prev.values, ...patch };
        const nextFieldMetaBase: Record<string, AnyFieldLikeMetaBase | undefined> = {
          ...prev.fieldMetaBase,
        };

        for (const key of Object.keys(patch)) {
          const existingMeta = nextFieldMetaBase[key];
          nextFieldMetaBase[key] = createFieldMetaBase(existingMeta, {
            isTouched: true,
            isDirty: true,
            errorMap: { ...existingMeta?.errorMap, onSubmit: undefined },
          });
        }

        return {
          ...prev,
          values: nextValues,
          fieldMetaBase: nextFieldMetaBase as typeof prev.fieldMetaBase,
        };
      });
    },
    [form]
  );

  const validateStep = useCallback(
    (step: WizardStepNumber): boolean => {
      const schema = stepSchemas[step];
      const currentValues = form.state.values;
      const result = schema.safeParse(currentValues);
      if (result.success) {
        applyFieldErrors({});
        return true;
      }

      applyFieldErrors(extractFirstIssuePerField(result.error.issues));
      return false;
    },
    [stepSchemas, form, applyFieldErrors]
  );

  const validateAll = useCallback((): { success: true; data: TValues } | { success: false } => {
    const currentValues = form.state.values;
    const result = fullSchema.safeParse(currentValues);
    if (result.success) {
      applyFieldErrors({});
      return { success: true, data: result.data };
    }

    const fieldErrors = extractFirstIssuePerField(result.error.issues);
    applyFieldErrors(fieldErrors);

    if (resolveFieldStep) {
      let firstFailedStep: WizardStepNumber = 3;
      for (const key of Object.keys(fieldErrors)) {
        const step = resolveFieldStep(key);
        if (step < firstFailedStep) {
          firstFailedStep = step;
        }
      }
      setCurrentStep(firstFailedStep);
    }

    return { success: false };
  }, [fullSchema, form, applyFieldErrors, resolveFieldStep]);

  const nextStep = useCallback(() => {
    const isValid = validateStep(currentStep);
    if (!isValid) return false;

    if (currentStep < 3) {
      setCurrentStep((s) => (s + 1) as WizardStepNumber);
      applyFieldErrors({});
      return true;
    }
    return true;
  }, [currentStep, validateStep, applyFieldErrors]);

  const prevStep = useCallback(() => {
    applyFieldErrors({});
    setCurrentStep((s) => (s > 1 ? ((s - 1) as WizardStepNumber) : s));
  }, [applyFieldErrors]);

  const goToStep = useCallback(
    (step: WizardStepNumber) => {
      applyFieldErrors({});
      setCurrentStep(step);
    },
    [applyFieldErrors]
  );

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
    clearFieldError,
    setFieldValue,
    setMultipleFields,
    validateStep,
    validateAll,
    nextStep,
    prevStep,
    goToStep,
    resetWizardState,
  };
}
