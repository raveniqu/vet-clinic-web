import { useCallback } from "react";
import { useAddNewOwnerFormContext } from "#/client/features/reception/owners/contexts/add-new-owner-form-provider";
import { useFormErrors, useFormValues } from "#/client/shared/hooks/use-wizard-form";
import { preferredChannelEnum, preferredLanguageEnum } from "#/shared/schemas/owner.schema";

const OWNER_STEP_3_KEYS = [
  "referralSource",
  "preferredChannel",
  "preferredTime",
  "preferredLanguage",
  "pdpaPrivacyNotice",
  "pdpaReminders",
  "pdpaMarketing",
  "pdpaMedia",
] as const;

export function useOwnerPreferencesPdpaForm() {
  const { form, setFieldValue } = useAddNewOwnerFormContext();
  const values = useFormValues(form, OWNER_STEP_3_KEYS);
  const errors = useFormErrors(form, OWNER_STEP_3_KEYS);

  const handleReferralSourceChange = useCallback(
    (val: string | null) => {
      setFieldValue("referralSource", val ?? "Walk-in");
    },
    [setFieldValue]
  );

  const handlePreferredChannelChange = useCallback(
    (val: string | null) => {
      const parsed = preferredChannelEnum.safeParse(val);
      setFieldValue("preferredChannel", parsed.success ? parsed.data : "LINE");
    },
    [setFieldValue]
  );

  const handlePreferredTimeChange = useCallback(
    (val: string | null) => {
      setFieldValue("preferredTime", val ?? "13:00 - 17:00");
    },
    [setFieldValue]
  );

  const handlePreferredLanguageChange = useCallback(
    (val: string | null) => {
      const parsed = preferredLanguageEnum.safeParse(val);
      setFieldValue("preferredLanguage", parsed.success ? parsed.data : "EN");
    },
    [setFieldValue]
  );

  const handlePdpaRemindersChange = useCallback(
    (checked: boolean) => {
      setFieldValue("pdpaReminders", checked === true);
    },
    [setFieldValue]
  );

  const handlePdpaMarketingChange = useCallback(
    (checked: boolean) => {
      setFieldValue("pdpaMarketing", checked === true);
    },
    [setFieldValue]
  );

  const handlePdpaMediaChange = useCallback(
    (checked: boolean) => {
      setFieldValue("pdpaMedia", checked === true);
    },
    [setFieldValue]
  );

  return {
    values,
    errors,
    handleReferralSourceChange,
    handlePreferredChannelChange,
    handlePreferredTimeChange,
    handlePreferredLanguageChange,
    handlePdpaRemindersChange,
    handlePdpaMarketingChange,
    handlePdpaMediaChange,
  };
}
