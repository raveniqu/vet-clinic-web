import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { ownersListQueryOptions } from "#/client/caches/owners/queries/owners.query";
import { useAddNewOwnerFormContext } from "#/client/features/reception/owners/contexts/add-new-owner-form-provider";
import { useFormErrors, useFormValues } from "#/client/shared/hooks/use-wizard-form";
import { genderEnum } from "#/shared/schemas/owner.schema";

const OWNER_STEP_1_KEYS = [
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
] as const;

export function useOwnerIdentityContactForm() {
  const { form, isOpen, mode, editingOwnerId, setFieldValue } = useAddNewOwnerFormContext();
  const values = useFormValues(form, OWNER_STEP_1_KEYS);
  const errors = useFormErrors(form, OWNER_STEP_1_KEYS);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data: allOwners = [] } = useQuery({
    ...ownersListQueryOptions(),
    enabled: isOpen,
  });

  // Live duplicate phone check against owners cache (ignore current owner when in edit mode)
  const duplicateOwner = useMemo(() => {
    if (!isOpen || !values.phonePrimary || values.phonePrimary.length < 9) return undefined;
    const trimmedPhone = values.phonePrimary.trim();
    return allOwners.find(
      (o) => o.phonePrimary === trimmedPhone && (mode !== "edit" || o.id !== editingOwnerId)
    );
  }, [isOpen, allOwners, values.phonePrimary, mode, editingOwnerId]);

  const isJuristic = values.customerType === "JURISTIC";

  const selectedDobDate = useMemo(
    () => (values.dateOfBirth ? new Date(values.dateOfBirth) : undefined),
    [values.dateOfBirth]
  );

  const formattedDobLabel = useMemo(() => {
    if (!values.dateOfBirth) return null;
    return new Date(values.dateOfBirth).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [values.dateOfBirth]);

  const calendarStartMonth = useMemo(() => new Date(1940, 0), []);
  const calendarEndMonth = useMemo(() => new Date(new Date().getFullYear() - 18, 11), []);
  const defaultDobMonth = useMemo(
    () =>
      values.dateOfBirth
        ? new Date(values.dateOfBirth)
        : new Date(new Date().getFullYear() - 25, 0),
    [values.dateOfBirth]
  );

  const handleCustomerTypeChange = useCallback(
    (value: string) => {
      if (value === "INDIVIDUAL" || value === "JURISTIC") {
        setFieldValue("customerType", value);
      }
    },
    [setFieldValue]
  );

  const handlePrefixChange = useCallback(
    (val: string | null) => {
      setFieldValue("prefix", val ?? (isJuristic ? "Company" : "Mr."));
    },
    [isJuristic, setFieldValue]
  );

  const handleFirstNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("firstName", e.target.value);
    },
    [setFieldValue]
  );

  const handleLastNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("lastName", e.target.value);
    },
    [setFieldValue]
  );

  const handleTaxIdChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("taxId", e.target.value.replace(/\D/g, "").slice(0, 13));
    },
    [setFieldValue]
  );

  const handleDobSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        setFieldValue("dateOfBirth", `${year}-${month}-${day}`);
      } else {
        setFieldValue("dateOfBirth", "");
      }
      setIsCalendarOpen(false);
    },
    [setFieldValue]
  );

  const handleGenderChange = useCallback(
    (val: string | null) => {
      const parsed = genderEnum.safeParse(val);
      if (parsed.success) {
        setFieldValue("gender", parsed.data);
      }
    },
    [setFieldValue]
  );

  const handlePhonePrimaryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("phonePrimary", e.target.value.replace(/\D/g, "").slice(0, 10));
    },
    [setFieldValue]
  );

  const handlePhoneSecondaryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("phoneSecondary", e.target.value.replace(/\D/g, "").slice(0, 10));
    },
    [setFieldValue]
  );

  const handleLineIdChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("lineId", e.target.value);
    },
    [setFieldValue]
  );

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFieldValue("email", e.target.value);
    },
    [setFieldValue]
  );

  return {
    values,
    errors,
    duplicateOwner,
    isJuristic,
    isCalendarOpen,
    setIsCalendarOpen,
    selectedDobDate,
    formattedDobLabel,
    calendarStartMonth,
    calendarEndMonth,
    defaultDobMonth,
    handleCustomerTypeChange,
    handlePrefixChange,
    handleFirstNameChange,
    handleLastNameChange,
    handleTaxIdChange,
    handleDobSelect,
    handleGenderChange,
    handlePhonePrimaryChange,
    handlePhoneSecondaryChange,
    handleLineIdChange,
    handleEmailChange,
  };
}
