import { Settings2, ShieldCheck } from "lucide-react";
import { useOwnerPreferencesPdpaForm } from "#/client/features/reception/owners/hooks/use-owner-preferences-pdpa-form";
import {
  AppFieldDescription,
  AppFieldLabel,
  AppFieldLegend,
  AppFieldSet,
  AppFieldTitle,
} from "#/client/shared/components/app-field";
import { Checkbox } from "#/client/shared/shadcn/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
} from "#/client/shared/shadcn/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/client/shared/shadcn/components/ui/select";

export function OwnerStepPreferencesPdpa() {
  const {
    values,
    errors,
    handleReferralSourceChange,
    handlePreferredChannelChange,
    handlePreferredTimeChange,
    handlePreferredLanguageChange,
    handlePdpaRemindersChange,
    handlePdpaMarketingChange,
    handlePdpaMediaChange,
  } = useOwnerPreferencesPdpaForm();

  return (
    <div className="flex flex-col gap-8">
      <AppFieldSet>
        <AppFieldLegend>
          <Settings2 />
          <span>Customer Preferences</span>
        </AppFieldLegend>
        <FieldContent className="gap-x-4 gap-y-6">
          <Field>
            <AppFieldLabel htmlFor="owner-referral">How did you hear about us?</AppFieldLabel>
            <Select value={values.referralSource} onValueChange={handleReferralSourceChange}>
              <SelectTrigger id="owner-referral" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                className="bg-transparent backdrop-blur-md"
              >
                <SelectItem value="Walk-in">Walk-in / Passing by</SelectItem>
                <SelectItem value="Friend / Referral">Friend / Referral</SelectItem>
                <SelectItem value="Facebook / Social Media">Facebook / Social Media</SelectItem>
                <SelectItem value="Google Search / Maps">Google Search / Google Maps</SelectItem>
                <SelectItem value="Partner Organization">Partner Clinic / Organization</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <FieldGroup className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
            <Field>
              <AppFieldLabel htmlFor="owner-pref-channel">Preferred Channel</AppFieldLabel>
              <Select value={values.preferredChannel} onValueChange={handlePreferredChannelChange}>
                <SelectTrigger id="owner-pref-channel" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  className="bg-transparent backdrop-blur-md"
                >
                  <SelectItem value="LINE">LINE Official</SelectItem>
                  <SelectItem value="PHONE">Phone Call</SelectItem>
                  <SelectItem value="SMS">SMS Message</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <AppFieldLabel htmlFor="owner-pref-time">Preferred Time</AppFieldLabel>
              <Select value={values.preferredTime} onValueChange={handlePreferredTimeChange}>
                <SelectTrigger id="owner-pref-time" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className="w-fit bg-transparent backdrop-blur-md"
                  alignItemWithTrigger={false}
                  align="start"
                >
                  <SelectItem value="09:00 - 12:00">Morning (09:00 - 12:00)</SelectItem>
                  <SelectItem value="13:00 - 17:00">Afternoon (13:00 - 17:00)</SelectItem>
                  <SelectItem value="17:00 - 20:00">Evening (17:00 - 20:00)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <AppFieldLabel htmlFor="owner-pref-lang">Language</AppFieldLabel>
              <Select
                value={values.preferredLanguage}
                onValueChange={handlePreferredLanguageChange}
              >
                <SelectTrigger id="owner-pref-lang" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  alignItemWithTrigger={false}
                  className="bg-transparent backdrop-blur-lg"
                >
                  <SelectItem value="EN">English</SelectItem>
                  <SelectItem value="TH">Thai</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldContent>
      </AppFieldSet>

      {/* Personal Data Protection (PDPA Consents) */}
      <AppFieldSet>
        <AppFieldLegend>
          <ShieldCheck />
          <span>
            Personal Data Protection <span className="hidden md:inline">(PDPA Consents)</span>
          </span>
        </AppFieldLegend>
        <FieldGroup className="gap-3">
          <Field orientation="horizontal" className="items-start">
            <Checkbox
              id="pdpa-privacy"
              checked={values.pdpaPrivacyNotice}
              disabled
              className="mt-1"
            />
            <AppFieldLabel
              htmlFor="pdpa-privacy"
              className="flex cursor-not-allowed flex-col items-start gap-0"
            >
              <AppFieldTitle>Acknowledge Privacy Notice & Medical Care Policy</AppFieldTitle>
              <AppFieldDescription>
                Required for opening veterinary patient record according to clinic standards.
              </AppFieldDescription>
            </AppFieldLabel>
            {errors.pdpaPrivacyNotice && <FieldError>{errors.pdpaPrivacyNotice}</FieldError>}
          </Field>
          <Field orientation="horizontal" className="items-start">
            <Checkbox
              id="pdpa-reminders"
              checked={values.pdpaReminders}
              onCheckedChange={handlePdpaRemindersChange}
              className="mt-1"
            />
            <AppFieldLabel htmlFor="pdpa-reminders">
              <AppFieldTitle>
                Consent to receive appointment, vaccination, and lab result reminders via SMS / LINE
              </AppFieldTitle>
            </AppFieldLabel>
          </Field>
          <Field orientation="horizontal" className="items-start">
            <Checkbox
              id="pdpa-marketing"
              checked={values.pdpaMarketing}
              onCheckedChange={handlePdpaMarketingChange}
              className="mt-0.5"
            />
            <AppFieldLabel htmlFor="pdpa-marketing">
              <AppFieldTitle>
                Consent to receive clinic updates, promotional offers, and special privileges
              </AppFieldTitle>
            </AppFieldLabel>
          </Field>
          <Field orientation="horizontal" className="items-start">
            <Checkbox
              id="pdpa-media"
              checked={values.pdpaMedia}
              onCheckedChange={handlePdpaMediaChange}
              className="mt-0.5"
            />
            <AppFieldLabel htmlFor="pdpa-media">
              <AppFieldTitle>
                Consent to pet photography and media recordings for clinic publications and
                communication
              </AppFieldTitle>
            </AppFieldLabel>
          </Field>
        </FieldGroup>
      </AppFieldSet>
    </div>
  );
}
